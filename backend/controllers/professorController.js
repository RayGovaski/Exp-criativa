// backend/controllers/professorController.js

import db from '../config/database.js';

export const getProfessorTurmas = (req, res) => {
    const professorId = req.user.id;
    const q = `
        SELECT 
            t.*,
            (SELECT COUNT(*) FROM Aluno_Turma WHERE turma_id = t.id) AS alunos_count
        FROM Turma t
        JOIN Professor_Turma pt ON t.id = pt.turma_id
        WHERE pt.professor_id = ?;
    `;
    db.query(q, [professorId], (err, data) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(data);
    });
};

// ✅ FUNÇÃO PARA PEGAR OS ALUNOS DE UMA TURMA ✅
export const getAlunosDaTurma = (req, res) => {
    const { turmaId } = req.params;
    const q = `
        SELECT a.id, a.nome 
        FROM Aluno a
        JOIN Aluno_Turma at ON a.id = at.aluno_id
        WHERE at.turma_id = ?
        ORDER BY a.nome;
    `;
    db.query(q, [turmaId], (err, data) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(data);
    });
};

// ✅ FUNÇÃO PARA SALVAR A CHAMADA ✅
export const salvarChamada = (req, res) => {
    const professorId = req.user.id;
    const { turmaId, dataChamada, presencas } = req.body; // presencas = [{ alunoId: 1, presente: true }, ...]

    if (!turmaId || !dataChamada || !presencas) {
        return res.status(400).json({ error: "Dados da chamada incompletos." });
    }

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ error: "Erro ao iniciar transação." });

        // 1. Deleta a chamada antiga para esta turma e data, se houver, para evitar duplicatas
        const deleteQuery = 'DELETE FROM Controle_Presenca WHERE turma_id = ? AND data_presenca = ?';
        db.query(deleteQuery, [turmaId, dataChamada], (err, result) => {
            if (err) return db.rollback(() => res.status(500).json({ error: "Erro ao limpar registros antigos." }));

            // 2. Insere os novos registros de presença
            const insertQuery = 'INSERT INTO Controle_Presenca (turma_id, data_presenca, professor_id, aluno_id, presenca) VALUES ?';
            const values = presencas.map(p => [turmaId, dataChamada, professorId, p.alunoId, p.presente]);
            
            if (values.length === 0) {
                 // Se não há alunos para salvar, apenas commita a deleção (limpeza)
                return db.commit(err => {
                    if (err) return db.rollback(() => res.status(500).json({ error: "Erro ao finalizar." }));
                    return res.status(200).json({ message: "Nenhum aluno na turma para registrar presença." });
                });
            }

            db.query(insertQuery, [values], (err, result) => {
                if (err) return db.rollback(() => res.status(500).json({ error: "Erro ao salvar nova chamada." }));

                db.commit(err => {
                    if (err) return db.rollback(() => res.status(500).json({ error: "Erro ao finalizar transação." }));
                    res.status(201).json({ message: "Chamada salva com sucesso!" });
                });
            });
        });
    });
};

export const getProfileProfessor = (req, res) => {
    const userId = req.user.id; // ID vem do token

    // Esta query busca os dados do professor e junta com seu endereço
    const q = `
        SELECT 
            p.id, p.cpf, p.nome, p.sexo, p.data_nascimento, p.telefone, p.email,
            p.data_contratacao, p.ativo,
            e.cep, e.logradouro, e.numero_residencia, e.bairro, e.cidade, e.estado
        FROM Professor p
        LEFT JOIN Endereco e ON p.endereco_id = e.id
        WHERE p.id = ?;
    `;

    db.query(q, [userId], (err, data) => {
        if (err) {
            // O erro que precisamos ver está aqui no console do backend
            console.error("ERRO [getProfileProfessor]: Erro na consulta SQL:", err);
            return res.status(500).json({ error: "Erro no banco de dados." });
        }
        if (data.length === 0) {
            return res.status(404).json({ error: "Professor não encontrado." });
        }
        res.status(200).json(data[0]);
    });
};

// --- SERVIR A FOTO (LONGBLOB) ---
export const getProfessorFoto = (req, res) => {
    const { id } = req.params;
    db.query('SELECT foto FROM Professor WHERE id = ?', [id], (err, result) => {
        if (err || result.length === 0 || !result[0].foto) {
            return res.status(404).json({ error: "Imagem não encontrada." });
        }
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(result[0].foto);
    });
};

// --- ATUALIZAR A FOTO ---
export const updateProfessorFoto = (req, res) => {
    const userId = req.user.id;
    if (!req.file) return res.status(400).json({ error: "Nenhum arquivo enviado." });
    
    const fotoBuffer = req.file.buffer;
    const q = "UPDATE Professor SET foto = ? WHERE id = ?";
    db.query(q, [fotoBuffer, userId], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro no banco de dados." });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Professor não encontrado." });
        res.status(200).json({ message: "Foto atualizada com sucesso!" });
    });
};

// --- ATUALIZAR DADOS (SENHA, EMAIL, TELEFONE) ---
// (Estas funções são muito similares às do Apoiador, mas apontam para a tabela Professor)

export const updateProfessorSenha = async (req, res) => {
    const { senhaAtual, novaSenha } = req.body;
    const userId = req.user.id;
    if (!senhaAtual || !novaSenha) return res.status(400).json({ error: "Todos os campos de senha são obrigatórios." });

    db.query("SELECT senha FROM Professor WHERE id = ?", [userId], async (err, data) => {
        if (err || data.length === 0) return res.status(404).json({ error: "Professor não encontrado." });
        
        const user = data[0];
        const isPasswordValid = await bcrypt.compare(senhaAtual, user.senha);
        if (!isPasswordValid) return res.status(401).json({ error: "Senha atual incorreta." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(novaSenha, salt);

        db.query("UPDATE Professor SET senha = ? WHERE id = ?", [hashedPassword, userId], (err, result) => {
            if (err) return res.status(500).json({ error: "Erro ao atualizar a senha." });
            res.status(200).json({ message: "Senha atualizada com sucesso." });
        });
    });
};

export const getChamadaPorData = (req, res) => {
    const { turmaId, data } = req.query;
    const professorId = req.user.id; 

    if (!turmaId || !data) {
        return res.status(400).json({ error: "IDs da turma e a data são obrigatórios." });
    }

    const checkTurmaProfessorQuery = `
        SELECT t.id
        FROM Turma t
        JOIN Professor_Turma pt ON t.id = pt.turma_id
        WHERE t.id = ? AND pt.professor_id = ?;
    `;

    db.query(checkTurmaProfessorQuery, [turmaId, professorId], (err, result) => {
        if (err) {
            console.error("Erro ao verificar turma do professor:", err);
            return res.status(500).json({ error: "Erro no banco de dados ao verificar turma.", details: err.sqlMessage });
        }
        if (result.length === 0) {
            return res.status(403).json({ error: "Acesso negado. Você não é o professor desta turma ou a turma não existe." });
        }

        const q = `
            SELECT
                a.id AS alunoId,
                a.nome AS alunoNome, -- Garante que o nome do aluno é retornado como 'alunoNome'
                COALESCE(cp.presenca, TRUE) AS presente -- <--- PRINCIPAL MUDANÇA AQUI
            FROM Aluno_Turma at
            JOIN Aluno a ON at.aluno_id = a.id
            LEFT JOIN Controle_Presenca cp ON cp.aluno_id = a.id AND cp.turma_id = at.turma_id AND cp.data_presenca = ?
            WHERE at.turma_id = ?;
        `;
        db.query(q, [data, turmaId], (err, alunosData) => { 
            if (err) {
                console.error("Erro ao buscar chamada por data (Consulta Principal):", err);
                return res.status(500).json({ error: "Erro ao buscar dados da chamada.", details: err.sqlMessage });
            }

            const formattedAlunosData = alunosData.map(aluno => ({
                id: aluno.alunoId, 
                nome: aluno.alunoNome, 
                presente: Boolean(aluno.presente) 
            }));
            
            res.status(200).json(formattedAlunosData);
        });
    });
};