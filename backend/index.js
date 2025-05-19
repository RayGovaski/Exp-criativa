//index.js
import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import fs from "fs";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_secure_jwt_key_change_this_in_production";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
app.use('/uploads', express.static('uploads')); 

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = './uploads';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  }
});

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "A992176566kemi_",
    database: "exp_criativa",
});

// Test database connection
db.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to MySQL database:', err);
        return;
    }
    console.log('✅ Connected to MySQL database successfully!');
});

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'API is running successfully',
        endpoints: [
            'GET /apoiadores - List all apoiadores',
            'GET /test-db - Test database connection',
            'POST /apoiador - Create new apoiador'
        ]
    });
});

// Test database connection route
app.get('/test-db', (req, res) => {
    db.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', message: err.message });
        }
        return res.json({ 
            message: 'Database connection successful',
            data: results[0].solution
        });
    });
});

// Get all apoiadores
app.get('/apoiadores', (req, res) => {
    const q = "SELECT id, cpf, nome, data_nascimento, telefone, email, plano_nome, data_adesao, notificacoes FROM Apoiador";
    
    db.query(q, (err, data) => {
        if (err) {
            console.error("Error fetching apoiadores:", err);
            return res.status(500).json({ error: "Database error", message: err.message });
        }
        return res.json(data);
    });
});

// Create apoiador endpoint
app.post('/apoiador', upload.single('foto'), async (req, res) => {
    try {
        // Format data from request body
        const { nome, cpf, email, senha, data_nascimento, telefone, receberNotificacoes, plano_nome } = req.body;
        
        // CPF validation - remove non-numeric characters
        const cleanCpf = cpf.replace(/\D/g, '');
        if (cleanCpf.length !== 11) {
            return res.status(400).json({ error: "CPF inválido" });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Email inválido" });
        }
        
        // Password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);
        
        // Gerenciar arquivo de foto
        let fotoPath = null;
        if (req.file) {
            // Salvar o caminho do arquivo em vez do arquivo em si
            fotoPath = req.file.path;
        }
        
        // Clean telephone number - remove non-numeric characters except +
        const cleanTelefone = telefone.replace(/[^\d+]/g, '');
        
        // Format date to MySQL format (YYYY-MM-DD)
        const formattedDate = new Date(data_nascimento).toISOString().split('T')[0];
        
        // Insert into database - adaptado para a estrutura existente da tabela
        const q = `
            INSERT INTO Apoiador (cpf, nome, data_nascimento, telefone, email, senha, foto_path, notificacoes, plano_nome) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        // Preparar campos opcionais
        const notificacoesValue = receberNotificacoes ? 1 : 0;
        
        db.query(
            q, 
            [cleanCpf, nome, formattedDate, cleanTelefone, email, hashedPassword, fotoPath, notificacoesValue, plano_nome || null], 
            (err, data) => {
                if (err) {
                    console.error("Error creating apoiador:", err);
                    if (err.code === 'ER_DUP_ENTRY') {
                        if (err.sqlMessage.includes('cpf')) {
                            return res.status(409).json({ error: "CPF já cadastrado" });
                        } else if (err.sqlMessage.includes('email')) {
                            return res.status(409).json({ error: "Email já cadastrado" });
                        }
                    }
                    return res.status(500).json({ error: "Database error", message: err.message });
                }
                
                return res.status(201).json({ 
                    id: data.insertId,
                    message: "Apoiador cadastrado com sucesso!" 
                });
            }
        );
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ error: "Server error", message: error.message });
    }
});



// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        if (!email || !senha) {
            return res.status(400).json({ error: "Email e senha são obrigatórios" });
        }
        const q = "SELECT * FROM Apoiador WHERE email = ?";
        
        db.query(q, [email], async (err, data) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error", message: err.message });
            }
      
            if (data.length === 0) {
                return res.status(401).json({ error: "Email ou senha inválidos" });
            }
            
            const user = data[0];
            
            const isPasswordValid = await bcrypt.compare(senha, user.senha);
            
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Email ou senha inválidos" });
            }
            
            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email,
                    nome: user.nome,
                    role: 'apoiador' 
                },
                JWT_SECRET,
                { expiresIn: '24h' } 
            );
            
            return res.status(200).json({
                message: "Login realizado com sucesso!",
                user: {
                    id: user.id,
                    nome: user.nome,
                    email: user.email
                },
                token
            });
        });
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ error: "Server error", message: error.message });
    }
});

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Formato de token inválido" });
    }
    
    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next(); 
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
};

// Example of a protected route
app.get('/apoiador/profile', verifyToken, (req, res) => {
    // The verifyToken middleware will add the user object to the request
    const userId = req.user.id;
    
    const q = "SELECT id, cpf, nome, data_nascimento, telefone, email, plano_nome, data_adesao, notificacoes FROM Apoiador WHERE id = ?";
    
    db.query(q, [userId], (err, data) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error", message: err.message });
        }
        
        if (data.length === 0) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        
        return res.status(200).json(data[0]);
    });
});

app.listen(8000, () => {
    console.log("🚀 Servidor rodando na porta 8000");
});

// Proper error handling for database disconnections
process.on('SIGINT', () => {
    db.end((err) => {
        console.log('MySQL connection closed');
        process.exit(err ? 1 : 0);
    });
});


// Update password
app.put('/apoiador/update-senha', verifyToken, async (req, res) => {
    try {
        const { senhaAtual, novaSenha } = req.body;
        const userId = req.user.id;
        
        if (!senhaAtual || !novaSenha) {
            return res.status(400).json({ error: "Senha atual e nova senha são obrigatórias" });
        }
        
        // Get current user data with password
        const q = "SELECT * FROM Apoiador WHERE id = ?";
        db.query(q, [userId], async (err, data) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Erro no banco de dados", message: err.message });
            }
            
            if (data.length === 0) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
            
            const user = data[0];
            
            // Verify current password
            const isPasswordValid = await bcrypt.compare(senhaAtual, user.senha);
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Senha atual incorreta" });
            }
            
            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(novaSenha, salt);
            
            // Update password
            const updateQuery = "UPDATE Apoiador SET senha = ? WHERE id = ?";
            db.query(updateQuery, [hashedPassword, userId], (err, result) => {
                if (err) {
                    console.error("Error updating password:", err);
                    return res.status(500).json({ error: "Erro ao atualizar senha", message: err.message });
                }
                
                return res.status(200).json({ message: "Senha atualizada com sucesso" });
            });
        });
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ error: "Erro no servidor", message: error.message });
    }
});

// Update email
app.put('/apoiador/update-email', verifyToken, (req, res) => {
    try {
        const { email } = req.body;
        const userId = req.user.id;
        
        if (!email) {
            return res.status(400).json({ error: "Email é obrigatório" });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Email inválido" });
        }
        
        // Update email
        const q = "UPDATE Apoiador SET email = ? WHERE id = ?";
        db.query(q, [email, userId], (err, result) => {
            if (err) {
                console.error("Error updating email:", err);
                
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: "Este email já está em uso" });
                }
                
                return res.status(500).json({ error: "Erro no banco de dados", message: err.message });
            }
            
            // Update token with new email
            const token = jwt.sign(
                { 
                    id: userId, 
                    email: email,
                    nome: req.user.nome,
                    role: 'apoiador'
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            return res.status(200).json({ 
                message: "Email atualizado com sucesso",
                token
            });
        });
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ error: "Erro no servidor", message: error.message });
    }
});

// Update phone
app.put('/apoiador/update-telefone', verifyToken, (req, res) => {
    try {
        const { telefone } = req.body;
        const userId = req.user.id;
        
        if (!telefone) {
            return res.status(400).json({ error: "Telefone é obrigatório" });
        }
        
        // Clean telephone number - remove non-numeric characters except +
        const cleanTelefone = telefone.replace(/[^\d+]/g, '');
        
        // Update phone
        const q = "UPDATE Apoiador SET telefone = ? WHERE id = ?";
        db.query(q, [cleanTelefone, userId], (err, result) => {
            if (err) {
                console.error("Error updating phone:", err);
                return res.status(500).json({ error: "Erro no banco de dados", message: err.message });
            }
            
            return res.status(200).json({ message: "Telefone atualizado com sucesso" });
        });
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ error: "Erro no servidor", message: error.message });
    }
});

// Update profile photo
app.put('/apoiador/update-foto', verifyToken, upload.single('foto'), (req, res) => {
    try {
        const userId = req.user.id;
        
        if (!req.file) {
            return res.status(400).json({ error: "Nenhuma foto enviada" });
        }
        
        // Read file as buffer
        const foto = fs.readFileSync(req.file.path);
        
        // Remove temporary file
        fs.unlinkSync(req.file.path);
        
        // Update photo in database
        const q = "UPDATE Apoiador SET foto = ? WHERE id = ?";
        db.query(q, [foto, userId], (err, result) => {
            if (err) {
                console.error("Error updating photo:", err);
                return res.status(500).json({ error: "Erro no banco de dados", message: err.message });
            }
            
            return res.status(200).json({ message: "Foto atualizada com sucesso" });
        });
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ error: "Erro no servidor", message: error.message });
    }
});

// Rota para obter a imagem do apoiador
app.get('/apoiador/foto/:id', (req, res) => {
    const id = req.params.id;
    
    db.query('SELECT foto_path, foto FROM Apoiador WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar a foto" });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ error: "Apoiador não encontrado" });
        }
        
        // Verificar primeiro se existe um caminho para a foto
        if (result[0].foto_path) {
            const fotoPath = result[0].foto_path;
            
            // Verificar se o arquivo existe
            if (fs.existsSync(fotoPath)) {
                return res.sendFile(path.resolve(fotoPath));
            }
        }
        
        // Se não houver caminho ou o arquivo não existir, tentar usar o BLOB
        if (result[0].foto) {
            res.writeHead(200, {
                'Content-Type': 'image/jpeg', // ou determine o tipo de imagem dinamicamente
                'Content-Length': result[0].foto.length
            });
            return res.end(result[0].foto);
        }
        
        // Se nem caminho nem BLOB estiverem disponíveis
        return res.status(404).json({ error: "Imagem não encontrada" });
    });
});