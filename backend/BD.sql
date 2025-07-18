CREATE DATABASE IF NOT EXISTS exp_criativa;
USE exp_criativa;

-- Tabela de Endereco
CREATE TABLE Endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cep CHAR(8) NOT NULL,
    estado VARCHAR(50),
    cidade VARCHAR(100),
    bairro VARCHAR(50),
    logradouro VARCHAR(100) NOT NULL,
    numero_residencia INT NOT NULL
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
    grau_parentesco ENUM('Mãe/Pai', 'Avó/Avô', 'Outros'),
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
    nome VARCHAR(100) NOT NULL,
    sexo ENUM('M', 'F', 'Outro'),
    data_nascimento DATE NOT NULL,
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

CREATE TABLE Professor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cpf CHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    sexo ENUM('M', 'F', 'Outro'),
    data_nascimento DATE NOT NULL,
    telefone VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255),
    data_contratacao DATE,
    salario DECIMAL(10,2), 
    ativo BOOLEAN DEFAULT 1,
    endereco_id INT,
    FOREIGN KEY (endereco_id) REFERENCES Endereco(id) ON DELETE SET NULL
);
CREATE TABLE Turma (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50),
    sala ENUM('Sala Arco-Íris', 'Sala Girassol', 'Sala Estrelinha', 'Sala Sementinha', 'Sala Piquenique', 'Sala dos Sonhos', 'Sala Inventar', 'Sala do Amanhã', 'Sala Exploradores', 'Sala Conectar') NOT NULL,
    capacidade INT CHECK (capacidade > 0),
    dia_da_semana ENUM('Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado') NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_termino TIME NOT NULL,
    descricao TEXT,
    nivel ENUM('6 a 8 anos', '9 a 10 anos', '11 a 12 anos', '13 a 14 anos', '15 a 16 anos') NOT NULL,
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
    notificacoes BOOLEAN DEFAULT 1
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
    categoria VARCHAR(100) NOT NULL,
    prioridade ENUM('Max', 'Média', 'Min') DEFAULT 'media',
    status ENUM('Aberta', 'Encerrada', 'Concluída') DEFAULT 'Aberta',
    imagem LONGBLOB
);

CREATE TABLE Apoiador_Doacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    apoiador_id INT,
    doacao_id INT,
    valor_doado DECIMAL(10,2) NOT NULL DEFAULT 0,
    data_doacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    forma_pagamento ENUM('Credito', 'Debito', 'Pix', 'Boleto'),
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
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL
);


-- INSERTS:
INSERT INTO Plano (nome, preco, descricao) VALUES
('Plano Semente', 20.00, 'Com o Plano Semente, você planta esperança no futuro de muitas crianças! Sua doação ajuda a fornecer materiais essenciais para as aulas e garante a continuidade do nosso projeto.');
INSERT INTO Plano (nome, preco, descricao) VALUES
('Plano Melodia', 50.00, 'O Plano Melodia fortalece o ensino da música, garantindo que mais crianças tenham acesso a instrumentos e aulas, trazendo experiências que transformam vidas e abrem novas possibilidades no futuro!');
INSERT INTO Plano (nome, preco, descricao) VALUES
('Plano Palco', 100.00, 'O Plano Palco apoia o desenvolvimento artístico das crianças, ajudando a criar momentos inesquecíveis e dando mais oportunidades para que elas brilhem no palco e na vida!');
INSERT INTO Plano (nome, preco, descricao) VALUES
('Plano Estrela', 200.00, 'O Plano Estrela apoia o desenvolvimento artístico das crianças, ajudando a criar momentos inesquecíveis e dando mais oportunidades para que elas brilhem no palco e na vida!');

INSERT INTO Administrador (email, senha) VALUES
('admin@adm.com', '$2b$10$2J7ji5H1m6utNpXkuUbGkODEE5o3n/B83V2p7ww4BiAm3brrfYxOu');



INSERT INTO Doacao (nome, valor_meta, arrecadado, descricao, data_inicio, data_fim, prioridade, status, imagem_path) VALUES
('Violão para Aulas', 500.00, 275.00, 'Ajude a comprar um violão para que mais crianças aprendam a tocar e se apaixonem pela música!', '2025-01-15', '2025-07-15', 'Max', 'Aberta', NULL),
('Figurinos para Espetáculos', 1000.00, 800.00, 'Contribua para a compra de roupas e acessórios que deixam os espetáculos ainda mais mágicos!', '2025-02-01', '2025-08-01', 'Max', 'Aberta', NULL),
('Materiais Artísticos', 300.00, 285.00, 'Com sua doação, podemos garantir que as crianças soltem a criatividade com materiais de qualidade!', '2025-03-10', '2025-09-10', 'Max', 'Aberta', NULL),
('Microfones para Aulas de Canto', 700.00, 385.00, 'Ajude a garantir que as crianças tenham equipamentos para se expressar nas aulas de canto e teatro.', '2025-04-05', '2025-10-05', 'Max', 'Aberta', NULL),
('Reforma da Sala de Música', 2000.00, 50.00, 'Financiamento para a reforma e modernização da nossa sala de música.', '2025-06-01', '2025-12-01', 'Max', 'Aberta', NULL),
('Novas Cadeiras', 1500.00, 0.00, 'Ajude a equipar nosso auditório com cadeiras confortáveis para o público e alunos.', '2025-06-01', '2025-12-01', 'Média', 'Aberta', NULL);

