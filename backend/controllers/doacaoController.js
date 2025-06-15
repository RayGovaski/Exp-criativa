// backend/controllers/doacaoController.js

import db from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Função filtra por Max e limita a 4
export const get4Doacoes = (req, res) => {
    const q = `
        SELECT 
            id, nome AS titulo, descricao, imagem_path, valor_meta AS valorMeta, arrecadado,
            ROUND((arrecadado / valor_meta) * 100) AS porcentagem,
            status, data_inicio AS dataInicio, data_fim AS dataFim, prioridade 
        FROM Doacao
        WHERE status = 'Aberta' AND prioridade = 'Max' 
        ORDER BY data_inicio DESC, id DESC 
        LIMIT 4;
    `;

    db.query(q, (err, data) => {
        if (err) {
            console.error("Erro ao buscar doações (getAllDoacoes):", err);
            return res.status(500).json({ error: "Erro no banco de dados ao buscar doações.", message: err.message });
        }
        console.log('DEBUG: Dados de doações retornados do DB (limitado):', data);
        return res.status(200).json(data);
    });
};

// --- Sua função createDoacao existente ---
export const createDoacao = (req, res) => {
    const { nome, valor_meta, arrecadado, descricao, data_inicio, data_fim, prioridade, status } = req.body;
    let imagemPath = null;

    if (req.file) {
        imagemPath = req.file.path.replace(/\\/g, '/');
    } else {
        console.warn('Nenhuma imagem enviada para a doação, continuando sem imagem.');
    }

    if (!nome || !valor_meta || !descricao) {
        return res.status(400).json({ error: "Campos obrigatórios faltando: nome, valor_meta, descricao." });
    }

    const q = `
        INSERT INTO Doacao 
            (nome, valor_meta, arrecadado, descricao, data_inicio, data_fim, prioridade, status, imagem_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const params = [
        nome, 
        parseFloat(valor_meta),
        parseFloat(arrecadado) || 0,
        descricao, 
        data_inicio, 
        data_fim, 
        prioridade || 'Média',
        status || 'Aberta',
        imagemPath 
    ];

    db.query(q, params, (err, result) => {
        if (err) {
            console.error("Erro ao criar doação no banco de dados:", err);
            if (req.file && fs.existsSync(req.file.path)) {
                try {
                    fs.unlinkSync(req.file.path);
                    console.log('Arquivo de imagem da doação removido após erro no DB:', req.file.path);
                } catch (unlinkErr) {
                    console.error('Erro ao remover arquivo de imagem após erro no DB:', unlinkErr);
                }
            }
            return res.status(500).json({ error: "Erro no banco de dados ao criar doação.", details: err.message });
        }
        res.status(201).json({ 
            message: "Doação criada com sucesso!", 
            doacaoId: result.insertId,
            imagemPath: imagemPath
        });
    });
};

// --- Sua função getDoacaoImage existente ---
export const getDoacaoImage = (req, res) => {
    const { id } = req.params;
    const q = 'SELECT imagem_path FROM Doacao WHERE id = ?';
    db.query(q, [id], (err, result) => {
        if (err) {
            console.error("Erro ao buscar caminho da imagem da doação:", err);
            return res.status(500).json({ error: "Erro ao buscar a imagem da doação." });
        }

        if (result.length === 0 || !result[0].imagem_path) {
            return res.status(404).json({ error: "Imagem de doação não encontrada." });
        }

        const doacao = result[0];
        const fullPath = path.resolve(__dirname, '..', doacao.imagem_path); 

        console.log('Tentando servir imagem da doação de:', fullPath);

        if (fs.existsSync(fullPath)) {
            return res.sendFile(fullPath);
        } else {
            console.warn('Arquivo de imagem da doação não encontrado no caminho:', fullPath);
            return res.status(404).json({ error: "Arquivo de imagem da doação não encontrado no servidor." });
        }
    });
};

// --- NOVA FUNÇÃO: getAllDoacoesFull (para a página de todas as doações) ---
export const getAllDoacoesFull = (req, res) => {
    const q = `
        SELECT 
            id, nome AS titulo, descricao, imagem_path, valor_meta AS valorMeta, arrecadado,
            ROUND((arrecadado / valor_meta) * 100) AS porcentagem,
            status, data_inicio AS dataInicio, data_fim AS dataFim, prioridade 
        FROM Doacao
        ORDER BY 
            CASE prioridade
                WHEN 'Max' THEN 1
                WHEN 'Média' THEN 2
                WHEN 'Min' THEN 3
                ELSE 4
            END,
            data_inicio DESC, 
            id DESC;
    `;

    db.query(q, (err, data) => {
        if (err) {
            console.error("Erro ao buscar todas as doações (getAllDoacoesFull):", err);
            return res.status(500).json({ error: "Erro no banco de dados ao buscar todas as doações.", message: err.message });
        }
        console.log('DEBUG: Dados de TODAS as doações retornados do DB:', data);
        return res.status(200).json(data);
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
export const processDonation = (req, res) => {
    const { doacaoId, valorDoado, customerName, customerEmail, customerPhone } = req.body;
    const userIdFromToken = req.user ? req.user.id : null; // ID do usuário logado
    const userRoleFromToken = req.user ? req.user.role : null; // ROLE do usuário logado

    if (!doacaoId || !valorDoado || parseFloat(valorDoado) <= 0) {
        console.error("ERRO [processDonation]: Dados inválidos fornecidos.");
        return res.status(400).json({ error: "Dados inválidos: ID da doação e valor doado são obrigatórios e positivos." });
    }

    const valorNumerico = parseFloat(valorDoado);

    // VALIDAÇÃO CRÍTICA: Se o usuário está logado, ele DEVE ser um Apoiador para registrar a doação em seu nome.
    // Doações podem ser feitas por VISITANTES (sem token), ou por APOIADORES (com token).
    // Outras roles (aluno, professor, adm) não devem poder registrar doações em seu nome na tabela Apoiador_Doacao.
    let finalApoiadorIdToRegister = null; // ID a ser usado na Apoiador_Doacao

    if (userIdFromToken) { // Se há um usuário logado
        if (userRoleFromToken === 'apoiador') {
            finalApoiadorIdToRegister = userIdFromToken; // OK, é um apoiador
        } else {
            // Se logado, mas NÃO É apoiador, a doação não será vinculada a um apoiador_id
            console.warn(`AVISO [processDonation]: Usuário logado (ID: ${userIdFromToken}, Role: ${userRoleFromToken}) tentou doar. Doação não será registrada em Apoiador_Doacao.`);
            // A doação principal (tabela Doacao) ainda pode ser atualizada, mas não em Apoiador_Doacao.
        }
    }
    // Se não está logado (userIdFromToken é null), finalApoiadorIdToRegister permanece null (doação de visitante)


    // 1. Buscar dados atuais da doação
    const getDoacaoQuery = 'SELECT id, nome, valor_meta, arrecadado, status FROM Doacao WHERE id = ?';
    db.query(getDoacaoQuery, [doacaoId], (err, doacaoData) => {
        if (err) {
            console.error("ERRO [processDonation]: Erro ao buscar doação para processar:", err);
            return res.status(500).json({ error: "Erro no banco de dados ao buscar doação.", details: err.message });
        }

        if (doacaoData.length === 0) {
            console.error("ERRO [processDonation]: Doação com ID " + doacaoId + " não encontrada.");
            return res.status(404).json({ error: "Doação não encontrada." });
        }

        const currentDoacao = doacaoData[0];
        const novoArrecadado = currentDoacao.arrecadado + valorNumerico;
        let novoStatus = currentDoacao.status;

        if (novoArrecadado >= currentDoacao.valor_meta) {
            novoStatus = 'Concluída';
        }

        // 2. Atualizar a doação na tabela 'Doacao' (arrecadado e status)
        const updateDoacaoQuery = `
            UPDATE Doacao
            SET arrecadado = ?, status = ?
            WHERE id = ?;
        `;
        db.query(updateDoacaoQuery, [novoArrecadado, novoStatus, doacaoId], (err, result) => {
            if (err) {
                console.error("ERRO [processDonation]: Erro ao atualizar arrecadado da doação:", err);
                return res.status(500).json({ error: "Erro no banco de dados ao atualizar doação.", details: err.message });
            }

            // 3. Registrar a doação em Apoiador_Doacao APENAS se houver um finalApoiadorIdToRegister válido
            if (finalApoiadorIdToRegister) { 
                const insertApoiadorDoacaoQuery = `
                    INSERT INTO Apoiador_Doacao (apoiador_id, doacao_id, valor_doado, data_doacao)
                    VALUES (?, ?, ?, NOW());
                `;
                db.query(insertApoiadorDoacaoQuery, [finalApoiadorIdToRegister, doacaoId, valorNumerico], (err, resultApoiadorDoacao) => {
                    if (err) {
                        console.error("ERRO [processDonation]: Erro ao registrar doação em Apoiador_Doacao:", err);
                        console.warn("AVISO [processDonation]: Doação principal processada, mas falha ao registrar para o apoiador logado.");
                        // Não retorna erro 500, pois a doação principal foi bem-sucedida.
                    }
                    res.status(200).json({ 
                        message: `Doação de R$ ${valorNumerico.toFixed(2).replace('.', ',')} para "${currentDoacao.nome}" processada!`,
                        doacaoAtualizada: { id: currentDoacao.id, arrecadado: novoArrecadado, status: novoStatus }
                    });
                });
            } else {
                // Doação de visitante ou usuário logado que não é apoiador
                res.status(200).json({ 
                    message: `Doação de R$ ${valorNumerico.toFixed(2).replace('.', ',')} para "${currentDoacao.nome}" processada (visitante ou não-apoiador)!`,
                    doacaoAtualizada: { id: currentDoacao.id, arrecadado: novoArrecadado, status: novoStatus }
                });
            }
        });
    });
};