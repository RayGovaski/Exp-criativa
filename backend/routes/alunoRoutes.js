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
    getAlunoFoto,
    updateAlunoFoto
} from '../controllers/alunoController.js';

import { uploadToMemory } from '../config/multer.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

const alunoUpload = uploadToMemory.fields([
    { name: 'aluno_foto', maxCount: 1 }
]);


router.post('/register', alunoUpload, createAluno);
router.get('/', getAlunos);
router.get('/perfil', verifyToken, getProfileAluno);
router.get('/foto/:id', getAlunoFoto);
router.get('/presenca', verifyToken, getAlunoPresenceReports);
router.get('/turmas-disponiveis', verifyToken, getAvailableTurmas);
router.post('/inscrever-turma', verifyToken, inscreverAlunoTurma);
router.post('/desinscrever-turma', verifyToken, desinscreverAlunoTurma);
router.get('/minhas-aulas', verifyToken, getAlunoTurmas);
router.put('/update-foto', verifyToken, uploadToMemory.single('foto'), updateAlunoFoto)

export default router;