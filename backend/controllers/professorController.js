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

export const salvarChamada = (req, res) => {
    const professorId = req.user.id;
    const { turmaId, dataChamada, presencas } = req.body;

    if (!turmaId || !dataChamada || !presencas) {
        return res.status(400).json({ error: "Dados da chamada incompletos." });
    }

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ error: "Erro ao iniciar transação." });

        const deleteQuery = 'DELETE FROM Controle_Presenca WHERE turma_id = ? AND data_presenca = ?';
        db.query(deleteQuery, [turmaId, dataChamada], (err) => {
            if (err) return db.rollback(() => res.status(500).json({ error: "Erro ao limpar registros antigos." }));

            const insertQuery = 'INSERT INTO Controle_Presenca (turma_id, data_presenca, professor_id, aluno_id, presenca) VALUES ?';
            const values = presencas.map(p => [turmaId, dataChamada, professorId, p.alunoId, p.presente]);

            if (values.length === 0) {
                return db.commit(err => {
                    if (err) return db.rollback(() => res.status(500).json({ error: "Erro ao finalizar." }));
                    return res.status(200).json({ message: "Nenhum aluno na turma para registrar presença." });
                });
            }

            db.query(insertQuery, [values], (err) => {
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
    const userId = req.user.id;

    const q = `
        SELECT 
            p.id, p.cpf, p.nome, p.sexo, p.data_nascimento, p.telefone, p.email,
            p.data_contratacao, p.ativo,
            e.cep, e.logradouro,
