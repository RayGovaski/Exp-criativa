// backend/controllers/authController.js

import db from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/auth.js'; // Assegure-se de que JWT_SECRET é acessível
import { validateEmail } from '../utils/validators.js'; // Importa a validação de email

export const login = (req, res) => {
    const { email, senha } = req.body;

    console.log('DEBUG [Login-BE]: Requisição de login recebida para email:', email);

    if (!email || !senha) {
        console.log('DEBUG [Login-BE]: Email ou senha ausentes. Retornando 400.');
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    if (!validateEmail(email)) {
        console.log('DEBUG [Login-BE]: Formato de email inválido. Retornando 400.');
        return res.status(400).json({ error: 'Email inválido.' });
    }

    // Array de tipos de usuários e suas respectivas tabelas e campos de foto/email
    // Mantenha a ordem de prioridade se houver (ex: Apoiador > Aluno > Professor)
    const userTypes = [
        { role: 'apoiador', table: 'Apoiador', fotoPathField: 'foto_path' },
        { role: 'aluno', table: 'Aluno', fotoPathField: 'foto_path' },
        { role: 'professor', table: 'Professor', fotoPathField: 'foto_path' }, // ASSUMINDO que Professor tem 'foto_path'
        { role: 'administrador', table: 'Administrador', fotoPathField: null } // ADM não tem 'nome' nem 'foto_path' no seu DDL
    ];

    const authenticateInTable = (index) => {
        if (index >= userTypes.length) {
            console.log('DEBUG [Login-BE]: Tentou em todas as roles, usuário não encontrado ou senha incorreta em todas. Retornando 401.');
            return res.status(401).json({ error: 'Email ou senha inválidos.' });
        }

        const { role, table, fotoPathField } = userTypes[index];
        console.log(`DEBUG [Login-BE]: Tentando autenticar como: ${role} na tabela ${table}.`);
        
        // --- CONSTRUÇÃO DA QUERY AJUSTADA PARA CADA ROLE ---
        let selectFields;
        if (role === 'administrador') {
            // Para Administrador, selecione apenas id, email, senha (NÃO 'nome' ou 'foto_path')
            selectFields = `id, email, senha`; 
        } else {
            // Para outras roles, selecione id, nome, email, senha e foto_path se a coluna existir
            // Assumimos que 'nome' existe para apoiador, aluno, professor
            selectFields = `id, nome, email, senha${fotoPathField ? `, ${fotoPathField}` : ''}`;
        }
        const q = `SELECT ${selectFields} FROM ${table} WHERE email = ?`;
        
        db.query(q, [email], (err, data) => {
            if (err) {
                console.error(`ERRO [Login-BE-${role}]: Erro no DB ao buscar ${table}:`, err);
                console.error('SQL que causou o erro:', q, 'Parâmetros:', [email]);
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

                    console.log(`DEBUG [Login-BE-${role}]: Senha fornecida válida (bcrypt.compare): ${isPasswordValid}.`);

                    if (!isPasswordValid) {
                        console.log(`DEBUG [Login-BE-${role}]: Senha INCORRETA para ${role}. Passando para a próxima role.`);
                        authenticateInTable(index + 1); // Tenta na próxima tabela
                    } else {
                        console.log(`DEBUG [Login-BE-${role}]: Senha CORRETA para ${role}. Login BEM-SUCEDIDO!`);
                        
                        // --- AJUSTE NO PAYLOAD DO TOKEN PARA CADA ROLE ---
                        let tokenPayload;
                        if (role === 'administrador') {
                            tokenPayload = {
                                id: userInDb.id,
                                email: userInDb.email,
                                nome: 'Administrador', // Nome padrão para ADM
                                role: role,
                                foto_path: null // ADM não tem foto_path
                            };
                        } else {
                            tokenPayload = {
                                id: userInDb.id,
                                email: userInDb.email,
                                nome: userInDb.nome, // 'nome' deve vir da query
                                role: role,
                                foto_path: userInDb.foto_path || null // 'foto_path' deve vir da query
                            };
                        }

                        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });
                        console.log('DEBUG [Login-BE]: Token JWT gerado. Retornando 200 OK.');
                        return res.status(200).json({ 
                            message: 'Login bem-sucedido!', 
                            token, 
                            user: tokenPayload // Retorna o payload completo que foi usado no token
                        });
                    }
                }); // Fim do bcrypt.compare callback
            } else {
                console.log(`DEBUG [Login-BE-${role}]: Email "${email}" NÃO encontrado na tabela ${table}. Passando para a próxima role.`);
                authenticateInTable(index + 1); // Tenta na próxima tabela
            }
        }); // Fim do db.query callback
    };

    authenticateInTable(0); // Inicia o processo de autenticação com a primeira role (apoiador)
};