-- Tabela de responsáveis pelos alunos
CREATE TABLE Responsavel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cpf CHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    logradouro VARCHAR(100) NOT NULL,
    numero_residencia INTEGER NOT NULL,
    cep CHAR(8) NOT NULL
);

-- Tabela de alunos
CREATE TABLE Aluno (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cpf CHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    telefone VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255) NOT NULL,
    responsavel_id INTEGER,
    FOREIGN KEY (responsavel_id) REFERENCES Responsavel(id)
);

-- Tabela de professores
CREATE TABLE Professor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cpf CHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    logradouro VARCHAR(100),
    numero_residencia INTEGER,
    cep CHAR(8),
    telefone VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    nacionalidade VARCHAR(50),
    graduacao VARCHAR(100),
    curriculo TEXT
);

-- Tabela de turmas
CREATE TABLE Turma (
    nome VARCHAR(50) PRIMARY KEY,
    capacidade INTEGER CHECK (capacidade > 0),
    hora_inicio TIME NOT NULL,
    hora_termino TIME NOT NULL
);

-- Relação N:N entre professores e turmas
CREATE TABLE Professor_Turma (
    professor_id INTEGER,
    turma_nome VARCHAR(50),
    PRIMARY KEY (turma_nome, professor_id),
    FOREIGN KEY (professor_id) REFERENCES Professor(id),
    FOREIGN KEY (turma_nome) REFERENCES Turma(nome)
);

-- Relação N:N entre alunos e turmas
CREATE TABLE Aluno_Turma (
    aluno_id INTEGER,
    turma_nome VARCHAR(50),
    PRIMARY KEY (turma_nome, aluno_id),
    FOREIGN KEY (aluno_id) REFERENCES Aluno(id),
    FOREIGN KEY (turma_nome) REFERENCES Turma(nome)
);

-- Tabela de controle de presença
CREATE TABLE Controle_Presenca (
    turma_nome VARCHAR(50),
    data DATE,
    professor_id INTEGER,
    aluno_id INTEGER,
    presenca BOOLEAN NOT NULL,
    PRIMARY KEY (turma_nome, data, aluno_id),
    FOREIGN KEY (turma_nome) REFERENCES Turma(nome),
    FOREIGN KEY (professor_id) REFERENCES Professor(id),
    FOREIGN KEY (aluno_id) REFERENCES Aluno(id)
);

-- Tabela de planos de apoio
CREATE TABLE Plano (
    nome VARCHAR(50) PRIMARY KEY,
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
    plano_nome VARCHAR(50),
    FOREIGN KEY (plano_nome) REFERENCES Plano(nome)
);

-- Tabela de doações
CREATE TABLE Doacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    valor_meta DECIMAL(10,2) NOT NULL CHECK (valor_meta >= 0),
    arrecadado DECIMAL(10,2) DEFAULT 0 CHECK (arrecadado >= 0),
    descricao TEXT
);

-- Relação N:N entre apoiadores e doações
CREATE TABLE Apoiador_Doacao (
    apoiador_id INTEGER,
    doacao_id INTEGER,
    PRIMARY KEY (apoiador_id, doacao_id),
    FOREIGN KEY (apoiador_id) REFERENCES Apoiador(id),
    FOREIGN KEY (doacao_id) REFERENCES Doacao(id)
);

-- Tabela de funções de voluntários
CREATE TABLE Funcao (
    nome VARCHAR(50) PRIMARY KEY,
    descricao TEXT
);

-- Tabela de voluntários
CREATE TABLE Voluntario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cpf CHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    logradouro VARCHAR(100),
    numero_residencia INTEGER,
    cep CHAR(8),
    telefone VARCHAR(15),
    email VARCHAR(100) UNIQUE,
    nacionalidade VARCHAR(50),
    funcao_nome VARCHAR(50),
    FOREIGN KEY (funcao_nome) REFERENCES Funcao(nome)
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
