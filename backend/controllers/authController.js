// backend/controllers/authController.js

import db from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/auth.js';
import { validateEmail } from '../utils/validators.js';

export const login = (req, res) => { 
    const { email, senha } = req.body;

    console.log('DEBUG [Login-BE]: Requisição de login recebida para email:', email);

    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Email inválido.' });
    }

    const userTypes = [
        { role: 'apoiador', table: 'Apoiador', fotoPathField: 'foto_path' },
        { role: 'aluno', table: 'Aluno', fotoPathField: 'foto_path' },
        { role: 'professor', table: 'Professor', fotoPathField: 'foto_path' }, // Professor também pode ter foto_path
        { role: 'administrador', table: 'Administrador', fotoPathField: null } // ADM geralmente não tem foto
    ];

    const authenticateInTable = (index) => {
        if (index >= userTypes.length) {
            console.log('DEBUG [Login-BE]: Tentou em todas as roles, credenciais inválidas. Retornando 401.');
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }

        const { role, table, fotoPathField } = userTypes[index];
        console.log(`DEBUG [Login-BE]: Tentando autenticar como: ${role} na tabela ${table}.`);
        
        // Seleciona campos, incluindo foto_path SE A COLUNA EXISTIR na tabela
        // Se fotoPathField for null, ou a coluna não existir, o SQL pode falhar.
        // O ideal é a coluna existir como NULLABLE nas tabelas que podem ter foto.
        const selectFields = `id, nome, email, senha${fotoPathField ? `, ${fotoPathField}` : ''}`;
        const q = `SELECT ${selectFields} FROM ${table} WHERE email = ?`;
        
        db.query(q, [email], (err, data) => {
            if (err) {
                console.error(`ERRO [Login-BE-${role}]: Erro no DB ao buscar ${table}:`, err);
                return res.status(500).json({ error: `Erro interno do servidor ao tentar login como ${role}.` });
            }

            if (data.length > 0) {
                const userInDb = data[0];
                console.log(`DEBUG [Login-BE-${role}]: Usuário encontrado na tabela ${table}. ID: ${userInDb.id}, Email: ${userInDb.email}.`);
                
                bcrypt.compare(senha, userInDb.senha, (bcryptErr, isPasswordValid) => {
                    if (bcryptErr) {
                        console.error(`ERRO [Login-BE-${role}]: Erro no bcrypt.compare:`, bcryptErr);
                        return res.status(500).json({ error: "Erro ao comparar senhas." });
                    }

                    console.log(`DEBUG [Login-BE-${role}]: Senha fornecida válida: ${isPasswordValid}.`);

                    if (!isPasswordValid) {
                        console.log(`DEBUG [Login-BE-${role}]: Senha INCORRETA para ${role}. Passando para a próxima role.`);
                        authenticateInTable(index + 1);
                    } else {
                        console.log(`DEBUG [Login-BE-${role}]: Senha CORRETA para ${role}. Login BEM-SUCEDIDO!`);
                        const tokenPayload = {
                            id: userInDb.id,
                            email: userInDb.email,
                            nome: userInDb.nome,
                            role: role, // role é CRÍTICA no payload
                            foto_path: userInDb.foto_path || null // Pegue foto_path direto do userInDb se existir
                        };

                        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });
                        console.log('DEBUG [Login-BE]: Token JWT gerado. Retornando 200 OK.');
                        return res.status(200).json({ 
                            message: 'Login bem-sucedido!', 
                            token, 
                            user: tokenPayload // Retorna o payload completo que foi usado no token
                        });
                    }
                }); 
            } else {
                console.log(`DEBUG [Login-BE-${role}]: Email "${email}" NÃO encontrado na tabela ${table}. Passando para a próxima role.`);
                authenticateInTable(index + 1);
            }
        });
    };

    authenticateInTable(0); // Inicia o processo de autenticação
};