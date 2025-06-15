import db from '../config/database.js';
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { validateCPF, validateEmail, cleanPhone, formatDateToMySQL } from '../utils/validators.js';

export const createAluno = (req, res) => {
    const {
        responsavel_cpf, responsavel_nome, responsavel_sexo, responsavel_data_nascimento,
        responsavel_telefone, responsavel_email, responsavel_logradouro,
        responsavel_numero_residencia, responsavel_cep, responsavel_grau_parentesco,
        responsavel_profissao, responsavel_renda_familiar,
        aluno_cpf, aluno_nome, aluno_sexo, aluno_data_nascimento,
        aluno_nacionalidade, aluno_necessidades_especiais,
        aluno_email, aluno_senha, aluno_confirmar_senha
    } = req.body;

    const responsavel_comprovante_residencia_path = req.files && req.files['responsavel_comprovante_residencia'] && req.files['responsavel_comprovante_residencia'][0] ? req.files['responsavel_comprovante_residencia'][0].path : null;
    const responsavel_comprovante_renda_path = req.files && req.files['responsavel_comprovante_renda'] && req.files['responsavel_comprovante_renda'][0] ? req.files['responsavel_comprovante_renda'][0].path : null;
    const aluno_foto_path = req.files && req.files['aluno_foto'] && req.files['aluno_foto'][0] ? req.files['aluno_foto'][0].path : null;

    const cleanUpFiles = () => {
        if (responsavel_comprovante_residencia_path && fs.existsSync(responsavel_comprovante_residencia_path)) {
            fs.unlinkSync(responsavel_comprovante_residencia_path);
        }
        if (responsavel_comprovante_renda_path && fs.existsSync(responsavel_comprovante_renda_path)) {
            fs.unlinkSync(responsavel_comprovante_renda_path);
        }
        if (aluno_foto_path && fs.existsSync(aluno_foto_path)) {
            fs.unlinkSync(aluno_foto_path);
        }
    };

    // ===== CORREÇÃO APLICADA AQUI =====
    // Validações
    if (!responsavel_telefone) {
        cleanUpFiles();
        return res.status(400).json({ error: "O telefone do responsável é obrigatório." });
    }
    if (aluno_senha !== aluno_confirmar_senha) {
        cleanUpFiles();
        return res.status(400).json({ error: "As senhas do aluno não coincidem." });
    }
    if (!validateCPF(responsavel_cpf)) {
        cleanUpFiles();
        return res.status(400).json({ error: "CPF do responsável inválido." });
    }
    if (!validateEmail(responsavel_email)) {
        cleanUpFiles();
        return res.status(400).json({ error: "Email do responsável inválido." });
    }
    if (aluno_cpf && !validateCPF(aluno_cpf)) {
        cleanUpFiles();
        return res.status(400).json({ error: "CPF do aluno inválido." });
    }
    if (aluno_email && !validateEmail(aluno_email)) {
        cleanUpFiles();
        return res.status(400).json({ error: "Email do aluno inválido." });
    }
    if (!aluno_senha) {
        cleanUpFiles();
        return res.status(400).json({ error: "A senha do aluno é obrigatória." });
    }

    // Limpa e formata dados
    const cleanResponsavelCpf = responsavel_cpf.replace(/\D/g, '');
    const cleanResponsavelTelefone = cleanPhone(responsavel_telefone); // Esta linha agora é segura
    const formattedResponsavelDataNascimento = formatDateToMySQL(responsavel_data_nascimento);
    const cleanResponsavelCep = responsavel_cep.replace(/\D/g, '');

    const cleanAlunoCpf = aluno_cpf ? aluno_cpf.replace(/\D/g, '') : null;
    const formattedAlunoDataNascimento = formatDateToMySQL(aluno_data_nascimento);

    // Inicia uma transação
    db.beginTransaction(function(err) {
        if (err) {
            cleanUpFiles();
            console.error("Erro ao iniciar a transação:", err);
            return res.status(500).json({ error: "Erro interno do servidor.", message: err.message });
        }

        bcrypt.genSalt(10, (saltErr, salt) => {
            if (saltErr) {
                return db.rollback(function() {
                    cleanUpFiles();
                    console.error("Erro ao gerar salt para a senha:", saltErr);
                    return res.status(500).json({ error: "Erro interno do servidor.", message: saltErr.message });
                });
            }

            bcrypt.hash(aluno_senha, salt, (hashErr, hashedPassword) => {
                if (hashErr) {
                    return db.rollback(function() {
                        cleanUpFiles();
                        console.error("Erro ao fazer hash da senha:", hashErr);
                        return res.status(500).json({ error: "Erro interno do servidor.", message: hashErr.message });
                    });
                }

                const insertEnderecoResponsavelSql = "INSERT INTO Endereco (logradouro, numero_residencia, cep) VALUES (?, ?, ?)";
                db.query(insertEnderecoResponsavelSql, [responsavel_logradouro, responsavel_numero_residencia, cleanResponsavelCep], function(err, enderecoResponsavelResult) {
                    if (err) {
                        return db.rollback(function() {
                            cleanUpFiles();
                            console.error("Erro ao inserir endereço do responsável:", err);
                            if (err.code === 'ER_DUP_ENTRY') {
                                return res.status(409).json({ error: "Endereço já cadastrado. Verifique o CEP, logradouro e número." });
                            }
                            return res.status(500).json({ error: "Erro no banco de dados.", message: err.message });
                        });
                    }
                    const enderecoResponsavelId = enderecoResponsavelResult.insertId;

                    const insertResponsavelSql = "INSERT INTO Responsavel (cpf, nome, sexo, data_nascimento, telefone, email, grau_parentesco, profissao, renda_familiar, comprovante_residencia_path, comprovante_renda_pat, endereco_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    db.query(insertResponsavelSql, [
                        cleanResponsavelCpf,
                        responsavel_nome,
                        responsavel_sexo,
                        formattedResponsavelDataNascimento,
                        cleanResponsavelTelefone,
                        responsavel_email,
                        responsavel_grau_parentesco,
                        responsavel_profissao,
                        responsavel_renda_familiar,
                        responsavel_comprovante_residencia_path,
                        responsavel_comprovante_renda_path,
                        enderecoResponsavelId
                    ], function(err, responsavelResult) {
                        if (err) {
                            return db.rollback(function() {
                                cleanUpFiles();
                                console.error("Erro ao inserir responsável:", err);
                                if (err.code === 'ER_DUP_ENTRY') {
                                    if (err.sqlMessage.includes('cpf')) {
                                        return res.status(409).json({ error: "CPF do responsável já cadastrado." });
                                    } else if (err.sqlMessage.includes('email')) {
                                        return res.status(409).json({ error: "Email do responsável já cadastrado." });
                                    }
                                }
                                return res.status(500).json({ error: "Erro no banco de dados.", message: err.message });
                            });
                        }
                        const responsavelId = responsavelResult.insertId;

                        const insertAlunoSql = "INSERT INTO Aluno (cpf, nome, sexo, data_nascimento, nacionalidade, necessidades_especiais, email, senha, foto_path, responsavel_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        db.query(insertAlunoSql, [
                            cleanAlunoCpf,
                            aluno_nome,
                            aluno_sexo,
                            formattedAlunoDataNascimento,
                            aluno_nacionalidade,
                            aluno_necessidades_especiais,
                            aluno_email,
                            hashedPassword,
                            aluno_foto_path,
                            responsavelId
                        ], function(err, alunoResult) {
                            if (err) {
                                return db.rollback(function() {
                                    cleanUpFiles();
                                    console.error("Erro ao inserir aluno:", err);
                                    if (err.code === 'ER_DUP_ENTRY') {
                                        if (err.sqlMessage.includes('cpf')) {
                                            return res.status(409).json({ error: "CPF do aluno já cadastrado." });
                                        } else if (err.sqlMessage.includes('email')) {
                                            return res.status(409).json({ error: "Email do aluno já cadastrado." });
                                        }
                                    }
                                    return res.status(500).json({ error: "Erro no banco de dados.", message: err.message });
                                });
                            }

                            db.commit(function(err) {
                                if (err) {
                                    return db.rollback(function() {
                                        cleanUpFiles();
                                        console.error("Erro ao commitar transação:", err);
                                        return res.status(500).json({ error: "Erro interno do servidor.", message: err.message });
                                    });
                                }
                                res.status(201).json({ message: "Aluno e responsável cadastrados com sucesso!" });
                            });
                        });
                    });
                });
            });
        });
    });
};

export const getProfileAluno = (req, res) => {
    const userId = req.user.id; // O ID do aluno logado vem do token

    const q = `
        SELECT 
            a.id, a.cpf, a.nome, a.sexo, a.data_nascimento, a.nacionalidade, a.email, 
            a.necessidades_especiais, a.foto_path, a.data_matricula,
            r.id AS responsavel_id, r.nome AS responsavel_nome, r.cpf AS responsavel_cpf, 
            r.sexo AS responsavel_sexo, r.data_nascimento AS responsavel_data_nascimento, 
            r.telefone AS responsavel_telefone, r.email AS responsavel_email, 
            r.grau_parentesco AS responsavel_grau_parentesco, r.profissao AS responsavel_profissao, 
            r.renda_familiar AS responsavel_renda_familiar,
            e.logradouro, e.numero_residencia, e.cep, e.cidade, e.estado, e.pais
        FROM Aluno a
        LEFT JOIN Responsavel r ON a.responsavel_id = r.id
        LEFT JOIN Endereco e ON r.endereco_id = e.id -- Endereço do responsável
        WHERE a.id = ?;
    `;

    db.query(q, [userId], (err, data) => {
        if (err) {
            console.error("Erro ao buscar perfil do aluno:", err);
            return res.status(500).json({ error: "Erro no banco de dados ao buscar perfil do aluno.", message: err.message });
        }

        if (data.length === 0) {
            return res.status(404).json({ error: "Aluno não encontrado." });
        }

        // O resultado pode vir com campos NULL se o responsável ou endereço não existirem.
        // Formate a resposta para ser mais amigável no frontend.
        const alunoProfile = data[0];
        const formattedProfile = {
            id: alunoProfile.id,
            cpf: alunoProfile.cpf,
            nome: alunoProfile.nome,
            sexo: alunoProfile.sexo,
            data_nascimento: alunoProfile.data_nascimento, // Mantenha como objeto Date ou string
            nacionalidade: alunoProfile.nacionalidade,
            email: alunoProfile.email,
            necessidades_especiais: alunoProfile.necessidades_especiais,
            foto_path: alunoProfile.foto_path,
            data_matricula: alunoProfile.data_matricula,
            
            // Dados do Responsável
            responsavel: alunoProfile.responsavel_id ? {
                id: alunoProfile.responsavel_id,
                nome: alunoProfile.responsavel_nome,
                cpf: alunoProfile.responsavel_cpf,
                sexo: alunoProfile.responsavel_sexo,
                data_nascimento: alunoProfile.responsavel_data_nascimento,
                telefone: alunoProfile.responsavel_telefone,
                email: alunoProfile.responsavel_email,
                grau_parentesco: alunoProfile.grau_parentesco,
                profissao: alunoProfile.profissao,
                renda_familiar: alunoProfile.renda_familiar,
                endereco: alunoProfile.logradouro ? { // Endereço do Responsável
                    logradouro: alunoProfile.logradouro,
                    numero_residencia: alunoProfile.numero_residencia,
                    cep: alunoProfile.cep,
                    cidade: alunoProfile.cidade,
                    estado: alunoProfile.estado,
                    pais: alunoProfile.pais,
                } : null
            } : null
        };
        
        return res.status(200).json(formattedProfile);
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

export const getAvailableTurmas = (req, res) => {
    const alunoId = req.user.id; // ID do aluno logado

    const q = `
        SELECT 
            t.id, 
            t.nome, 
            t.sala, 
            t.capacidade, 
            t.dia_da_semana AS diaDaSemana, 
            t.hora_inicio AS horaInicio, 
            t.hora_termino AS horaTermino, 
            t.descricao, 
            t.nivel, 
            t.data_inicio AS dataInicio, 
            t.data_termino AS dataTermino,
            p.nome AS professor_nome, -- Nome do professor, se houver associação
            CASE WHEN alt.aluno_id IS NOT NULL THEN TRUE ELSE FALSE END AS inscrito -- Verifica se o aluno já está inscrito
        FROM Turma t
        LEFT JOIN Professor_Turma pt ON t.id = pt.turma_id
        LEFT JOIN Professor p ON pt.professor_id = p.id
        LEFT JOIN Aluno_Turma alt ON t.id = alt.turma_id AND alt.aluno_id = ?
        ORDER BY t.dia_da_semana, t.hora_inicio;
    `;

    db.query(q, [alunoId], (err, data) => {
        if (err) {
            console.error("Erro ao buscar turmas disponíveis:", err);
            return res.status(500).json({ error: "Erro no banco de dados ao buscar turmas disponíveis.", message: err.message });
        }
        console.log('DEBUG: Turmas disponíveis retornadas:', data);
        return res.status(200).json(data);
    });
};

// --- NOVA FUNÇÃO: inscreverAlunoTurma ---
export const inscreverAlunoTurma = (req, res) => {
    const alunoId = req.user.id; // Aluno logado
    const { turmaId } = req.body; // ID da turma para inscrição

    if (!turmaId) {
        return res.status(400).json({ error: "ID da turma é obrigatório para inscrição." });
    }

    const q = `
        INSERT INTO Aluno_Turma (aluno_id, turma_id)
        VALUES (?, ?)
    `;

    db.query(q, [alunoId, turmaId], (err, result) => {
        if (err) {
            console.error("Erro ao inscrever aluno na turma:", err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: "Aluno já está inscrito nesta turma." });
            }
            return res.status(500).json({ error: "Erro no banco de dados ao inscrever aluno.", message: err.message });
        }
        res.status(201).json({ message: "Aluno inscrito na turma com sucesso!" });
    });
};

// --- NOVA FUNÇÃO: desinscreverAlunoTurma ---
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