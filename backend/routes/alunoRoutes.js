// backend/routes/alunoRoutes.js

import express from 'express';
// Importe a nova função
import { createAluno, getAlunos, getProfileAluno, getAlunoPresenceReports, 
         getAvailableTurmas, inscreverAlunoTurma, desinscreverAlunoTurma, 
         getAlunoTurmas } from '../controllers/alunoController.js'; // <--- Adicione getAlunoTurmas aqui
import upload from '../config/multer.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

const alunoResponsavelUploadFields = upload.fields([
    { name: 'responsavel_comprovante_residencia', maxCount: 1 },
    { name: 'responsavel_comprovante_renda', maxCount: 1 },
    { name: 'aluno_foto', maxCount: 1 }
]);

// --- Rotas de Registro e Perfil ---
router.post('/', alunoResponsavelUploadFields, createAluno);
router.get('/', getAlunos); // Rota para buscar todos os alunos
router.get('/profile', verifyToken, getProfileAluno); // Perfil do aluno logado
router.get('/reports/presence', verifyToken, getAlunoPresenceReports); // Relatórios de presença

// --- Rotas para Matérias (Inscrição/Desinscrição) ---
router.get('/turmas-disponiveis', verifyToken, getAvailableTurmas); // Busca todas as turmas + status de inscrição
router.post('/inscrever-turma', verifyToken, inscreverAlunoTurma); // Inscreve o aluno em uma turma
router.post('/desinscrever-turma', verifyToken, desinscreverAlunoTurma); // Desinscreve o aluno de uma turma

// --- NOVA ROTA: Obter as aulas em que o aluno está inscrito ---
router.get('/minhas-aulas', verifyToken, getAlunoTurmas); // <--- ADICIONE ESTA ROTA

export default router;