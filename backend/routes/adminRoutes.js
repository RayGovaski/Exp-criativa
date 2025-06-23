// backend/routes/adminRoutes.js

import express from 'express';
import {
    getProfileAdministrador,
    getProfessorsList,
    createProfessor,
    getAdminDashboardStats,
    createTurma
} from '../controllers/adminController.js';
import { createDoacaoCard } from '../controllers/doacaoController.js';
import { uploadToMemory } from '../config/multer.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Middleware para garantir que apenas administradores acessem estas rotas
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'administrador') {
        next();
    } else {
        res.status(403).json({ error: 'Acesso negado. Rota exclusiva para administradores.' });
    }
};

router.use(verifyToken, isAdmin);


// --- ROTAS DE ADMIN ---

// Rotas que NÃO precisam de upload de arquivo
router.get('/perfil', getProfileAdministrador);
router.get('/professores', getProfessorsList);
router.post('/professor', createProfessor);
router.get('/dashboard-stats', getAdminDashboardStats);
router.post('/turma', createTurma);
router.post('/doacao-card', uploadToMemory.single('imagem'), createDoacaoCard);


export default router;
