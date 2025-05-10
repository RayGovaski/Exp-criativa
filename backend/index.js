import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

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
        const { nome, cpf, email, senha, data_nascimento, telefone, receberNotificacoes } = req.body;
        
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
        
        let foto = null;
        if (req.file) {
            // Read the file and convert to buffer
            foto = fs.readFileSync(req.file.path);
            // Remove the temporary file
            fs.unlinkSync(req.file.path);
        }
        
        // Clean telephone number - remove non-numeric characters except +
        const cleanTelefone = telefone.replace(/[^\d+]/g, '');
        
        // Format date to MySQL format (YYYY-MM-DD)
        const formattedDate = new Date(data_nascimento).toISOString().split('T')[0];
        
        // Insert into database
        const q = `
            INSERT INTO Apoiador (cpf, nome, data_nascimento, telefone, email, senha, foto, notificacoes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.query(
            q, 
            [cleanCpf, nome, formattedDate, cleanTelefone, email, hashedPassword, foto, receberNotificacoes ? 1 : 0], 
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