// backend/routes/adminRoutes.js

import express from 'express';
import {
    getProfileAdministrador,
    getProfessorsList,
    createProfessor,
    getAdminDashboardStats,
    createTurma
    // Se o admin também cria doações, importe a função aqui
    // createDoacaoCard 
} from '../controllers/adminController.js';
import { createDoacaoCard } from '../controllers/doacaoController.js';
// ✅ CORREÇÃO: Importa 'uploadToMemory' do seu arquivo de configuração
// Esta é a instância correta para salvar imagens como BLOB no banco de dados.
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

// Aplica a verificação de token e de role de admin para todas as rotas deste arquivo
router.use(verifyToken, isAdmin);


// --- ROTAS DE ADMIN ---

// Rotas que NÃO precisam de upload de arquivo
router.get('/perfil', getProfileAdministrador);
router.get('/professores', getProfessorsList);
router.post('/professores', createProfessor);
router.get('/dashboard-stats', getAdminDashboardStats);
router.post('/turmas', createTurma);
router.post('/doacao-card', uploadToMemory.single('imagem'), createDoacaoCard);


export default router;