// backend/controllers/adminController.js 

import db from '../config/database.js'; 
import bcrypt from 'bcrypt'; 
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateCPF, validateEmail, cleanPhone, formatDateToMySQL } from '../utils/validators.js'; 

export const getProfileAdministrador = (req, res) => { 
    const userId = req.user.id; 
    const q_ajustado_sem_nome = ` 
        SELECT  
            id, email 
        FROM Administrador 
        WHERE id = ?; 
    `; 

    db.query(q_ajustado_sem_nome, [userId], (err, data) => { 
        if (err) { 
            console.error("Erro ao buscar perfil do administrador:", err); 
            return res.status(500).json({ error: "Erro no banco de dados ao buscar perfil do administrador.", message: err.message }); 
        } 
        if (data.length === 0) { 
            return res.status(404).json({ error: "Administrador não encontrado." }); 
        } 
        const adminProfile = data[0]; 
        adminProfile.nome = "Administrador"; 
        adminProfile.foto_path = null; 
        console.log('DEBUG: Perfil do administrador retornado:', adminProfile); 
        return res.status(200).json(adminProfile); 
    }); 
}; 

export const getProfessorsList = (req, res) => { 
    const q = "SELECT id, nome FROM Professor ORDER BY nome ASC"; 
    db.query(q, (err, data) => { 
        if (err) { 
            console.error("ERRO [getProfessorsList-BE]: Erro ao buscar lista de professores:", err); 
            return res.status(500).json({ error: "Erro no banco de dados ao buscar professores.", message: err.message }); 
        } 
        console.log('DEBUG: Lista de professores retornada:', data); 
        return res.status(200).json(data); 
    }); 
}; 

export const createProfessor = (req, res) => { 
    const adminRole = req.user?.role; 

    if (adminRole !== 'administrador') { 
        return res.status(403).json({ error: "Acesso negado. Somente administradores podem criar perfis de professor." }); 
    } 

    const { 
        nome, cpf, sexo, data_nascimento, telefone, email, senha,  
        data_contratacao, 
        cep, bairro, cidade, estado, logradouro, numero_residencia 
    } = req.body; 

    console.log('DEBUG [createProfessor-BE]: req.body recebido:', req.body); 

    const cleanCpf = cpf.replace(/\D/g, ''); 
    const cleanTelefone = telefone ? cleanPhone(telefone) : null; 
    const formattedDataNascimento = formatDateToMySQL(data_nascimento); 
    const cleanCep = cep.replace(/\D/g, ''); 
    
    console.log('DEBUG [createProfessor-BE]: cleanCpf:', cleanCpf); 
    console.log('DEBUG [createProfessor-BE]: cleanTelefone:', cleanTelefone); 
    console.log('DEBUG [createProfessor-BE]: formattedDataNascimento:', formattedDataNascimento); 
    console.log('DEBUG [createProfessor-BE]: cleanCep:', cleanCep); 

    if (!nome || !cpf || !data_nascimento || !email || !senha ||  
        !logradouro || !numero_residencia || !cep || !bairro) { 
        return res.status(400).json({ error: "Campos obrigatórios faltando: Nome, CPF, Data de Nascimento, Email, Senha, Logradouro, Número, CEP, Bairro." }); 
    } 
    if (!validateCPF(cpf)) { return res.status(400).json({ error: "CPF inválido." }); } 
    if (!validateEmail(email)) { return res.status(400).json({ error: "Email inválido." }); } 
    if (senha.length < 6) { return res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres." }); } 

    db.beginTransaction(function(err) { 
        if (err) { 
            console.error("ERRO [createProfessor-BE]: Erro ao iniciar transação:", err); 
            return res.status(500).json({ error: "Erro interno do servidor ao iniciar transação.", message: err.message }); 
        } 

        bcrypt.genSalt(10, (saltErr, salt) => { 
            if (saltErr) { 
                return db.rollback(function() { 
                    console.error("ERRO [createProfessor-BE]: Erro ao gerar salt para a senha:", saltErr); 
                    return res.status(500).json({ error: "Erro interno do servidor ao gerar salt.", message: saltErr.message }); 
                }); 
            } 

            bcrypt.hash(senha, salt, (hashErr, hashedPassword) => { 
                if (hashErr) { 
                    return db.rollback(function() { 
                        console.error("ERRO [createProfessor-BE]: Erro ao fazer hash da senha:", hashErr); 
                        return res.status(500).json({ error: "Erro interno do servidor ao hashear senha.", message: hashErr.message }); 
                    }); 
                } 

                const insertEnderecoSql = "INSERT INTO Endereco (cep, estado, cidade, bairro, logradouro, numero_residencia) VALUES (?, ?, ?, ?, ?, ?)"; 
                db.query(insertEnderecoSql, [ 
                    cleanCep, estado || null, cidade || null, bairro, logradouro, numero_residencia 
                ], function(err, enderecoResult) { 
                    if (err) { 
                        return db.rollback(function() { 
                            console.error("ERRO [createProfessor-BE]: Erro ao inserir endereço:", err); 
                            if (err.code === 'ER_DUP_ENTRY') { 
                                return res.status(409).json({ error: "Endereço já cadastrado. Verifique o CEP, logradouro, número e bairro." }); 
                            } 
                            return res.status(500).json({ error: "Erro no banco de dados ao inserir endereço.", message: err.message }); 
                        }); 
                    } 
                    const enderecoId = enderecoResult.insertId; 
                    console.log(`DEBUG [createProfessor-BE]: Endereço criado com ID: ${enderecoId}`); 

                    const insertProfessorSql = ` 
                        INSERT INTO Professor ( 
                            cpf, nome, sexo, data_nascimento, telefone, email, senha,  
                            data_contratacao,  
                            ativo, endereco_id 
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                    `; 

                    db.query(insertProfessorSql, [ 
                        cleanCpf,  
                        nome,  
                        sexo || null,  
                        formattedDataNascimento,  
                        cleanTelefone,  
                        email,  
                        hashedPassword, 
                        data_contratacao || null,  
                        true,
                        enderecoId 
                    ], function(err, professorResult) { 
                        if (err) { 
                            return db.rollback(function() { 
                                console.error("ERRO [createProfessor-BE]: Erro ao inserir professor:", err); 
                                if (err.code === 'ER_DUP_ENTRY') { 
                                    if (err.sqlMessage.includes('cpf')) { 
                                        return res.status(409).json({ error: "CPF do professor já cadastrado." }); 
                                    } else if (err.sqlMessage.includes('email')) { 
                                        return res.status(409).json({ error: "Email do professor já cadastrado." }); 
                                    } 
                                } 
                                return res.status(500).json({ error: "Erro no banco de dados ao inserir professor.", message: err.message }); 
                            }); 
                        } 
                        const professorId = professorResult.insertId; 
                        console.log(`DEBUG [createProfessor-BE]: Professor criado com ID: ${professorId}`); 

                        db.commit(function(err) { 
                            if (err) { 
                                return db.rollback(function() { 
                                    console.error("ERRO [createProfessor-BE]: Erro ao commitar transação:", err); 
                                    return res.status(500).json({ error: "Erro ao finalizar criação do professor.", message: err.message }); 
                                }); 
                            } 
                            res.status(201).json({ message: "Professor cadastrado com sucesso!", professorId: professorId }); 
                        }); 
                    }); 
                }); 
            }); 
        }); 
    }); 
}; 


export const getAdminDashboardStats = (req, res) => {
    if (!req.user || req.user.role !== 'administrador') {
        return res.status(403).json({ error: "Acesso negado. Somente administradores podem acessar relatórios gerais." });
    }

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const stats = {};
    const errors = [];
    const totalQueries = 4;
    let queriesCompleted = 0;

    // Função para ser chamada ao final de cada consulta
    const checkDone = () => {
        queriesCompleted++;
        if (queriesCompleted === totalQueries) {
            if (errors.length > 0) {
                console.error("ERRO [getAdminDashboardStats-BE]: Erros ao buscar estatísticas:", errors);
                return res.status(500).json({
                    error: "Erro ao buscar algumas estatísticas.",
                    details: errors
                });
            }
            console.log('DEBUG [getAdminDashboardStats-BE]: Estatísticas retornadas:', stats);
            return res.status(200).json(stats);
        }
    };

    // 1. Contagem total de alunos ativos
    db.query("SELECT COUNT(id) AS totalAlunos FROM Aluno WHERE ativo = TRUE", (err, result) => {
        if (err) errors.push({ type: "alunos", message: err.message });
        stats.totalAlunos = result?.[0]?.totalAlunos || 0;
        checkDone();
    });

    // 2. Contagem total de professores ativos
    db.query("SELECT COUNT(id) AS totalProfessores FROM Professor WHERE ativo = TRUE", (err, result) => {
        if (err) errors.push({ type: "professores", message: err.message });
        stats.totalProfessores = result?.[0]?.totalProfessores || 0;
        checkDone();
    });

    // 3. Total de doações recebidas este mês
    const qDoacoesMes = `
        SELECT SUM(valor_doado) AS totalDoadoMes 
        FROM Apoiador_Doacao 
        WHERE MONTH(data_doacao) = ? AND YEAR(data_doacao) = ?;
    `;
    db.query(qDoacoesMes, [currentMonth, currentYear], (err, result) => {
        if (err) errors.push({ type: "doacoesMes", message: err.message });
        stats.totalDoadoMes = result?.[0]?.totalDoadoMes ? parseFloat(result[0].totalDoadoMes) : 0;
        checkDone();
    });

    // 4. Contagem de turmas ativas
    const qTurmasAtivas = `
        SELECT COUNT(id) AS totalTurmasAtivas 
        FROM Turma 
        WHERE data_termino IS NULL OR data_termino >= CURDATE();
    `;
    db.query(qTurmasAtivas, (err, result) => {
        if (err) errors.push({ type: "turmasAtivas", message: err.message });
        stats.totalTurmasAtivas = result?.[0]?.totalTurmasAtivas || 0;
        checkDone();
    });
};


export const createTurma = (req, res) => { 
    const adminRole = req.user.role; 

    if (adminRole !== 'administrador') { 
        return res.status(403).json({ error: "Acesso negado. Somente administradores podem criar turmas." }); 
    } 

    const {  
        nome, sala, capacidade, dia_da_semana, hora_inicio, hora_termino,  
        descricao, nivel, data_inicio, data_termino, 
        professor_id  
    } = req.body; 

    if (!nome || !sala || !capacidade || !dia_da_semana || !hora_inicio || !hora_termino || !nivel) { 
        return res.status(400).json({ error: "Campos obrigatórios da turma faltando: nome, sala, capacidade, dia da semana, hora início, hora término, nível." }); 
    } 
    if (parseInt(capacidade) <= 0) { 
        return res.status(400).json({ error: "Capacidade da turma deve ser um número positivo." }); 
    } 
    if (hora_inicio >= hora_termino) { 
        return res.status(400).json({ error: "A hora de início deve ser anterior à hora de término." }); 
    } 

    db.beginTransaction(function(err) { 
        if (err) { 
            console.error("ERRO [createTurma-BE]: Erro ao iniciar transação:", err); 
            return res.status(500).json({ error: "Erro interno do servidor.", message: err.message }); 
        } 

        
        const checkOverlapSql = `
            SELECT id, nome, dia_da_semana, hora_inicio, hora_termino, sala, data_inicio, data_termino
            FROM Turma
            WHERE sala = ? 
            AND dia_da_semana = ? 
            AND (hora_inicio < ? AND hora_termino > ?)
            AND (
                COALESCE(data_inicio, '1000-01-01') < ? 
                AND 
                COALESCE(data_termino, '9999-12-31') > ?
            );
        `; 

        db.query(checkOverlapSql, [ 
            sala,  
            dia_da_semana,  
            hora_termino, // hora_termino_nova
            hora_inicio,  // hora_inicio_nova
            data_termino || '9999-12-31', // data_termino_nova (para comparação com data_inicio_existente)
            data_inicio || '1000-01-01'   // data_inicio_nova (para comparação com data_termino_existente)
        ], function(err, overlapResults) { 
            if (err) { 
                return db.rollback(function() {
                    console.error("ERRO [createTurma-BE]: Erro ao verificar sobreposição de turma:", err); 
                    return res.status(500).json({ error: "Erro ao verificar horários de turmas existentes.", message: err.message }); 
                });
            } 

            if (overlapResults.length > 0) { 
                const conflictingTurma = overlapResults[0]; 
                
                const conflitoHoraInicio = conflictingTurma.hora_inicio ? conflictingTurma.hora_inicio.substring(0,5) : 'N/A'; 
                const conflitoHoraTermino = conflictingTurma.hora_termino ? conflictingTurma.hora_termino.substring(0,5) : 'N/A';  
                const conflitoDataInicio = conflictingTurma.data_inicio ? new Date(conflictingTurma.data_inicio).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'Aberta'; 
                const conflitoDataTermino = conflictingTurma.data_termino ? new Date(conflictingTurma.data_termino).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'Aberta'; 

                return db.rollback(function() { 
                    return res.status(409).json({  
                        error: `Conflito de horário. A sala ${conflictingTurma.sala} já está ocupada pela turma "${conflictingTurma.nome}" no mesmo dia e horário, no período de ${conflitoDataInicio} a ${conflitoDataTermino}.`, 
                        details: conflictingTurma 
                    }); 
                }); 
            } 
            
            const insertTurmaSql = `
                INSERT INTO Turma (nome, sala, capacidade, dia_da_semana, hora_inicio, hora_termino, descricao, nivel, data_inicio, data_termino)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `; 

            db.query(insertTurmaSql, [ 
                nome, sala, parseInt(capacidade), dia_da_semana, hora_inicio, hora_termino, 
                descricao || null, nivel, data_inicio || null, data_termino || null 
            ], function(err, turmaResult) { 
                if (err) { 
                    return db.rollback(function() { 
                        console.error("ERRO [createTurma-BE]: Erro ao inserir turma:", err); 
                        return res.status(500).json({ error: "Erro no banco de dados ao criar turma.", message: err.message }); 
                    }); 
                } 
                const turmaId = turmaResult.insertId; 

                if (professor_id) { 
                    db.query("SELECT id FROM Professor WHERE id = ?", [professor_id], function(err, professorData) { 
                        if (err) { 
                            return db.rollback(function() { 
                                console.error("ERRO [createTurma-BE]: Erro ao verificar professor:", err); 
                                return res.status(500).json({ error: "Erro ao verificar professor.", message: err.message }); 
                            }); 
                        } 
                        if (professorData.length === 0) { 
                            return db.rollback(function() { 
                                return res.status(404).json({ error: "Professor não encontrado com o ID fornecido." }); 
                            }); 
                        } 

                        const insertProfessorTurmaSql = "INSERT INTO Professor_Turma (professor_id, turma_id) VALUES (?, ?)"; 
                        db.query(insertProfessorTurmaSql, [professor_id, turmaId], function(err, profTurmaResult) { 
                            if (err) { 
                                return db.rollback(function() { 
                                    console.error("ERRO [createTurma-BE]: Erro ao associar professor à turma:", err); 
                                    if (err.code === 'ER_DUP_ENTRY') { 
                                        return res.status(409).json({ error: "Professor já associado a esta turma." }); 
                                    } 
                                    return res.status(500).json({ error: "Erro no banco de dados ao associar professor.", message: err.message }); 
                                }); 
                            } 
                            db.commit(function(err) { 
                                if (err) { 
                                    return db.rollback(function() { 
                                        console.error("ERRO [createTurma-BE]: Erro ao commitar transação (associação):", err); 
                                        return res.status(500).json({ error: "Erro ao finalizar criação da turma e associação.", message: err.message }); 
                                    }); 
                                } 
                                res.status(201).json({ message: "Turma criada e professor associado com sucesso!", turmaId: turmaId }); 
                            }); 
                        }); 
                    }); 
                } else { 
                    db.commit(function(err) { 
                        if (err) { 
                            return db.rollback(function() { 
                                console.error("ERRO [createTurma-BE]: Erro ao commitar transação (sem associação):", err); 
                                return res.status(500).json({ error: "Erro ao finalizar criação da turma.", message: err.message }); 
                            }); 
                        } 
                        res.status(201).json({ message: "Turma criada com sucesso!", turmaId: turmaId }); 
                    }); 
                } 
            }); 
        }); 
    }); 
};
