// backend/controllers/doacaoController.js

import db from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Função getAllDoacoes (EXISTENTE, que filtra por Max e limita a 4) ---
export const getAllDoacoes = (req, res) => {
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