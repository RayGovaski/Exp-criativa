import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());    

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "A992176566kemi_",
    database: "cores_do_amanha",
});

app.get("/", (req, res) => {
    res.json("Hello");
})

app.listen(8000, () => { 
    console.log("Server is running on port 8000");
});

app.get("/alunos", (req, res) => { // get para o backend
    const sql = "SELECT * FROM alunos";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})  
