import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import { JWT_SECRET } from '../middleware/auth.js';
import { validateEmail } from '../utils/validators.js';

export const login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        if (!email || !senha) {
            return res.status(400).json({ error: "Email e senha são obrigatórios" });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ error: "Email inválido" });
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
};