
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import fs from "fs";
import path from "path";
import db from '../config/database.js';
import { JWT_SECRET } from '../middleware/auth.js';
import { validateCPF, validateEmail, cleanPhone, formatDateToMySQL } from '../utils/validators.js';

export const getAllApoiadores = (req, res) => {
    const q = "SELECT id, cpf, nome, data_nascimento, telefone, email, plano_nome, data_adesao, notificacoes FROM Apoiador";
    
    db.query(q, (err, data) => {
        if (err) {
            console.error("Error fetching apoiadores:", err);
            return res.status(500).json({ error: "Database error", message: err.message });
        }
        return res.json(data);
    });
};

export const createApoiador = async (req, res) => {
    try {
        const { nome, cpf, email, senha, data_nascimento, telefone, receberNotificacoes, plano_nome } = req.body;
        
        // Validations
        if (!validateCPF(cpf)) {
            return res.status(400).json({ error: "CPF inválido" });
        }
        
        if (!validateEmail(email)) {
            return res.status(400).json({ error: "Email inválido" });
        }
        
        // Password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);
        
        // Handle photo file
        let fotoPath = null;
        if (req.file) {
            fotoPath = req.file.path;
        }
        
        // Format data
        const cleanCpf = cpf.replace(/\D/g, '');
        const cleanTelefone = cleanPhone(telefone);
        const formattedDate = formatDateToMySQL(data_nascimento);
        const notificacoesValue = receberNotificacoes ? 1 : 0;
        
        // Insert into database
        const q = `
            INSERT INTO Apoiador (cpf, nome, data_nascimento, telefone, email, senha, foto_path, notificacoes, plano_nome) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
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
};

export const getProfile = (req, res) => {
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
};

export const updatePassword = async (req, res) => {
    try {
        const { senhaAtual, novaSenha } = req.body;
        const userId = req.user.id;
        
        if (!senhaAtual || !novaSenha) {
            return res.status(400).json({ error: "Senha atual e nova senha são obrigatórias" });
        }
        
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
            const isPasswordValid = await bcrypt.compare(senhaAtual, user.senha);
            
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Senha atual incorreta" });
            }
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(novaSenha, salt);
            
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
};

export const updateEmail = (req, res) => {
    try {
        const { email } = req.body;
        const userId = req.user.id;
        
        if (!email || !validateEmail(email)) {
            return res.status(400).json({ error: "Email inválido" });
        }
        
        const q = "UPDATE Apoiador SET email = ? WHERE id = ?";
        db.query(q, [email, userId], (err, result) => {
            if (err) {
                console.error("Error updating email:", err);
                
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: "Este email já está em uso" });
                }
                
                return res.status(500).json({ error: "Erro no banco de dados", message: err.message });
            }
            
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
};

export const updatePhone = (req, res) => {
    try {
        const { telefone } = req.body;
        const userId = req.user.id;
        
        if (!telefone) {
            return res.status(400).json({ error: "Telefone é obrigatório" });
        }
        
        const cleanTelefone = cleanPhone(telefone);
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
};

export const updatePhoto = (req, res) => {
    try {
        const userId = req.user.id;
        
        if (!req.file) {
            return res.status(400).json({ error: "Nenhuma foto enviada" });
        }

        console.log('File received:', req.file); // Debug log
        console.log('User ID:', userId); // Debug log

        // Get current user data to delete old photo if exists
        const getCurrentPhotoQuery = "SELECT foto_path FROM Apoiador WHERE id = ?";
        
        db.query(getCurrentPhotoQuery, [userId], (err, currentData) => {
            if (err) {
                console.error("Error getting current photo:", err);
                // Clean up uploaded file
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(500).json({ error: "Erro no banco de dados", message: err.message });
            }

            // Delete old photo file if it exists
            if (currentData.length > 0 && currentData[0].foto_path) {
                const oldPhotoPath = currentData[0].foto_path;
                if (fs.existsSync(oldPhotoPath)) {
                    try {
                        fs.unlinkSync(oldPhotoPath);
                        console.log('Old photo deleted:', oldPhotoPath);
                    } catch (deleteErr) {
                        console.warn("Could not delete old photo file:", deleteErr);
                    }
                }
            }

            // Update database with new photo path (store relative path)
            const relativePath = req.file.path.replace(/\\/g, '/'); // Normalize path separators
            const updateQuery = "UPDATE Apoiador SET foto_path = ? WHERE id = ?";
            
            db.query(updateQuery, [relativePath, userId], (err, result) => {
                if (err) {
                    console.error("Error updating photo in database:", err);
                    // Clean up uploaded file on error
                    if (fs.existsSync(req.file.path)) {
                        fs.unlinkSync(req.file.path);
                    }
                    return res.status(500).json({ error: "Erro no banco de dados", message: err.message });
                }
                
                if (result.affectedRows === 0) {
                    // Clean up uploaded file if no rows were affected
                    if (fs.existsSync(req.file.path)) {
                        fs.unlinkSync(req.file.path);
                    }
                    return res.status(404).json({ error: "Usuário não encontrado" });
                }
                
                console.log('Photo updated successfully for user:', userId);
                console.log('New photo path:', relativePath);
                
                return res.status(200).json({ 
                    message: "Foto atualizada com sucesso",
                    photoPath: relativePath 
                });
            });
        });
    } catch (error) {
        console.error("Server error in updatePhoto:", error);
        // Clean up uploaded file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({ error: "Erro no servidor", message: error.message });
    }
};

export const getPhoto = (req, res) => {
    const id = req.params.id;
    
    db.query('SELECT foto_path, foto FROM Apoiador WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error("Error fetching photo:", err);
            return res.status(500).json({ error: "Erro ao buscar a foto" });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ error: "Apoiador não encontrado" });
        }
        
        const apoiador = result[0];
        
        // First try to serve from file path
        if (apoiador.foto_path) {
            const fullPath = path.resolve(apoiador.foto_path);
            console.log('Trying to serve photo from:', fullPath);
            
            if (fs.existsSync(fullPath)) {
                return res.sendFile(fullPath);
            } else {
                console.warn('Photo file not found at path:', fullPath);
            }
        }
        
        // Fallback to blob data if file path doesn't work
        if (apoiador.foto) {
            res.writeHead(200, {
                'Content-Type': 'image/jpeg',
                'Content-Length': apoiador.foto.length
            });
            return res.end(apoiador.foto);
        }
        
        // No photo found
        return res.status(404).json({ error: "Imagem não encontrada" });
    });
};