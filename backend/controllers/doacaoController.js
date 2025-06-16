// backend/controllers/doacaoController.js

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
            console.error("Erro ao buscar doações (get4Doacoes):", err);
            return res.status(500).json({ error: "Erro no banco de dados.", message: err.message });
        }
        return res.status(200).json(data);
    });
};
// --- Função createDoacao REMOVIDA, pois estava incorreta. Use createDoacaoCard abaixo. ---

// --- Função getDoacaoImage CORRIGIDA para servir LONGBLOB ---
export const getDoacaoImage = (req, res) => {
    const { id } = req.params;
    const q = 'SELECT imagem FROM Doacao WHERE id = ?';

    db.query(q, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar a imagem." });
        }
        if (result.length === 0 || !result[0].imagem) {
            // Retorna um erro 404 se não houver imagem, o frontend usará o placeholder.
            return res.status(404).send('Not Found');
        }

        const imageBuffer = result[0].imagem;

        // Define o tipo de conteúdo para o navegador entender que é uma imagem
        res.setHeader('Content-Type', 'image/jpeg'); // ou 'image/png'
        res.send(imageBuffer);
    });
};

// --- Função getAllDoacoesFull com o nome da coluna corrigido ---
export const getAllDoacoesFull = (req, res) => {
    // ✅ CONSULTA CORRIGIDA ✅
    // Trocamos 'imagem' por '(imagem IS NOT NULL) AS tem_imagem'
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
            console.error("Erro ao buscar todas as doações:", err);
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
            categoria, -- <--- ADDED: Ensure 'categoria' is selected
            prioridade
        FROM Doacao
        WHERE id = ?;
    `;

    db.query(q, [id], (err, data) => {
        if (err) {
            console.error("Erro ao buscar doação por ID:", err);
            return res.status(500).json({ error: "Erro no banco de dados.", message: err.message });
        }
        if (data.length === 0) {
            return res.status(404).json({ error: "Doação não encontrada." });
        }
        res.status(200).json(data[0]);
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

export const processDonation = (req, res) => {
    // Adicionado formaPagamento ao destructuring de req.body
    const { doacaoId, valorDoado, customerName, customerEmail, customerPhone, formaPagamento } = req.body; 
    const userIdFromToken = req.user ? req.user.id : null; 
    const userRoleFromToken = req.user ? req.user.role : null; 

    console.log(`DEBUG [processDonation-BE]: Requisição. UserID (token): ${userIdFromToken}, Role (token): ${userRoleFromToken}`);
    console.log(`DEBUG [processDonation-BE]: DoacaoID: ${doacaoId}, ValorDoado: ${valorDoado}, FormaPagamento: ${formaPagamento}`);

    if (!doacaoId || !valorDoado || parseFloat(valorDoado) <= 0 || !formaPagamento) { // formaPagamento agora é obrigatório
        console.error("ERRO [processDonation]: Dados inválidos ou faltando (formaPagamento).");
        return res.status(400).json({ error: "Dados inválidos: ID da doação, valor doado e forma de pagamento são obrigatórios e positivos." });
    }

    const valorNumerico = parseFloat(valorDoado);

    let finalApoiadorIdToRegister = null; 
    if (userIdFromToken && userRoleFromToken === 'apoiador') {
        finalApoiadorIdToRegister = userIdFromToken; 
    } else if (userIdFromToken && userRoleFromToken !== 'apoiador') {
        console.warn(`AVISO [processDonation]: Usuário logado (ID: ${userIdFromToken}, Role: ${userRoleFromToken}) tentou doar. Doação não será registrada em Apoiador_Doacao.`);
    } else {
        console.log('DEBUG [processDonation]: Usuário não logado (visitante). Doação não será vinculada a apoiador_id.');
    }

    // 1. Buscar dados atuais da doação
    const getDoacaoQuery = 'SELECT id, nome, valor_meta, arrecadado, status FROM Doacao WHERE id = ?';
    db.query(getDoacaoQuery, [doacaoId], (err, doacaoData) => {
        // ... (erro e 404 handling) ...

        const currentDoacao = doacaoData[0];
        const novoArrecadado = currentDoacao.arrecadado + valorNumerico;
        let novoStatus = currentDoacao.status; // Começa com o status atual

        // AQUI ESTÁ A LÓGICA CHAVE:
        if (novoArrecadado >= currentDoacao.valor_meta) {
            novoStatus = 'Concluída'; // <--- ESTE É ONDE O STATUS É ATUALIZADO
        }

        // 2. Atualizar a doação na tabela 'Doacao' (arrecadado e status)
        const updateDoacaoQuery = `
            UPDATE Doacao
            SET arrecadado = ?, status = ? -- <--- STATUS É ATUALIZADO NO DB AQUI
            WHERE id = ?;
        `;
        db.query(updateDoacaoQuery, [novoArrecadado, novoStatus, doacaoId], (err, result) => {
            if (err) { /* ... */ }

            // 3. Registrar a doação em Apoiador_Doacao APENAS se houver um finalApoiadorIdToRegister válido
            if (finalApoiadorIdToRegister) { 
                // --- AJUSTE AQUI: ADICIONAR forma_pagamento NO INSERT ---
                const insertApoiadorDoacaoQuery = `
                    INSERT INTO Apoiador_Doacao (apoiador_id, doacao_id, valor_doado, data_doacao, forma_pagamento)
                    VALUES (?, ?, ?, NOW(), ?);
                `;
                db.query(insertApoiadorDoacaoQuery, [finalApoiadorIdToRegister, doacaoId, valorNumerico, formaPagamento], (err, resultApoiadorDoacao) => {
                    if (err) { /* ... */ }
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
    // 1. Verificar a role do usuário
    if (req.user?.role !== 'administrador') {
        return res.status(403).json({ error: "Acesso negado." });
    }

    // 2. Obter dados do corpo da requisição
    const { 
        nome, valor_meta, descricao, data_inicio, data_fim, 
        categoria, prioridade, status 
    } = req.body;

    // 3. Obter o buffer da imagem diretamente da memória
    // Não há mais necessidade de ler ou apagar arquivos do disco.
    const imagemBuffer = req.file ? req.file.buffer : null;

    // 4. Validações
    if (!nome || !valor_meta || !descricao || !categoria) {
        return res.status(400).json({ error: "Campos obrigatórios faltando: Título, Descrição, Meta e Categoria." });
    }
    if (parseFloat(valor_meta) <= 0) {
        return res.status(400).json({ error: "A Meta deve ser um valor positivo." });
    }

    // 5. Query SQL para inserir no banco
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
        imagemBuffer // Passa o buffer da imagem diretamente para a query
    ];

    db.query(q, params, (err, result) => {
        if (err) {
            console.error("ERRO [createDoacaoCard-BE]: Erro ao inserir doação no banco:", err);
            return res.status(500).json({ error: "Erro no banco de dados ao criar card de doação.", details: err.message });
        }
        res.status(201).json({ message: "Card de doação criado com sucesso!", doacaoId: result.insertId });
    });
};
