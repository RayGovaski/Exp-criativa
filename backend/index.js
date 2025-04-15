import express from "express";
import mysql from "mysql";
import cors from "cors";
import { alunoSchema } from "./validations/aluno.js";
import { validate } from "./middlewares/validate.js";
import { professorSchema } from "./validations/professor.js";
import { responsavelSchema } from "./validations/responsavel.js";
import { voluntarioSchema } from "./validations/voluntario.js";

const app = express();
app.use(cors());
app.use(express.json());    

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "cores_do_amanha",
});

app.get("/", (req, res) => {
    res.json("Hello");
})

app.listen(8000, () => { 
    console.log("Server is running on port 8000");
});

app.get("/alunos", (req, res) => { 
    const sql = "SELECT * FROM Alunos";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})  

app.post("/alunos", (req, res) => { 
    const sql = "INSERT INTO Alunos (`nome`, `cpf`, `rg`,`sexo`,`data_nascimento`,`nacionalidade`, `responsavel_id`, `telefone`, `email`, `senha`,`necessidades_especiais`) VALUES (?)";
    const values = [
        req.body.nome,
        req.body.cpf,
        req.body.rg,
        req.body.sexo,
        req.body.data_nascimento,
        req.body.nacionalidade,
        req.body.telefone,
        req.body.email,
        req.body.senha,
        req.body.necessidades_especiais,
        req.body.responsavel_id
    ];
    db.query(sql, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.put("/alunos/:id", validate(alunoSchema), (req, res) => {
    const sql = `UPDATE Aluno SET 
        nome = ?, cpf = ?, rg = ?, sexo = ?, data_nascimento = ?, nacionalidade = ?, telefone = ?, 
        email = ?, senha = ?, necessidades_especiais = ?, responsavel_id = ?
        WHERE id = ?`;

    const values = [
        req.body.nome,
        req.body.cpf,
        req.body.rg,
        req.body.sexo,
        req.body.data_nascimento,
        req.body.nacionalidade,
        req.body.telefone,
        req.body.email,
        req.body.senha,
        req.body.necessidades_especiais,
        req.body.responsavel_id
    ];

    db.query(sql, [...values, req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

app.delete("/alunos/:id", (req, res) => {
    const sql = "DELETE FROM Alunos WHERE `id` = ?"; 
    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});


app.get("/apoiador", (req, res) => { 
    const sql = "SELECT * FROM Apoiador";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})  

app.post("/apoiador", (req, res) => { 
    const sql = "INSERT INTO Apoiador (`nome`, `cpf`, `email`, `senha`, `data_nascimento`, `telefone` VALUES (?)";
    const values = [
        req.body.nome,
        req.body.cpf,
        req.body.email,
        req.body.senha,
        req.body.data_nascimento,
        req.body.telefone,
        req.body.plano_nome,
        req.body.notificacoes ?? true
    ];
    db.query(sql, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.delete("/apoiador/:id", (req, res) => {
    const sql = "DELETE FROM Apoiador WHERE `id` = ?"; 
    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

app.get("/responsaveis", (req, res) => {
    const sql = "SELECT * FROM Responsavel";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

app.post("/responsaveis", validate(responsavelSchema), (req, res) => {
    const sql = `INSERT INTO Responsavel 
        (nome, cpf, sexo, data_nascimento, telefone, email, logradouro, numero_residencia, cep, grau_parentesco, profissao, renda_familiar)
        VALUES (?)`;

    const values = [
        req.body.nome,
        req.body.cpf,
        req.body.sexo,
        req.body.data_nascimento,
        req.body.telefone,
        req.body.email,
        req.body.logradouro,
        req.body.numero_residencia,
        req.body.cep,
        req.body.grau_parentesco,
        req.body.profissao,
        req.body.renda_familiar
    ];

    db.query(sql, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(201).json(data);
    });
});

app.put("/responsaveis/:id", validate(responsavelSchema), (req, res) => {
    const sql = `UPDATE Responsavel SET 
        nome = ?, cpf = ?, sexo = ?, data_nascimento = ?, telefone = ?, email = ?, 
        logradouro = ?, numero_residencia = ?, cep = ?, grau_parentesco = ?, profissao = ?, renda_familiar = ?
        WHERE id = ?`;

    const values = [
        req.body.nome,
        req.body.cpf,
        req.body.sexo,
        req.body.data_nascimento,
        req.body.telefone,
        req.body.email,
        req.body.logradouro,
        req.body.numero_residencia,
        req.body.cep,
        req.body.grau_parentesco,
        req.body.profissao,
        req.body.renda_familiar
    ];

    db.query(sql, [...values, req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

app.delete("/responsaveis/:id", (req, res) => {
    const sql = "DELETE FROM Responsavel WHERE id = ?";
    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json({ msg: "Responsável removido com sucesso" });
    });
});

app.get("/professores", (req, res) => {
    const sql = "SELECT * FROM Professor";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

app.post("/professores", validate(professorSchema), (req, res) => {
    const sql = `INSERT INTO Professor 
        (nome, cpf, sexo, data_nascimento, logradouro, numero_residencia, cep, telefone, email, nacionalidade, graduacao, curriculo, data_contratacao, tipo_contrato, salario)
        VALUES (?)`;

    const values = [
        req.body.nome,
        req.body.cpf,
        req.body.sexo,
        req.body.data_nascimento,
        req.body.logradouro,
        req.body.numero_residencia,
        req.body.cep,
        req.body.telefone,
        req.body.email,
        req.body.nacionalidade,
        req.body.graduacao,
        req.body.curriculo,
        req.body.data_contratacao,
        req.body.tipo_contrato,
        req.body.salario
    ];

    db.query(sql, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(201).json(data);
    });
});

app.put("/professores/:id", validate(professorSchema), (req, res) => {
    const sql = `UPDATE Professor SET 
        nome = ?, cpf = ?, sexo = ?, data_nascimento = ?, logradouro = ?, numero_residencia = ?, cep = ?, 
        telefone = ?, email = ?, nacionalidade = ?, graduacao = ?, curriculo = ?, data_contratacao = ?, tipo_contrato = ?, salario = ?
        WHERE id = ?`;

    const values = [
        req.body.nome,
        req.body.cpf,
        req.body.sexo,
        req.body.data_nascimento,
        req.body.logradouro,
        req.body.numero_residencia,
        req.body.cep,
        req.body.telefone,
        req.body.email,
        req.body.nacionalidade,
        req.body.graduacao,
        req.body.curriculo,
        req.body.data_contratacao,
        req.body.tipo_contrato,
        req.body.salario
    ];

    db.query(sql, [...values, req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

app.delete("/professores/:id", (req, res) => {
    const sql = "DELETE FROM Professor WHERE id = ?";
    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json({ msg: "Professor removido com sucesso" });
    });
});

app.get("/voluntarios", (req, res) => {
    const sql = "SELECT * FROM Voluntario";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

app.post("/voluntarios", validate(voluntarioSchema), (req, res) => {
    const sql = `INSERT INTO Voluntario 
        (nome, cpf, data_nascimento, logradouro, numero_residencia, cep, telefone, email, nacionalidade, funcao_nome, data_entrada, disponibilidade, habilidades)
        VALUES (?)`;

    const values = [
        req.body.nome,
        req.body.cpf,
        req.body.data_nascimento,
        req.body.logradouro,
        req.body.numero_residencia,
        req.body.cep,
        req.body.telefone,
        req.body.email,
        req.body.nacionalidade,
        req.body.funcao_nome,
        req.body.data_entrada,
        req.body.disponibilidade,
        req.body.habilidades
    ];

    db.query(sql, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(201).json(data);
    });
});

app.put("/voluntarios/:id", validate(voluntarioSchema), (req, res) => {
    const sql = `UPDATE voluntario SET 
        nome = ?, cpf = ?, data_nascimento = ?, logradouro = ?, numero_residencia = ?, cep = ?, 
        telefone = ?, email = ?, nacionalidade = ?, funcao_nome = ?, data_entrada = ?, disponibilidade = ?, habilidades = ?
        WHERE id = ?`;

    const values = [
        req.body.nome,
        req.body.cpf,
        req.body.data_nascimento,
        req.body.logradouro,
        req.body.numero_residencia,
        req.body.cep,
        req.body.telefone,
        req.body.email,
        req.body.nacionalidade,
        req.body.funcao_nome,
        req.body.data_entrada,
        req.body.disponibilidade,
        req.body.habilidades
    ];

    db.query(sql, [...values, req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
    });
});

app.delete("/voluntarios/:id", (req, res) => {
    const sql = "DELETE FROM Voluntario WHERE id = ?";
    db.query(sql, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json({ msg: "Voluntário removido com sucesso" });
    });
});

app.listen(8000, () => {
    console.log("🚀 Servidor rodando na porta 8000");
});