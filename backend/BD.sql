CREATE DATABASE IF NOT EXISTS exp_criativa;
USE exp_criativa;

-- Tabela de Endereco
CREATE TABLE Endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    logradouro VARCHAR(100) NOT NULL,
    numero_residencia INT NOT NULL,
    cep CHAR(8) NOT NULL,
    cidade VARCHAR(100),
    estado VARCHAR(50),
    pais VARCHAR(50)
);

-- Tabela de responsáveis pelos alunos
CREATE TABLE Responsavel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cpf CHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    sexo ENUM('M', 'F', 'Outro'),
    data_nascimento DATE NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    grau_parentesco VARCHAR(50),
    profissao VARCHAR(100),
    renda_familiar DECIMAL(10,2),
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT 1,
    endereco_id INT,
    FOREIGN KEY (endereco_id) REFERENCES Endereco(id) ON DELETE SET NULL
);

-- Tabela de alunos
CREATE TABLE Aluno (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cpf CHAR(11) UNIQUE NOT NULL,
    rg VARCHAR(20),
    nome VARCHAR(100) NOT NULL,
    sexo ENUM('M', 'F', 'Outro'),
    data_nascimento DATE NOT NULL,
    nacionalidade VARCHAR(50),
    telefone VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255) NOT NULL,
    necessidades_especiais TEXT,
    foto LONGBLOB,
    data_matricula DATETIME DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT 1,
    responsavel_id INT,
    endereco_id INT,
    FOREIGN KEY (responsavel_id) REFERENCES Responsavel(id) ON DELETE SET NULL,
    FOREIGN KEY (endereco_id) REFERENCES Endereco(id) ON DELETE SET NULL
);

-- Tabela de professores
CREATE TABLE Professor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cpf CHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    sexo ENUM('M', 'F', 'Outro'),
    data_nascimento DATE NOT NULL,
    telefone VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    nacionalidade VARCHAR(50),
    graduacao VARCHAR(100),
    curriculo TEXT,
    data_contratacao DATE,
    tipo_contrato VARCHAR(50),
    salario DECIMAL(10,2),
    foto LONGBLOB,
    ativo BOOLEAN DEFAULT 1,
    endereco_id INT,
    FOREIGN KEY (endereco_id) REFERENCES Endereco(id) ON DELETE SET NULL
);

-- Tabela de turmas
CREATE TABLE Turma (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50),
    capacidade INT CHECK (capacidade > 0),
    hora_inicio TIME NOT NULL,
    hora_termino TIME NOT NULL,
    descricao TEXT,
    nivel VARCHAR(50),
    data_inicio DATE,
    data_termino DATE
);

CREATE TABLE Professor_Turma (
    professor_id INT,
    turma_id INT,
    PRIMARY KEY (turma_id, professor_id),
    FOREIGN KEY (professor_id) REFERENCES Professor(id) ON DELETE CASCADE,
    FOREIGN KEY (turma_id) REFERENCES Turma(id) ON DELETE CASCADE
);

CREATE TABLE Aluno_Turma (
    aluno_id INT,
    turma_id INT,
    PRIMARY KEY (turma_id, aluno_id),
    FOREIGN KEY (aluno_id) REFERENCES Aluno(id) ON DELETE CASCADE,
    FOREIGN KEY (turma_id) REFERENCES Turma(id) ON DELETE CASCADE
);

-- Tabela de controle de presença
CREATE TABLE Controle_Presenca (
    id INT AUTO_INCREMENT PRIMARY KEY,
    turma_id INT,
    data_presenca DATE,
    professor_id INT,
    aluno_id INT,
    presenca BOOLEAN NOT NULL,
    FOREIGN KEY (turma_id) REFERENCES Turma(id) ON DELETE CASCADE,
    FOREIGN KEY (professor_id) REFERENCES Professor(id) ON DELETE SET NULL,
    FOREIGN KEY (aluno_id) REFERENCES Aluno(id) ON DELETE CASCADE
);

-- Tabela de planos de apoio
CREATE TABLE Plano (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50),
    preco DECIMAL(10,2) NOT NULL,
    descricao TEXT
);

-- Tabela de apoiadores
CREATE TABLE Apoiador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cpf CHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    telefone VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_adesao DATE,
    foto LONGBLOB,
    notificacoes BOOLEAN DEFAULT 1,
    foto_path VARCHAR(255) NULL
);

CREATE TABLE Apoiador_Plano (
    id INT AUTO_INCREMENT PRIMARY KEY,
    apoiadorId INT UNIQUE,
    planoId INT,
    dataAdesao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (apoiadorId) REFERENCES Apoiador(id) ON DELETE CASCADE,
    FOREIGN KEY (planoId) REFERENCES Plano(id) ON DELETE CASCADE
);

-- Tabela de doações
CREATE TABLE Doacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    valor_meta DECIMAL(10,2) NOT NULL CHECK (valor_meta >= 0),
    arrecadado DECIMAL(10,2) DEFAULT 0 CHECK (arrecadado >= 0),
    descricao TEXT,
    data_inicio DATE,
    data_fim DATE,
    status ENUM('Aberta', 'Encerrada', 'Concluída') DEFAULT 'Aberta',
    imagem VARCHAR(255)
);

CREATE TABLE Apoiador_Doacao (
    apoiador_id INT,
    doacao_id INT,
    valor_doado DECIMAL(10,2) NOT NULL DEFAULT 0,
    PRIMARY KEY (apoiador_id, doacao_id),
    FOREIGN KEY (apoiador_id) REFERENCES Apoiador(id) ON DELETE CASCADE,
    FOREIGN KEY (doacao_id) REFERENCES Doacao(id) ON DELETE CASCADE
);

-- Tabela de contatos gerais
CREATE TABLE Contato (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(15),
    assunto VARCHAR(100),
    mensagem TEXT
);

-- Tabela de administradores
CREATE TABLE Administrador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL
);

-- Index
CREATE INDEX idx_ap_planoId ON Apoiador_Plano(planoId);

CREATE INDEX idx_cp_turma_id ON Controle_Presenca(turma_id);
CREATE INDEX idx_cp_aluno_id ON Controle_Presenca(aluno_id);

CREATE INDEX idx_ad_apoiador_id ON Apoiador_Doacao(apoiador_id);
CREATE INDEX idx_ad_doacao_id ON Apoiador_Doacao(doacao_id);

CREATE INDEX idx_doacao_status ON Doacao(status);

-- Mostra a qtd de planos ativos e o valor total arrecadado com esses planos
DELIMITER //

CREATE PROCEDURE ObterResumoPlanos()
BEGIN
    SELECT 
        COUNT(*) AS quantidade_planos_ativos,
        SUM(p.preco) AS total_arrecadado
    FROM 
        Apoiador_Plano ap
    JOIN 
        Plano p ON ap.planoId = p.id;
END //

DELIMITER ;

CALL ObterResumoPlanos();


--Mostrar a frequência de cada aluno em determinada turma.
DELIMITER $$

CREATE PROCEDURE RelatorioFrequenciaPorTurma(IN turma_id INT)
BEGIN
    SELECT 
        a.nome AS aluno,
        t.nome AS turma,
        COUNT(cp.id) AS total_aulas,
        SUM(cp.presenca) AS presencas,
        ROUND(SUM(cp.presenca) / COUNT(cp.id) * 100, 2) AS percentual_presenca
    FROM Controle_Presenca cp
    INNER JOIN Aluno a ON cp.aluno_id = a.id
    INNER JOIN Turma t ON cp.turma_id = t.id
    WHERE cp.turma_id = turma_id
    GROUP BY a.id, t.id;
END$$

DELIMITER ;
CALL RelatorioFrequenciaPorTurma(1);

-- Mostrar quanto cada apoiador doou no total e para quais campanhas.
DELIMITER $$

CREATE PROCEDURE RelatorioDoacoesPorApoiador()
BEGIN
    SELECT 
        ad.apoiador_id,
        ap.nome AS nome_apoiador,
        GROUP_CONCAT(d.nome SEPARATOR ', ') AS campanhas,
        COUNT(ad.doacao_id) AS qtd_doacoes,
        SUM(ad.valor_doado) AS total_doado
    FROM Apoiador_Doacao ad
    INNER JOIN Apoiador ap ON ap.id = ad.apoiador_id
    INNER JOIN Doacao d ON d.id = ad.doacao_id
    GROUP BY ad.apoiador_id;
END$$

DELIMITER ;


--Resumo de Doações por Status com Total da Meta
DELIMITER $$

CREATE PROCEDURE RelatorioResumoDoacoesComMeta(
    IN statusFiltro VARCHAR(20)
)
BEGIN
    SET @sql = '
        SELECT 
            d.status,
            COUNT(d.id) AS total_campanhas,
            SUM(d.arrecadado) AS total_arrecadado,
            SUM(d.valor_meta) AS total_meta
        FROM Doacao d
        WHERE 1 = 1
    ';

    IF statusFiltro IS NOT NULL AND statusFiltro != '' THEN
        SET @sql = CONCAT(@sql, ' AND d.status = ?');
    END IF;

    SET @sql = CONCAT(@sql, ' GROUP BY d.status');

    PREPARE stmt FROM @sql;

    IF statusFiltro IS NOT NULL AND statusFiltro != '' THEN
        SET @param = statusFiltro;
        EXECUTE stmt USING @param;
    ELSE
        EXECUTE stmt;
    END IF;

    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;

CALL RelatorioResumoDoacoesComMeta('Encerrada');

