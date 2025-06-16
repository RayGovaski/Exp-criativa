import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import fs from "fs";
import path from "path";
import db from '../config/database.js';
import { JWT_SECRET } from '../middleware/auth.js';
import { validateCPF, validateEmail, cleanPhone, formatDateToMySQL } from '../utils/validators.js';

export const getAllApoiadores = (req, res) => {
    // Ajustado para JOIN com Apoiador_Plano e Plano para obter o nome do plano
    const q = `
        SELECT a.id, a.cpf, a.nome, a.data_nascimento, a.telefone, a.email, 
               p.nome AS plano_nome, ap.dataAdesao AS data_adesao, a.notificacoes 
        FROM Apoiador a
        LEFT JOIN Apoiador_Plano ap ON a.id = ap.apoiadorId
        LEFT JOIN Plano p ON ap.planoId = p.id
    `;

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
        const { nome, cpf, email, senha, data_nascimento, telefone, receberNotificacoes } = req.body;
        
        if (!nome || !cpf || !email || !senha || !data_nascimento) {
            return res.status(400).json({ error: "Campos obrigatórios faltando: Nome, CPF, Email, Senha e Data de Nascimento." });
        }

        const fotoBuffer = req.file ? req.file.buffer : null;

        // Validações de formato
        if (!validateCPF(cpf)) return res.status(400).json({ error: "CPF inválido" });
        if (!validateEmail(email)) return res.status(400).json({ error: "Email inválido" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        const cleanCpf = cpf.replace(/\D/g, '');
        const cleanTelefone = telefone ? cleanPhone(telefone) : null;
        const formattedDate = formatDateToMySQL(data_nascimento);
        const notificacoesValue = receberNotificacoes ? 1 : 0;

        const q = `INSERT INTO Apoiador (cpf, nome, data_nascimento, telefone, email, senha, foto, notificacoes, data_adesao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

        db.query(q, [cleanCpf, nome, formattedDate, cleanTelefone, email, hashedPassword, fotoBuffer, notificacoesValue], (err, data) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: "CPF ou Email já cadastrado." });
                }
                console.error("ERRO DE QUERY MYSQL em createApoiador:", err);
                return res.status(500).json({ error: "Erro no banco de dados ao criar apoiador.", message: err.sqlMessage });
            }
            res.status(201).json({ id: data.insertId, message: "Apoiador cadastrado com sucesso!" });
        });
    } catch (error) {
        console.error("ERRO GERAL em createApoiador:", error);
        res.status(500).json({ error: "Erro interno do servidor.", message: error.message });
    }
};

export const getProfile = (req, res) => {
    const userId = req.user.id;
    const q = `
        SELECT a.id, a.cpf, a.nome, a.data_nascimento, a.telefone, a.email,
               p.nome AS plano_nome, p.preco AS plano_preco, ap.dataAdesao AS data_adesao, a.notificacoes,
               (a.foto IS NOT NULL) AS tem_foto 
        FROM Apoiador a
        LEFT JOIN Apoiador_Plano ap ON a.id = ap.apoiadorId
        LEFT JOIN Plano p ON ap.planoId = p.id
        WHERE a.id = ?
    `;
    db.query(q, [userId], (err, data) => {
        if (err || data.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });
        const profile = { ...data[0], foto: data[0].tem_foto };
        res.status(200).json(profile);
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
export const subscribeToPlan = (req, res) => {
    const { planoId } = req.body; 
    const userIdFromToken = req.user ? req.user.id : null; 
    const userRoleFromToken = req.user ? req.user.role : null; 

    if (!userIdFromToken || userRoleFromToken !== 'apoiador') {
        console.warn(`AVISO [subscribeToPlan]: Acesso negado. Usuário logado (ID: ${userIdFromToken}, Role: ${userRoleFromToken}) tentou assinar plano.`);
        return res.status(403).json({ error: "Acesso negado. Somente apoiadores podem assinar planos." });
    }
    
    const apoiadorId = userIdFromToken; 

    if (!planoId) {
        return res.status(400).json({ error: "ID do plano é obrigatório." });
    }

    const checkPlanQuery = 'SELECT id, nome, preco FROM Plano WHERE id = ?';
    db.query(checkPlanQuery, [planoId], (err, planos) => {
        if (err) {
            console.error('Erro ao verificar plano (checkPlanQuery):', err);
            return res.status(500).json({ error: 'Erro interno do servidor ao verificar o plano.', details: err.message });
        }
        if (planos.length === 0) {
            return res.status(404).json({ error: 'Plano não encontrado.' });
        }
        const selectedPlanData = planos[0];

        const checkSubscriptionQuery = 'SELECT * FROM Apoiador_Plano WHERE apoiadorId = ?';
        db.query(checkSubscriptionQuery, [apoiadorId], (err, existingSubscription) => {
            if (err) {
                console.error('Erro ao verificar assinatura existente (checkSubscriptionQuery):', err);
                return res.status(500).json({ error: 'Erro interno do servidor ao verificar assinatura.', details: err.message });
            }

            const requestedPlanoIdNum = parseInt(planoId, 10); 

            if (existingSubscription.length > 0) {
                const currentPlanId = existingSubscription[0].planoId;

                if (currentPlanId === requestedPlanoIdNum) {
                    return res.status(200).json({ message: `Você já está atualmente no plano ${selectedPlanData.nome}.` });
                } else {
                    const updateSubscriptionQuery = `
                        UPDATE Apoiador_Plano
                        SET planoId = ?, dataAdesao = NOW()
                        WHERE apoiadorId = ?
                    `;
                    db.query(updateSubscriptionQuery, [requestedPlanoIdNum, apoiadorId], (err, result) => {
                        if (err) {
                            console.error('Erro ao mudar de plano (updateSubscriptionQuery):', err);
                            return res.status(500).json({ error: 'Erro interno do servidor ao mudar de plano.', details: err.message });
                        }
                        if (result.affectedRows === 0) {
                             return res.status(400).json({ error: 'Nenhuma alteração feita. Verifique se o plano atual é diferente do selecionado ou se o apoiador existe.' });
                        }
                        res.status(200).json({ message: `Sua assinatura foi alterada com sucesso para o plano ${selectedPlanData.nome}!` });
                    });
                }
            } else {
                const insertSubscriptionQuery = `
                    INSERT INTO Apoiador_Plano (apoiadorId, planoId, dataAdesao) 
                    VALUES (?, ?, NOW())
                `;
                db.query(insertSubscriptionQuery, [apoiadorId, requestedPlanoIdNum], (err, result) => {
                    if (err) {
                        console.error('Erro ao assinar plano (insertSubscriptionQuery):', err);
                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.status(409).json({ error: 'Você já possui uma assinatura. Por favor, gerencie-a na sua área de perfil.' });
                        }
                        return res.status(500).json({ error: 'Erro interno do servidor ao processar a assinatura.', details: err.message });
                    }
                    res.status(201).json({ message: `Assinatura do plano ${selectedPlanData.nome} realizada com sucesso!` });
                });
            }
        });
    });
};

export const cancelSubscription = (req, res) => {
    const apoiadorId = req.user.id; // ID do apoiador vem do token de autenticação

    const q = 'DELETE FROM Apoiador_Plano WHERE apoiadorId = ?';

    db.query(q, [apoiadorId], (err, result) => {
        if (err) {
            console.error('Erro ao cancelar assinatura:', err);
            return res.status(500).json({ error: 'Erro interno do servidor ao cancelar a assinatura.', details: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Nenhuma assinatura ativa encontrada para este apoiador.' });
        }

        res.status(200).json({ message: 'Assinatura cancelada com sucesso!' });
    });
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

        if (apoiador.foto_path) {
            const fullPath = path.resolve(apoiador.foto_path);
            console.log('Trying to serve photo from:', fullPath);

            if (fs.existsSync(fullPath)) {
                return res.sendFile(fullPath);
            } else {
                console.warn('Photo file not found at path:', fullPath);
            }
        }

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

export const getDoacaoById = (req, res) => {
    const { id } = req.params; // ID da doação vindo da URL

    const q = `
        SELECT 
            id, nome AS titulo, descricao, imagem_path, valor_meta AS valorMeta, arrecadado,
            ROUND((arrecadado / valor_meta) * 100) AS porcentagem,
            status, data_inicio AS dataInicio, data_fim AS dataFim, prioridade 
        FROM Doacao
        WHERE id = ?;
    `;

    db.query(q, [id], (err, data) => {
        if (err) {
            console.error("Erro ao buscar doação por ID (getDoacaoById):", err);
            return res.status(500).json({ error: "Erro no banco de dados ao buscar doação por ID.", message: err.message });
        }

        if (data.length === 0) {
            return res.status(404).json({ error: "Doação não encontrada." });
        }

        return res.status(200).json(data[0]);
    });
};
export const getApoiadorDonationsHistory = (req, res) => {
    const apoiadorId = req.user.id; // ID do apoiador logado

    // Query para selecionar histórico de doações, incluindo 'forma_pagamento'
    const q = `
        SELECT 
            ad.id, 
            d.id AS doacao_id, 
            d.nome AS causa, 
            ad.valor_doado AS valor, 
            ad.data_doacao AS data, 
            d.status, -- Manter o status para o modal, mesmo que não na tabela principal
            d.descricao AS descricao_causa, 
            ad.forma_pagamento AS formaPagamento,
            TRUE AS comprovante_disponivel 
        FROM Apoiador_Doacao ad
        JOIN Doacao d ON ad.doacao_id = d.id
        WHERE ad.apoiador_id = ?
        ORDER BY ad.data_doacao DESC;
    `;

    db.query(q, [apoiadorId], (err, data) => {
        if (err) {
            console.error("ERRO [getApoiadorDonationsHistory-BE]: Erro ao buscar histórico de doações do apoiador:", err);
            return res.status(500).json({ error: "Erro no banco de dados ao buscar histórico de doações.", message: err.message });
        }

        const formattedData = data.map(record => ({
            id: record.id, 
            doacao_id: record.doacao_id, 
            causa: record.causa,
            instituicao: 'Experiência Criativa', 
            valor: parseFloat(record.valor), 
            data: new Date(record.data).toLocaleDateString('pt-BR'), 
            status: record.status, 
            comprovante: record.comprovante_disponivel, 
            descricaoDetalhada: record.descricao_causa,
            formaPagamento: record.formaPagamento 
        }));
        
        console.log('DEBUG [getApoiadorDonationsHistory-BE]: Histórico de doações retornado:', formattedData);
        return res.status(200).json(formattedData);
    });
};

export const getApoiadorReports = (req, res) => {
    const apoiadorId = req.user.id;
    const { ano } = req.query;

    if (!ano) {
        return res.status(400).json({ error: "O ano é um parâmetro obrigatório." });
    }

    const relatorios = {
        doacoesPorMes: [],
        doacoesPorCategoria: []
    };

    // Consulta 1: Doações por Mês
    const doacoesPorMesQuery = `
        SELECT MONTH(data_doacao) AS mes, SUM(valor_doado) AS total
        FROM Apoiador_Doacao
        WHERE apoiador_id = ? AND YEAR(data_doacao) = ?
        GROUP BY MONTH(data_doacao) ORDER BY mes ASC;
    `;

    db.query(doacoesPorMesQuery, [apoiadorId, ano], (err, resultsMes) => {
        if (err) {
            console.error("Erro ao buscar doações por mês:", err);
            return res.status(500).json({ error: "Erro no servidor ao buscar relatórios (mês)." });
        }
        relatorios.doacoesPorMes = resultsMes;

        // Consulta 2: Doações por Categoria (dentro do callback da primeira)
        const doacoesPorCategoriaQuery = `
            SELECT d.categoria, SUM(ad.valor_doado) AS total
            FROM Apoiador_Doacao ad
            JOIN Doacao d ON ad.doacao_id = d.id
            WHERE ad.apoiador_id = ? AND YEAR(ad.data_doacao) = ?
            GROUP BY d.categoria;
        `;

        db.query(doacoesPorCategoriaQuery, [apoiadorId, ano], (err, resultsCategoria) => {
            if (err) {
                console.error("Erro ao buscar doações por categoria:", err);
                return res.status(500).json({ error: "Erro no servidor ao buscar relatórios (categoria)." });
            }
            relatorios.doacoesPorCategoria = resultsCategoria;

            // Após as duas consultas terminarem com sucesso, envia a resposta
            res.status(200).json(relatorios);
        });
    });
};
export const getApoiadorFoto = (req, res) => {
    const id = req.params.id;
    db.query('SELECT foto FROM Apoiador WHERE id = ?', [id], (err, result) => {
        if (err || result.length === 0 || !result[0].foto) {
            return res.status(404).json({ error: "Imagem não encontrada" });
        }
        res.setHeader('Content-Type', 'image/jpeg'); // Ou o tipo de imagem que você salva
        res.send(result[0].foto);
    });
};

// --- UPDATE PHOTO ---
// Corrigido para atualizar o LONGBLOB
export const updateApoiadorFoto = (req, res) => {
    const userId = req.user.id;
    if (!req.file) return res.status(400).json({ error: "Nenhuma foto enviada" });

    const fotoBuffer = req.file.buffer;
    const q = "UPDATE Apoiador SET foto = ? WHERE id = ?";

    db.query(q, [fotoBuffer, userId], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro no banco de dados" });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Usuário não encontrado" });
        res.status(200).json({ message: "Foto atualizada com sucesso" });
    });
};