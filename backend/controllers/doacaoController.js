// backend/controllers/doacaoController.js

import db from '../config/database.js';
import fs from 'fs'; // Usado para ler/apagar arquivos (curriculo, imagem)
import path from 'path'; // Usado para resolver caminhos de arquivo
import { fileURLToPath } from 'url'; // Usado para __dirname em ES Modules

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Função: get4Doacoes (filtra por Max e limita a 4 para Home) ---
export const get4Doacoes = (req, res) => {
    const q = `
        SELECT 
            id, nome AS titulo, descricao, imagem, valor_meta AS valorMeta, arrecadado,
            ROUND((arrecadado / valor_meta) * 100) AS porcentagem,
            status, data_inicio AS dataInicio, data_fim AS dataFim, prioridade 
        FROM Doacao
        WHERE status = 'Aberta' AND prioridade = 'Max' 
        ORDER BY data_inicio DESC, id DESC 
        LIMIT 4;
    `;
    db.query(q, [/* Sem parâmetros adicionais para esta query */], (err, data) => {
        if (err) {
            console.error("ERRO [get4Doacoes-BE]: Erro ao buscar doações (limitado):", err);
            return res.status(500).json({ error: "Erro no banco de dados ao buscar doações.", message: err.message });
        }
        console.log('DEBUG [get4Doacoes-BE]: Dados de doações retornados do DB (limitado):', data);
        return res.status(200).json(data);
    });
};

// --- Função: createDoacao (OBS: Este nome era usado para registro de apoiador/aluno, mas agora será createDoacaoCard para admin) ---
// Se você tinha uma createDoacao AQUI para o registro de apoiador/aluno, ela deve ter sido movida para apoiadorController ou alunoController.
// Vou deixar esta função comentada/vazia, pois a funcionalidade de criar Doação (card) está em createDoacaoCard.
// export const createDoacao = (req, res) => {
//     res.status(500).json({ error: "Esta função createDoacao foi movida/substituída. Use createDoacaoCard para criar novos cards de doação." });
// };


// --- Função: getDoacaoImage (Serve a imagem de doação por ID) ---
export const getDoacaoImage = (req, res) => {
    const { id } = req.params;
    const q = 'SELECT imagem FROM Doacao WHERE id = ?'; // Sua DDL diz 'imagem LONGBLOB'
    db.query(q, [id], (err, result) => {
        if (err) {
            console.error("ERRO [getDoacaoImage-BE]: Erro ao buscar caminho da imagem da doação:", err);
            return res.status(500).json({ error: "Erro ao buscar a imagem da doação." });
        }

        if (result.length === 0 || !result[0].imagem) { // Sua DDL diz 'imagem', não 'imagem_path'
            return res.status(404).json({ error: "Imagem de doação não encontrada ou nula." });
        }

        const doacao = result[0];
        const imageData = doacao.imagem; // Conteúdo BLOB da imagem

        // Para servir BLOBs, você precisa definir o Content-Type apropriado
        // E enviar o buffer. Assumimos JPEG/PNG aqui, você pode precisar de um detector de tipo.
        res.writeHead(200, {
            'Content-Type': 'image/jpeg', // Ou image/png, dependendo do tipo da imagem
            'Content-Length': imageData.length
        });
        return res.end(imageData);
    });
};

// --- Função: getAllDoacoesFull (Para a página de todas as doações) ---
export const getAllDoacoesFull = (req, res) => {
    const q = `
        SELECT 
            id, nome AS titulo, descricao, imagem, valor_meta AS valorMeta, arrecadado,
            ROUND((arrecadado / valor_meta) * 100) AS porcentagem,
            status, data_inicio AS dataInicio, data_fim AS dataFim, categoria, prioridade 
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
            console.error("ERRO [getAllDoacoesFull-BE]: Erro ao buscar todas as doações:", err);
            return res.status(500).json({ error: "Erro no banco de dados ao buscar todas as doações.", message: err.message });
        }
        console.log('DEBUG [getAllDoacoesFull-BE]: Dados de TODAS as doações retornados do DB:', data);
        return res.status(200).json(data);
    });
};

// --- Função: getDoacaoById (Para obter detalhes de uma doação específica) ---
export const getDoacaoById = (req, res) => {
    const { id } = req.params;

    const q = `
        SELECT 
            id, nome AS titulo, descricao, imagem, valor_meta AS valorMeta, arrecadado,
            ROUND((arrecadado / valor_meta) * 100) AS porcentagem,
            status, data_inicio AS dataInicio, data_fim AS dataFim, categoria, prioridade 
        FROM Doacao
        WHERE id = ?;
    `;
    db.query(q, [id], (err, data) => {
        if (err) {
            console.error("ERRO [getDoacaoById-BE]: Erro ao buscar doação por ID:", err);
            return res.status(500).json({ error: "Erro no banco de dados ao buscar doação por ID.", message: err.message });
        }
        if (data.length === 0) {
            return res.status(404).json({ error: "Doação não encontrada." });
        }