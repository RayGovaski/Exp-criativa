// backend/controllers/authController.js

import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

// Função auxiliar para buscar em cada tabela
const authenticateInTable = (email, password, table, role) => {
    return new Promise((resolve, reject) => {
        
        const query = `SELECT * FROM ?? WHERE email = ?`;
        
        db.query(query, [table, email], async (err, data) => {
            if (err) {
                console.error(`ERRO [Login-BE-${role}]: Erro no DB ao buscar ${role}:`, err);
                return reject(err);
            }

            if (data.length === 0) {
                console.log(`DEBUG [Login-BE-${role}]: Email "${email}" NÃO encontrado.`);
                return resolve(null);
            }

            const user = data[0];
            const isPasswordValid = await bcrypt.compare(password, user.senha);

            if (!isPasswordValid) {
                console.log(`DEBUG [Login-BE-${role}]: Senha incorreta para o email "${email}".`);
                return resolve(null);
            }
            
            console.log(`DEBUG [Login-BE-${role}]: Login BEM-SUCEDIDO!`);
            
            // Cria o "payload" do token com os dados essenciais
            const tokenPayload = {
                id: user.id,
                email: user.email,
                role: role,
                nome: user.nome || 'Administrador' 
            };

            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '24h' });
            
            resolve({ token });
        });
    });
};


// Agora o Administrador faz parte do loop de verificação
export const login = async (req, res) => {
    const { email, senha } = req.body;
    console.log(`DEBUG [Login-BE]: Requisição de login recebida para email: ${email}`);

    // Lista de todas as roles que podem fazer login pelo banco de dados
    const rolesToCheck = [
        { role: 'administrador', table: 'Administrador' },
        { role: 'apoiador', table: 'Apoiador' },
        { role: 'aluno', table: 'Aluno' },
        { role: 'professor', table: 'Professor' }
    ];

    try {
        for (const { role, table } of rolesToCheck) {
            console.log(`DEBUG [Login-BE]: Tentando autenticar como: ${role}`);
            const result = await authenticateInTable(email, senha, table, role);
            
            // Se encontrou o usuário, retorna o token e para a execução imediatamente
            if (result) {
                return res.status(200).json(result);
            }
        }

        // Se o loop terminar e ninguém for encontrado em nenhuma tabela
        console.log(`DEBUG [Login-BE]: Email "${email}" não encontrado em nenhuma tabela.`);
        res.status(401).json({ error: "Email ou senha inválidos." });

    } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor durante a autenticação." });
    }
};
