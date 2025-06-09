import db from '../config/database.js'; // Assumindo que db.js exporta a conexão direta (sem .promise())
import bcrypt from "bcrypt"; // Para hashing de senha
import fs from "fs"; // Para manipulação de arquivos (limpeza em caso de erro)
import path from "path"; // Para manipulação de caminhos de arquivo

// Importe suas funções utilitárias de validação
import { validateCPF, validateEmail, cleanPhone, formatDateToMySQL } from '../utils/validators.js'; // Certifique-se de que essas funções existem e funcionam corretamente

export const createAluno = (req, res) => {
    const {
        responsavel_cpf, responsavel_nome, responsavel_sexo, responsavel_data_nascimento,
        responsavel_telefone, responsavel_email, responsavel_logradouro,
        responsavel_numero_residencia, responsavel_cep, responsavel_grau_parentesco,
        responsavel_profissao, responsavel_renda_familiar,
        aluno_cpf, aluno_rg, aluno_nome, aluno_sexo, aluno_data_nascimento,
        aluno_nacionalidade, aluno_telefone, aluno_necessidades_especiais,
        aluno_email, aluno_senha, aluno_confirmar_senha // Adicionado para verificação de senha
    } = req.body;

    // Acessa os nomes dos arquivos do Multer.
    // req.files contém um objeto onde as chaves são os 'name' dos campos do input file
    // e os valores são arrays de arquivos.
    const responsavel_comprovante_residencia_path = req.files && req.files['responsavel_comprovante_residencia'] && req.files['responsavel_comprovante_residencia'][0] ? req.files['responsavel_comprovante_residencia'][0].path : null;
    const responsavel_comprovante_renda_path = req.files && req.files['responsavel_comprovante_renda'] && req.files['responsavel_comprovante_renda'][0] ? req.files['responsavel_comprovante_renda'][0].path : null;
    const aluno_foto_path = req.files && req.files['aluno_foto'] && req.files['aluno_foto'][0] ? req.files['aluno_foto'][0].path : null;

    // Função auxiliar para limpar arquivos em caso de erro
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

    // Validações (semelhante ao seu ApoiadorController)
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
    if (aluno_cpf && !validateCPF(aluno_cpf)) { // CPF do aluno pode ser opcional ou não. Ajuste conforme seu DB.
        cleanUpFiles();
        return res.status(400).json({ error: "CPF do aluno inválido." });
    }
    if (aluno_email && !validateEmail(aluno_email)) { // Email do aluno pode ser opcional. Ajuste conforme seu DB.
        cleanUpFiles();
        return res.status(400).json({ error: "Email do aluno inválido." });
    }
    if (!aluno_senha) {
        cleanUpFiles();
        return res.status(400).json({ error: "A senha do aluno é obrigatória." });
    }


    // Limpa e formata dados
    const cleanResponsavelCpf = responsavel_cpf.replace(/\D/g, '');
    const cleanResponsavelTelefone = cleanPhone(responsavel_telefone);
    const formattedResponsavelDataNascimento = formatDateToMySQL(responsavel_data_nascimento);
    const cleanResponsavelCep = responsavel_cep.replace(/\D/g, '');

    const cleanAlunoCpf = aluno_cpf ? aluno_cpf.replace(/\D/g, '') : null;
    const cleanAlunoTelefone = cleanPhone(aluno_telefone);
    const formattedAlunoDataNascimento = formatDateToMySQL(aluno_data_nascimento);

    // Inicia uma transação para garantir a atomicidade das operações
    db.beginTransaction(function(err) {
        if (err) {
            cleanUpFiles();
            console.error("Erro ao iniciar a transação:", err);
            return res.status(500).json({ error: "Erro interno do servidor.", message: err.message });
        }

        // Hashing da senha do aluno
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

                // 1. Inserir Endereço do Responsável
                const insertEnderecoResponsavelSql = "INSERT INTO Endereco (logradouro, numero_residencia, cep) VALUES (?, ?, ?)";
                db.query(insertEnderecoResponsavelSql, [responsavel_logradouro, responsavel_numero_residencia, cleanResponsavelCep], function(err, enderecoResponsavelResult) {
                    if (err) {
                        return db.rollback(function() {
                            cleanUpFiles();
                            console.error("Erro ao inserir endereço do responsável:", err);
                            // TRATAMENTO DE ERRO DUPLICADO: Ocorre se o CEP+Logradouro+Numero já existe e você tem UNIQUE na tabela Endereco.
                            if (err.code === 'ER_DUP_ENTRY') {
                                return res.status(409).json({ error: "Endereço já cadastrado. Verifique o CEP, logradouro e número." });
                            }
                            return res.status(500).json({ error: "Erro no banco de dados.", message: err.message });
                        });
                    }
                    const enderecoResponsavelId = enderecoResponsavelResult.insertId;

                    // 2. Inserir Responsável
                    const insertResponsavelSql = "INSERT INTO Responsavel (cpf, nome, sexo, data_nascimento, telefone, email, grau_parentesco, profissao, renda_familiar, comprovante_residencia_path, comprovante_renda_path, endereco_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
                                // TRATAMENTO DE ERRO DUPLICADO: Ocorre se CPF ou Email do Responsável já existe
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

                        // 3. Inserir Aluno
                        const insertAlunoSql = "INSERT INTO Aluno (cpf, rg, nome, sexo, data_nascimento, nacionalidade, telefone, necessidades_especiais, email, senha, foto_path, responsavel_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                        db.query(insertAlunoSql, [
                            cleanAlunoCpf,
                            aluno_rg,
                            aluno_nome,
                            aluno_sexo,
                            formattedAlunoDataNascimento,
                            aluno_nacionalidade,
                            cleanAlunoTelefone,
                            aluno_necessidades_especiais,
                            aluno_email,
                            hashedPassword, // Senha hasheada
                            aluno_foto_path, // Caminho da foto
                            responsavelId
                        ], function(err, alunoResult) {
                            if (err) {
                                return db.rollback(function() {
                                    cleanUpFiles();
                                    console.error("Erro ao inserir aluno:", err);
                                    // TRATAMENTO DE ERRO DUPLICADO: Ocorre se CPF ou Email do Aluno já existe
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

                            // Confirma a transação
                            db.commit(function(err) {
                                if (err) {
                                    return db.rollback(function() {
                                        cleanUpFiles(); // Garante a limpeza dos arquivos se o commit falhar
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

// Exemplo de como você faria um controller para listar alunos
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

// Outros controllers como updateAluno, deleteAluno, etc.