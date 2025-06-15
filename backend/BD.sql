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
    grau_parentesco ENUM('Mãe/Pai', 'Avó/Avô', 'Outros'),
    profissao VARCHAR(100),
    renda_familiar DECIMAL(10,2),
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT 1,
    endereco_id INT,
    comprovante_residencia_path VARCHAR(255) NULL,
    comprovante_renda_pat VARCHAR(255) NULL,
    FOREIGN KEY (endereco_id) REFERENCES Endereco(id) ON DELETE SET NULL
);

-- Tabela de alunos
CREATE TABLE Aluno (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cpf CHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    sexo ENUM('M', 'F', 'Outro'),
    data_nascimento DATE NOT NULL,
    nacionalidade VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255) NOT NULL,
    necessidades_especiais TEXT,
    foto LONGBLOB,
    foto_path VARCHAR(255) NULL,
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
    senha VARCHAR(255),
    nacionalidade VARCHAR(50),
    graduacao VARCHAR(100),
    curriculo TEXT,
    data_contratacao DATE,
    tipo_contrato VARCHAR(50),
    salario DECIMAL(10,2),
    foto LONGBLOB,
    foto_path VARCHAR(255),
    ativo BOOLEAN DEFAULT 1,
    endereco_id INT,
    FOREIGN KEY (endereco_id) REFERENCES Endereco(id) ON DELETE SET NULL
);

-- Tabela de turmas/materia
CREATE TABLE Turma (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50),
    sala VARCHAR(50) UNIQUE,
    capacidade INT CHECK (capacidade > 0),
    dia_da_semana ENUM('Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado') NOT NULL,
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
    categoria VARCHAR(100) NOT NULL,
    prioridade ENUM('Max', 'Média', 'Min') DEFAULT 'media',
    status ENUM('Aberta', 'Encerrada', 'Concluída') DEFAULT 'Aberta',
    imagem_path VARCHAR(255) NULL
);

CREATE TABLE Apoiador_Doacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    apoiador_id INT,
    doacao_id INT,
    valor_doado DECIMAL(10,2) NOT NULL DEFAULT 0,
    data_doacao DATETIME DEFAULT CURRENT_TIMESTAMP,
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




INSERT INTO Doacao (nome, valor_meta, arrecadado, descricao, data_inicio, data_fim, prioridade, status, imagem_path) VALUES
('Violão para Aulas', 500.00, 275.00, 'Ajude a comprar um violão para que mais crianças aprendam a tocar e se apaixonem pela música!', '2025-01-15', '2025-07-15', 'Max', 'Aberta', NULL),
('Figurinos para Espetáculos', 1000.00, 800.00, 'Contribua para a compra de roupas e acessórios que deixam os espetáculos ainda mais mágicos!', '2025-02-01', '2025-08-01', 'Max', 'Aberta', NULL),
('Materiais Artísticos', 300.00, 285.00, 'Com sua doação, podemos garantir que as crianças soltem a criatividade com materiais de qualidade!', '2025-03-10', '2025-09-10', 'Max', 'Aberta', NULL),
('Microfones para Aulas de Canto', 700.00, 385.00, 'Ajude a garantir que as crianças tenham equipamentos para se expressar nas aulas de canto e teatro.', '2025-04-05', '2025-10-05', 'Max', 'Aberta', NULL),
('Reforma da Sala de Música', 2000.00, 50.00, 'Financiamento para a reforma e modernização da nossa sala de música.', '2025-06-01', '2025-12-01', 'Max', 'Aberta', NULL),
('Novas Cadeiras', 1500.00, 0.00, 'Ajude a equipar nosso auditório com cadeiras confortáveis para o público e alunos.', '2025-06-01', '2025-12-01', 'Média', 'Aberta', NULL);

INSERT INTO Turma (nome, sala, capacidade, dia_da_semana, hora_inicio, hora_termino, descricao, nivel, data_inicio, data_termino) VALUES
('Matemática Aplicada', 'Sala 101', 25, 'Segunda-feira', '08:00:00', '09:00:00', 'Aulas de matemática focadas na aplicação prática.', 'Fundamental II', '2025-02-01', '2025-12-15'),
('Português: Escrita Criativa', 'Sala 102', 20, 'Terça-feira', '09:00:00', '10:00:00', 'Desenvolvimento de habilidades de escrita e criatividade.', 'Fundamental II', '2025-02-01', '2025-12-15'),
('História do Brasil', 'Sala 103', 30, 'Quarta-feira', '10:00:00', '11:00:00', 'Estudo aprofundado da história e cultura brasileira.', 'Fundamental II', '2025-02-01', '2025-12-15'),
('Ciências: O Corpo Humano', 'Sala 104', 25, 'Quinta-feira', '11:00:00', '12:00:00', 'Exploração dos sistemas e funcionamento do corpo humano.', 'Fundamental II', '2025-02-01', '2025-12-15'),
('Música: Introdução a Instrumentos', 'Sala 201', 15, 'Sexta-feira', '14:00:00', '15:30:00', 'Aulas práticas de introdução a diversos instrumentos musicais.', 'Iniciante', '2025-03-01', '2025-11-30');





INSERT INTO Professor (cpf, nome, sexo, data_nascimento, telefone, email, nacionalidade, graduacao, curriculo, data_contratacao, tipo_contrato, salario, foto, ativo, endereco_id) VALUES
('55566677788', 'Prof. Ana Mendes', 'F', '1985-04-20', '(21)99999-8888', 'ana@professor.com', 'Brasileira', 'Licenciatura em Matemática', 'Formação completa em exatas.', '2020-08-01', 'CLT', 4500.00, NULL, 1, NULL), -- HASH de 'prof123'
('66677788899', 'Prof. João Oliveira', 'M', '1980-11-11', '(11)98765-4321', 'joao@professor.com', 'Brasileiro', 'Doutorado em Letras', 'Especialista em literatura.', '2018-03-15', 'PJ', 5500.00, NULL, 1, NULL), -- HASH de 'prof123'
('77788899900', 'Prof. Lúcia Reis', 'F', '1990-01-01', '(31)91234-5678', 'lucia@professor.com', 'Brasileira', 'Mestrado em Ciências Biológicas', 'Pesquisadora ativa.', '2022-01-10', 'CLT', 4800.00, NULL, 1, NULL); -- HASH de 'prof456'


INSERT INTO Professor_Turma (professor_id, turma_id) VALUES
(1, 1), -- Prof. Ana Mendes -> Matemática Aplicada
(2, 2), -- Prof. João Oliveira -> Português
(3, 4), -- Prof. Lúcia Reis -> Ciências
(1, 3); -- Prof. Ana Mendes -> História do Brasil (um professor pode dar mais de uma aula)


INSERT INTO Aluno_Turma (aluno_id, turma_id) VALUES
(1, 1), -- Ana Silva -> Matemática
(1, 2), -- Ana Silva -> Português
(2, 1), -- Bruno Costa -> Matemática
(2, 4), -- Bruno Costa -> Ciências
(3, 2), -- Carla Dias -> Português
(4, 3); -- Daniel Souza -> História




-- --- Dados para Junho de 2024 ---
INSERT INTO Controle_Presenca (turma_id, data_presenca, professor_id, aluno_id, presenca) VALUES
(1, '2024-06-03', 1, 1, TRUE),  -- Ana Silva na Turma 1 (Matemática), Presente
(2, '2024-06-04', 2, 1, FALSE), -- Ana Silva na Turma 2 (Português), Ausente
(1, '2024-06-05', 1, 1, TRUE),  -- Ana Silva na Turma 1 (Matemática), Presente
(2, '2024-06-06', 2, 1, TRUE);  -- Ana Silva na Turma 2 (Português), Presente


-- --- Dados para Junho de 2025  ---
INSERT INTO Controle_Presenca (turma_id, data_presenca, professor_id, aluno_id, presenca) VALUES
(1, '2025-06-03', 1, 1, TRUE),  -- Ana Silva na Turma 1 (Matemática), Presente
(2, '2025-06-04', 2, 1, TRUE),  -- Ana Silva na Turma 2 (Português), Presente
(1, '2025-06-05', 1, 1, TRUE),  -- Ana Silva na Turma 1 (Matemática), Presente
(2, '2025-06-06', 2, 1, FALSE), -- Ana Silva na Turma 2 (Português), Ausente
(3, '2025-06-06', 1, 1, TRUE);  -- Ana Silva na Turma 3 (História), Presente


-- --- Dados para Julho de 2024 ---
INSERT INTO Controle_Presenca (turma_id, data_presenca, professor_id, aluno_id, presenca) VALUES
(1, '2024-07-01', 1, 1, TRUE),  -- Ana Silva na Turma 1 (Matemática)
(2, '2024-07-02', 2, 1, TRUE),  -- Ana Silva na Turma 2 (Português)