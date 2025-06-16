// backend/routes/professorRoutes.js

import express from 'express';
import { 
    getProfileProfessor,
    getProfessorTurmas,      
    getAlunosDaTurma,       
    salvarChamada,
    getChamadaPorData      
} from '../controllers/professorController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/perfil', verifyToken, getProfileProfessor);

router.get('/minhas-turmas', verifyToken, getProfessorTurmas);

router.get('/turmas/:turmaId/alunos', verifyToken, getAlunosDaTurma);

router.post('/chamada', verifyToken, salvarChamada);
router.get('/chamada-por-data', verifyToken, getChamadaPorData);
export default router;