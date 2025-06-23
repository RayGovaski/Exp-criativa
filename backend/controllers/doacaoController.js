import db from '../config/database.js';
import fs from 'fs';

export const get4Doacoes = (req, res) => {
    const q = `
        SELECT 
            id, nome AS titulo, descricao, valor_meta AS valorMeta, arrecadado,
            ROUND((arrecadado / valor_meta) * 100) AS porcentagem,
            status, data_inicio AS dataInicio, data_fim AS dataFim, prioridade,
            (imagem IS NOT NULL) AS tem_imagem
        FROM Doacao
        WHERE status = 'Aberta' AND prioridade = 'Max' 
        ORDER BY data_inicio DESC, id DESC 
        LIMIT 4;
    `;
    db.query(q, (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erro no banco de dados.", message: err.message });
        }
        return res.status(200).json(data);
    });
};

export const getDoacaoImage = (req, res) => {
    const { id } = req.params;
    const q = 'SELECT imagem FROM Doacao WHERE id = ?';

    db.query(q, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar a imagem." });
        }
        if (result.length === 0 || !result[0].imagem) {
            return res.status(404).send('Not Found');
        }

        const imageBuffer = result[0].imagem;
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(imageBuffer);
    });
};

export const getAllDoacoesFull = (req, res) => {
    const q = `
        SELECT 
            id, nome AS titulo, descricao, valor_meta AS valorMeta, arrecadado,
            ROUND((arrecadado / valor_meta) * 100) AS porcentagem,
            status, data_inicio AS dataInicio, data_fim AS dataFim, prioridade,
            (imagem IS NOT NULL) AS tem_imagem
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
            return res.status(500).json({ error: "Erro no banco de dados.", message: err.message });
        }
        return res.status(200).json(data);
    });
};

export const getDoacaoById = (req, res) => {
    const { id } = req.params;
    const q = `
        SELECT
            id,
            nome AS titulo,
            descricao,
            imagem,
            valor_meta AS valorMeta,
            arrecadado,
            ROUND((arrecadado / valor_meta) * 100) AS porcentagem,
            status,
            data_inicio AS dataInicio,
            data_fim AS dataFim,
            categoria,
            prioridade
        FROM Doacao
        WHERE id = ?;
    `;
    db.query(q, [id], (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erro no banco de dados.", message: err.message });
        }
        if (data.length === 0) {
            return res.status(404).json({ error: "Doação não encontrada." });
        }
        res.status(200).json(data[0]);
    });
};

export const createDoacao = (req, res) => {
    const { nome, valor_meta, arrecadado, descricao, data_inicio, data_fim, prioridade, status } = req.body;
    let imagemPath = null;

    if (req.file) {
        imagemPath = req.file.path.replace(/\\/g, '/');
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
            if (req.file && fs.existsSync(req.file.path)) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (unlinkErr) {}
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

export const processDonation = (req, res) => {
    const { doacaoId, valorDoado, customerName, customerEmail, customerPhone, formaPagamento } = req.body; 
    const userIdFromToken = req.user ? req.user.id : null; 
    const userRoleFromToken = req.user ? req.user.role : null; 

    if (!doacaoId || !valorDoado || parseFloat(valorDoado) <= 0 || !formaPagamento) {
        return res.status(400).json({ error: "Dados inválidos: ID da doação, valor doado e forma de pagamento são obrigatórios e positivos." });
    }

    const valorNumerico = parseFloat(valorDoado);
    let finalApoiadorIdToRegister = null; 
    if (userIdFromToken && userRoleFromToken === 'apoiador') {
        finalApoiadorIdToRegister = userIdFromToken; 
    }

    const getDoacaoQuery = 'SELECT id, nome, valor_meta, arrecadado, status FROM Doacao WHERE id = ?';
    db.query(getDoacaoQuery, [doacaoId], (err, doacaoData) => {
        if (err || doacaoData.length === 0) {
            return res.status(404).json({ error: "Doação não encontrada ou erro no banco de dados." });
        }

        const currentDoacao = doacaoData[0];
        const novoArrecadado = currentDoacao.arrecadado + valorNumerico;
        let novoStatus = currentDoacao.status;

        if (novoArrecadado >= currentDoacao.valor_meta) {
            novoStatus = 'Concluída';
        }

        const updateDoacaoQuery = `
            UPDATE Doacao
            SET arrecadado = ?, status = ?
            WHERE id = ?;
        `;
        db.query(updateDoacaoQuery, [novoArrecadado, novoStatus, doacaoId], (err) => {
            if (err) {
                return res.status(500).json({ error: "Erro ao atualizar doação.", details: err.message });
            }

            if (finalApoiadorIdToRegister) {
                const insertApoiadorDoacaoQuery = `
                    INSERT INTO Apoiador_Doacao (apoiador_id, doacao_id, valor_doado, data_doacao, forma_pagamento)
                    VALUES (?, ?, ?, NOW(), ?);
                `;
                db.query(insertApoiadorDoacaoQuery, [finalApoiadorIdToRegister, doacaoId, valorNumerico, formaPagamento], (err) => {
                    if (err) {
                        return res.status(500).json({ error: "Erro ao registrar a doação do apoiador." });
                    }
                    res.status(200).json({ 
                        message: `Doação de R$ ${valorNumerico.toFixed(2).replace('.', ',')} para "${currentDoacao.nome}" processada!`,
                        doacaoAtualizada: { id: currentDoacao.id, arrecadado: novoArrecadado, status: novoStatus }
                    });
                });
            } else {
                res.status(200).json({ 
                    message: `Doação de R$ ${valorNumerico.toFixed(2).replace('.', ',')} para "${currentDoacao.nome}" processada (visitante ou não-apoiador)!`,
                    doacaoAtualizada: { id: currentDoacao.id, arrecadado: novoArrecadado, status: novoStatus }
                });
            }
        });
    });
};

export const getDonationsAmountByMonth = (req, res) => {
    const apoiadorId = req.user.id;
    const { ano } = req.query;

    if (!ano) {
        return res.status(400).json({ error: "Ano é obrigatório." });
    }

    const q = `
        SELECT MONTH(data_doacao) AS mes, SUM(valor_doado) AS totalDoado
        FROM Apoiador_Doacao
        WHERE apoiador_id = ? AND YEAR(data_doacao) = ?
        GROUP BY mes ORDER BY mes ASC;
    `;

    db.query(q, [apoiadorId, ano], (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erro no banco de dados.", message: err.message });
        }
        res.status(200).json(data);
    });
};

export const createDoacaoCard = (req, res) => {
    if (req.user?.role !== 'administrador') {
        return res.status(403).json({ error: "Acesso negado." });
    }

    const { nome, valor_meta, descricao, data_inicio, data_fim, categoria, prioridade, status } = req.body;
    const imagemBuffer = req.file ? req.file.buffer : null;

    if (!nome || !valor_meta || !descricao || !categoria) {
        return res.status(400).json({ error: "Campos obrigatórios faltando: Título, Descrição, Meta e Categoria." });
    }

    if (parseFloat(valor_meta) <= 0) {
        return res.status(400).json({ error: "A Meta deve ser um valor positivo." });
    }

    const q = `
        INSERT INTO Doacao (
            nome, valor_meta, arrecadado, descricao, data_inicio, data_fim, 
            categoria, prioridade, status, imagem
        ) VALUES (?, ?, 0, ?, ?, ?, ?, ?, ?, ?);
    `;

    const params = [
        nome,
        parseFloat(valor_meta),
        descricao,
        data_inicio || null,
        data_fim || null,
        categoria,
        prioridade || 'Média',
        status || 'Aberta',
        imagemBuffer
    ];

    db.query(q, params, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro no banco de dados ao criar card de doação.", details: err.message });
        }
        res.status(201).json({ message: "Card de doação criado com sucesso!", doacaoId: result.insertId });
    });
};
