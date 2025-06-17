import db from '../config/database.js';
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { validateCPF, validateEmail, cleanPhone, formatDateToMySQL } from '../utils/validators.js';

export const createAluno = (req, res) => {
    // 1. DADOS DO FORMULÁRIO E ARQUIVO
    const {
        responsavel_cpf, responsavel_nome, responsavel_sexo, responsavel_data_nascimento,
        responsavel_telefone, responsavel_email, responsavel_grau_parentesco, responsavel_renda_familiar,
        responsavel_cep, responsavel_logradouro, responsavel_numero_residencia, responsavel_bairro, responsavel_cidade, responsavel_estado,
        aluno_cpf, aluno_nome, aluno_sexo, aluno_data_nascimento,
        aluno_necessidades_especiais, aluno_email, aluno_senha, aluno_confirmar_senha
    } = req.body;

    // ALTERAÇÃO: Captura o buffer da imagem em vez do caminho
    const aluno_foto_buffer = req.files && req.files['aluno_foto'] ? req.files['aluno_foto'][0].buffer : null;

    // 2. VALIDAÇÕES
    if (!responsavel_cpf || !responsavel_nome || !responsavel_data_nascimento || !responsavel_telefone || !responsavel_email || !responsavel_cep || !responsavel_logradouro || !responsavel_numero_residencia) {
        return res.status(400).json({ error: "Campos obrigatórios do responsável estão faltando." });
    }
    if (!aluno_nome || !aluno_data_nascimento || !aluno_senha || !aluno_cpf || !aluno_email) {
        return res.status(400).json({ error: "Campos obrigatórios do aluno estão faltando." });
    }
    if (aluno_senha !== aluno_confirmar_senha) {
        return res.status(400).json({ error: "As senhas do aluno não coincidem." });
    }
    if (!validateCPF(responsavel_cpf)) {
        return res.status(400).json({ error: "CPF do responsável inválido." });
    }
    if (!validateEmail(responsavel_email)) {
        return res.status(400).json({ error: "Email do responsável inválido." });
    }
    if (!validateCPF(aluno_cpf)) {
        return res.status(400).json({ error: "CPF do aluno inválido." });
    }
    if (!validateEmail(aluno_email)) {
        return res.status(400).json({ error: "Email do aluno inválido." });
    }

    // 3. LIMPEZA E FORMATAÇÃO DOS DADOS
    const cleanResponsavelCpf = responsavel_cpf.replace(/\D/g, '');
    const cleanResponsavelTelefone = cleanPhone(responsavel_telefone);
    const formattedResponsavelDataNascimento = formatDateToMySQL(responsavel_data_nascimento);
    const cleanResponsavelCep = responsavel_cep.replace(/\D/g, '');
    const cleanAlunoCpf = aluno_cpf.replace(/\D/g, '');
    const formattedAlunoDataNascimento = formatDateToMySQL(aluno_data_nascimento);

    // 4. TRANSAÇÃO COM O BANCO DE DADOS
    db.beginTransaction(function(err) {
        if (err) {
            console.error("Erro ao iniciar a transação:", err);
            return res.status(500).json({ error: "Erro interno do servidor.", message: err.message });
        }

        bcrypt.hash(aluno_senha, 10, (hashErr, hashedPassword) => {
            if (hashErr) {
                return db.rollback(() => {
                    console.error("Erro ao fazer hash da senha:", hashErr);
                    res.status(500).json({ error: "Erro interno do servidor ao processar senha.", message: hashErr.message });
                });
            }

            // Inserir Endereço primeiro
            // ALTERAÇÃO: Incluído bairro, cidade e estado
            const insertEnderecoSql = "INSERT INTO Endereco (cep, estado, cidade, bairro, logradouro, numero_residencia) VALUES (?, ?, ?, ?, ?, ?)";
            db.query(insertEnderecoSql, [cleanResponsavelCep, responsavel_estado, responsavel_cidade, responsavel_bairro, responsavel_logradouro, responsavel_numero_residencia], function(err, enderecoResult) {
                if (err) {
                    return db.rollback(() => {
                        console.error("Erro ao inserir endereço:", err);
                        res.status(500).json({ error: "Erro ao cadastrar endereço.", message: err.message });
                    });
                }
                const enderecoId = enderecoResult.insertId;

                // Inserir Responsável
                // ALTERAÇÃO: Removido 'profissao' e os campos de comprovantes.
                const insertResponsavelSql = "INSERT INTO Responsavel (cpf, nome, sexo, data_nascimento, telefone, email, grau_parentesco, renda_familiar, endereco_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                db.query(insertResponsavelSql, [
                    cleanResponsavelCpf, responsavel_nome, responsavel_sexo || null, formattedResponsavelDataNascimento,
                    cleanResponsavelTelefone, responsavel_email, responsavel_grau_parentesco || null, responsavel_renda_familiar || null, enderecoId
                ], function(err, responsavelResult) {
                    if (err) {
                        return db.rollback(() => {
                            console.error("Erro ao inserir responsável:", err);
                            if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: "CPF ou Email do responsável já cadastrado." });
                            res.status(500).json({ error: "Erro ao cadastrar responsável.", message: err.message });
                        });
                    }
                    const responsavelId = responsavelResult.insertId;

                    // Inserir Aluno
                    // ALTERAÇÃO: Removido 'nacionalidade' e 'endereco_id', trocado 'foto_path' por 'foto' (LONGBLOB)
                    const insertAlunoSql = "INSERT INTO Aluno (cpf, nome, sexo, data_nascimento, email, senha, necessidades_especiais, foto, responsavel_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    db.query(insertAlunoSql, [
                        cleanAlunoCpf, aluno_nome, aluno_sexo || null, formattedAlunoDataNascimento, aluno_email,
                        hashedPassword, aluno_necessidades_especiais || null, aluno_foto_buffer, responsavelId
                    ], function(err, alunoResult) {
                        if (err) {
                            return db.rollback(() => {
                                console.error("Erro ao inserir aluno:", err);
                                if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: "CPF ou Email do aluno já cadastrado." });
                                res.status(500).json({ error: "Erro ao cadastrar aluno.", message: err.message });
                            });
                        }

                        // Se tudo deu certo, commita a transação
                        db.commit(function(err) {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({ error: "Erro ao finalizar o cadastro.", message: err.message });
                                });
                            }
                            res.status(201).json({ message: "Aluno e responsável cadastrados com sucesso!" });
                        });
                    });
                });
            });
        });
    });
};

export const getProfileAluno = (req, res) => {
    const userId = req.user.id;
    const q = `
        SELECT
            a.id, a.cpf, a.nome, a.sexo, a.data_nascimento, a.email,
            a.necessidades_especiais, (a.foto IS NOT NULL) AS tem_foto,
            r.nome AS responsavel_nome, r.cpf AS responsavel_cpf, r.telefone AS responsavel_telefone, -- Telefone do RESPONSÁVEL
            r.email AS responsavel_email, r.grau_parentesco, r.renda_familiar, -- 'r.profissao' REMOVIDO AQUI
            e.logradouro AS endereco_logradouro, e.numero_residencia AS endereco_numero_residencia,
            e.cep AS endereco_cep, e.cidade AS endereco_cidade, e.estado AS endereco_estado
        FROM Aluno a
        LEFT JOIN Responsavel r ON a.responsavel_id = r.id
        LEFT JOIN Endereco e ON r.endereco_id = e.id OR a.endereco_id = e.id
        WHERE a.id = ?;
    `;
    db.query(q, [userId], (err, data) => {
        if (err) {
            console.error("Erro ao buscar perfil do aluno:", err);
            return res.status(500).json({ error: "Erro no banco de dados ao buscar perfil.", message: err.sqlMessage });
        }
        if (data.length === 0) {
            return res.status(404).json({ error: "Aluno não encontrado" });
        }

        const alunoProfile = data[0];
        const responsavelData = {
            nome: alunoProfile.responsavel_nome,
            cpf: alunoProfile.responsavel_cpf,
            telefone: alunoProfile.responsavel_telefone, // Este telefone é do RESPONSÁVEL
            email: alunoProfile.responsavel_email,
            grau_parentesco: alunoProfile.grau_parentesco,
            // profissao: alunoProfile.profissao, -- REMOVIDO AQUI
            renda_familiar: alunoProfile.renda_familiar,
            endereco: alunoProfile.endereco_logradouro ? {
                logradouro: alunoProfile.endereco_logradouro,
                numero_residencia: alunoProfile.endereco_numero_residencia,
                cep: alunoProfile.endereco_cep,
                cidade: alunoProfile.endereco_cidade,
                estado: alunoProfile.endereco_estado,
            } : null
        };

        const finalAlunoData = {
            id: alunoProfile.id,
            cpf: alunoProfile.cpf,
            nome: alunoProfile.nome,
            sexo: alunoProfile.sexo,
            data_nascimento: alunoProfile.data_nascimento,
            email: alunoProfile.email,
            // REMOVIDO: alunoProfile.telefone, pois não existe na tabela Aluno
            necessidades_especiais: alunoProfile.necessidades_especiais,
            foto: Boolean(alunoProfile.tem_foto),
            responsavel: responsavelData.nome ? responsavelData : null
        };

        res.status(200).json(finalAlunoData);
    });
};

export const getAlunos = (req, res) => {
    const q = "SELECT * FROM Aluno";
    db.query(q, (err, data) => {
        if (err) {
            console.error("Erro ao buscar alunos:", err);
            return res.status(500).json({ error: "Erro no banco de dados", message: err.message });
        }
        return res.status(200).json(data);
    });
};
export const getAlunoPresenceReports = (req, res) => {
    const alunoId = req.user.id; // ID do aluno logado (do token)
    const { mes, ano } = req.query; // Mês e ano vêm dos parâmetros de query (ex: ?mes=6&ano=2025)

    if (!mes || !ano) {
        return res.status(400).json({ error: "Mês e ano são obrigatórios para o relatório de presença." });
    }

    // A data de início e fim do mês selecionado
    const startDate = `${ano}-${String(mes).padStart(2, '0')}-01`;
    const endDate = `${ano}-${String(mes).padStart(2, '0')}-${new Date(ano, mes, 0).getDate()}`; // Último dia do mês

    const q = `
        SELECT 
            cp.id,
            t.nome AS aula, -- Nome da turma/aula
            cp.data_presenca AS data,
            cp.presenca -- Booleano (0 ou 1)
        FROM Controle_Presenca cp
        JOIN Aluno_Turma at ON cp.aluno_id = at.aluno_id AND cp.turma_id = at.turma_id
        JOIN Turma t ON cp.turma_id = t.id
        WHERE cp.aluno_id = ?
        AND cp.data_presenca BETWEEN ? AND ?
        ORDER BY cp.data_presenca ASC, t.nome ASC;
    `;

    db.query(q, [alunoId, startDate, endDate], (err, data) => {
        if (err) {
            console.error("Erro ao buscar relatórios de presença do aluno:", err);
            return res.status(500).json({ error: "Erro no banco de dados ao buscar relatórios de presença.", message: err.message });
        }

        // Formatar os dados para o frontend
        const formattedData = data.map(record => ({
            id: record.id,
            aula: record.aula,
            data: new Date(record.data).toLocaleDateString('pt-BR'), // Formata para DD/MM/AAAA
            status: record.presenca ? 'Presente' : 'Ausente' // Converte BOOLEAN para string
        }));
        
        console.log('DEBUG: Relatórios de presença retornados:', formattedData);
        return res.status(200).json(formattedData);
    });
};
export const getAlunoFoto = (req, res) => {
    const { id } = req.params;
    const q = 'SELECT foto FROM Aluno WHERE id = ?';

    db.query(q, [id], (err, result) => {
        if (err) {
            console.error("Erro ao buscar foto do aluno:", err);
            return res.status(500).json({ error: "Erro ao buscar a imagem." });
        }
        if (result.length === 0 || !result[0].foto) {
            return res.status(404).json({ error: "Foto não encontrada." });
        }

        const imageBuffer = result[0].foto;
        // Define o tipo de conteúdo para o navegador entender que é uma imagem
        res.setHeader('Content-Type', 'image/jpeg'); // ou 'image/png'
        res.send(imageBuffer);
    });
};
export const getAvailableTurmas = (req, res) => {
    const alunoId = req.user.id;

    // A consulta foi ajustada com COALESCE para tratar o caso de capacidade NULA
    const q = `
        SELECT 
            t.id, 
            t.nome, 
            t.sala, 
            COALESCE(t.capacidade, 0) AS capacidade, 
            t.dia_da_semana AS diaDaSemana, 
            t.hora_inicio AS horaInicio, 
            t.hora_termino AS horaTermino, 
            t.descricao, 
            t.nivel, 
            t.data_inicio AS dataInicio, 
            t.data_termino AS dataTermino,
            p.nome AS professor_nome,
            (SELECT COUNT(*) FROM Aluno_Turma WHERE turma_id = t.id) AS inscritos_count,
            CASE WHEN alt.aluno_id IS NOT NULL THEN TRUE ELSE FALSE END AS inscrito
        FROM Turma t
        LEFT JOIN Professor_Turma pt ON t.id = pt.turma_id
        LEFT JOIN Professor p ON pt.professor_id = p.id
        LEFT JOIN Aluno_Turma alt ON t.id = alt.turma_id AND alt.aluno_id = ?
        ORDER BY t.dia_da_semana, t.hora_inicio;
    `;

    db.query(q, [alunoId], (err, data) => {
        if (err) {
            console.error("Erro ao buscar turmas disponíveis:", err);
            return res.status(500).json({ error: "Erro no banco de dados.", message: err.message });
        }
        return res.status(200).json(data);
    });
};

export const inscreverAlunoTurma = (req, res) => {
    const alunoId = req.user.id;
    const { turmaId } = req.body;

    if (!turmaId) {
        return res.status(400).json({ error: "ID da turma é obrigatório." });
    }

    db.beginTransaction(err => {
        if (err) {
            console.error("Erro ao iniciar transação:", err);
            return res.status(500).json({ error: "Erro no servidor." });
        }

        // Query para buscar a capacidade e o número atual de inscritos, bloqueando a linha para update
        const checkQuery = `
            SELECT capacidade, (SELECT COUNT(*) FROM Aluno_Turma WHERE turma_id = ?) AS inscritos_count 
            FROM Turma WHERE id = ? FOR UPDATE;
        `;

        db.query(checkQuery, [turmaId, turmaId], (err, results) => {
            if (err) {
                return db.rollback(() => {
                    console.error("Erro ao verificar capacidade da turma:", err);
                    res.status(500).json({ error: "Erro ao verificar capacidade." });
                });
            }

            if (results.length === 0) {
                return db.rollback(() => res.status(404).json({ error: "Turma não encontrada." }));
            }

            const turma = results[0];
            if (turma.inscritos_count >= turma.capacidade) {
                // Se a turma já está lotada, desfaz a transação e avisa o usuário
                return db.rollback(() => res.status(409).json({ error: "Desculpe, a turma já está lotada." }));
            }

            // Se há vagas, prossiga com a inserção
            const insertQuery = 'INSERT INTO Aluno_Turma (aluno_id, turma_id) VALUES (?, ?)';
            db.query(insertQuery, [alunoId, turmaId], (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.status(409).json({ error: "Você já está inscrito nesta turma." });
                        }
                        res.status(500).json({ error: "Erro ao inscrever na turma." });
                    });
                }

                // Se tudo deu certo, confirma a transação
                db.commit(err => {
                    if (err) {
                        return db.rollback(() => res.status(500).json({ error: "Erro ao finalizar inscrição." }));
                    }
                    res.status(201).json({ message: "Inscrição realizada com sucesso!" });
                });
            });
        });
    });
};

export const desinscreverAlunoTurma = (req, res) => {
    const alunoId = req.user.id; // Aluno logado
    const { turmaId } = req.body; // ID da turma para desinscrição

    if (!turmaId) {
        return res.status(400).json({ error: "ID da turma é obrigatório para desinscrição." });
    }

    const q = `
        DELETE FROM Aluno_Turma
        WHERE aluno_id = ? AND turma_id = ?
    `;

    db.query(q, [alunoId, turmaId], (err, result) => {
        if (err) {
            console.error("Erro ao desinscrever aluno da turma:", err);
            return res.status(500).json({ error: "Erro no banco de dados ao desinscrever aluno.", message: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Aluno não estava inscrito nesta turma." });
        }
        res.status(200).json({ message: "Aluno desinscrito da turma com sucesso!" });
    });
};

export const getAlunoTurmas = (req, res) => {
    const alunoId = req.user.id; // ID do aluno logado (do token)

    const q = `
        SELECT 
            t.id, 
            t.nome AS atividade, -- 'atividade' no frontend é o 'nome' da turma no DB
            t.sala AS nomeSala, 
            t.dia_da_semana AS dia, 
            t.hora_inicio AS horarioInicio, 
            t.hora_termino AS horarioTermino, 
            p.nome AS professor -- Nome do professor, se houver
        FROM Aluno_Turma at
        JOIN Turma t ON at.turma_id = t.id
        LEFT JOIN Professor_Turma pt ON t.id = pt.turma_id
        LEFT JOIN Professor p ON pt.professor_id = p.id
        WHERE at.aluno_id = ?
        ORDER BY t.dia_da_semana, t.hora_inicio;
    `;

    db.query(q, [alunoId], (err, data) => {
        if (err) {
            console.error("Erro ao buscar turmas inscritas do aluno:", err);
            return res.status(500).json({ error: "Erro no banco de dados ao buscar turmas inscritas.", message: err.message });
        }

        // Formatar o horário para o frontend
        const formattedData = data.map(aula => ({
            id: aula.id,
            dia: aula.dia,
            nomeSala: aula.nomeSala,
            professor: aula.professor || 'Não Atribuído', // Professor pode ser NULL
            horario: `${aula.horarioInicio.substring(0, 5)} - ${aula.horarioTermino.substring(0, 5)}`, // Formata HH:MM
            atividade: aula.atividade
        }));
        
        console.log('DEBUG: Aulas inscritas retornadas:', formattedData);
        return res.status(200).json(formattedData);
    });
};

export const updateAlunoFoto = (req, res) => { // OU `updatePhoto` como você tinha em apoiador
    const alunoId = req.user.id; // ID do aluno logado

    if (!req.file) {
        return res.status(400).json({ error: "Nenhuma foto enviada." });
    }

    const fotoBuffer = req.file.buffer; // <--- ISSO É O CRÍTICO: Pegue o buffer da memória

    // A coluna no banco de dados deve ser `foto` (do tipo LONGBLOB)
    const q = "UPDATE Aluno SET foto = ? WHERE id = ?";

    db.query(q, [fotoBuffer, alunoId], (err, result) => {
        if (err) {
            console.error("Erro ao atualizar foto do aluno no banco de dados:", err);
            // err.sqlMessage pode ser útil para depuração
            return res.status(500).json({ error: "Erro no banco de dados ao atualizar foto.", details: err.sqlMessage });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Aluno não encontrado." });
        }
        res.status(200).json({ message: "Foto atualizada com sucesso!" });
    });
};