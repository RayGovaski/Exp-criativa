// backend/routes/alunoRoutes.js

import express from 'express';
import {
    createAluno,
    getAlunos,
    getProfileAluno,
    getAlunoPresenceReports,
    getAvailableTurmas,
    inscreverAlunoTurma,
    desinscreverAlunoTurma,
    getAlunoTurmas,
    getAlunoFoto // Não se esqueça de importar a função de buscar foto, se ainda não o fez
} from '../controllers/alunoController.js';

// ✅ CORREÇÃO 1: Importa 'uploadToMemory' em vez de 'uploadImage'
import { uploadToMemory } from '../config/multer.js';

import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Middleware de upload específico para o registro de aluno
// Usa o .fields() porque o seu controller espera req.files['aluno_foto']
const alunoUpload = uploadToMemory.fields([
    { name: 'aluno_foto', maxCount: 1 }
]);

// --- Rotas de Aluno ---

// Rota para CRIAR um novo aluno (Registro)
// ✅ CORREÇÃO 2: Usa a variável correta 'alunoUpload'
router.post('/register', alunoUpload, createAluno);

// Rota para LISTAR todos os alunos
router.get('/', getAlunos);

// Rota para obter o PERFIL COMPLETO do aluno logado (PROTEGIDA)
router.get('/perfil', verifyToken, getProfileAluno);

// Rota para obter a FOTO do aluno
router.get('/foto/:id', getAlunoFoto);

// Rota para obter RELATÓRIOS DE PRESENÇA do aluno logado (PROTEGIDA)
router.get('/presenca', verifyToken, getAlunoPresenceReports);

// Rota para obter TURMAS DISPONÍVEIS para inscrição do aluno (PROTEGIDA)
router.get('/turmas-disponiveis', verifyToken, getAvailableTurmas);

// Rota para INSCREVER o aluno logado em uma turma (PROTEGIDA)
router.post('/inscrever-turma', verifyToken, inscreverAlunoTurma);

// Rota para DESINSCREVER o aluno logado de uma turma (PROTEGIDA)
router.post('/desinscrever-turma', verifyToken, desinscreverAlunoTurma);

// Rota para obter AS AULAS EM QUE O ALUNO LOGADO ESTÁ INSCRITO (PROTEGIDA)
router.get('/minhas-aulas', verifyToken, getAlunoTurmas);

export default router;