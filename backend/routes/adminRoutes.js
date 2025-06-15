// backend/routes/adminRoutes.js

import express from 'express';
// --- CORREÇÃO AQUI: Mantenha APENAS UMA LINHA de importação de adminController.js ---
import { 
    getProfileAdministrador, 
    createTurma, 
    getProfessorsList, 
    createProfessor,
    getAdminDashboardStats // <--- Garanta que esta também está na única linha
} from '../controllers/adminController.js'; 

// Importe createDoacaoCard DO doacaoController.js
import { createDoacaoCard } from '../controllers/doacaoController.js'; 

// E as outras importações que você já tinha:
import { uploadImage, uploadPdf } from '../config/multer.js'; 
import { verifyToken } from '../middleware/auth.js'; 

const router = express.Router();

router.get('/profile', verifyToken, getProfileAdministrador);

router.post('/turma', verifyToken, createTurma); 

router.get('/professores', verifyToken, getProfessorsList);
router.post('/professor', verifyToken, createProfessor);

router.post('/doacao-card', verifyToken, uploadImage.single('imagem_doacao'), createDoacaoCard); 

// Adicione a rota para o dashboard de Admin se você a usa
router.get('/dashboard-stats', verifyToken, getAdminDashboardStats); // <--- Adicione esta rota se usa

export default router;