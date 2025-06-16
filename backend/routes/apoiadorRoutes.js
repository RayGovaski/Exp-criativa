// backend/routes/apoiadorRoutes.js

import express from 'express';
import {
    createApoiador,
    updateApoiadorFoto,
    getProfile,
    getApoiadorFoto,
    updatePassword,
    updateEmail,
    updatePhone
    // Adicione aqui outras funções que você usa neste arquivo
} from '../controllers/apoiadorController.js';

// ✅ ESTA É A IMPORTAÇÃO CORRETA ✅
// Usamos chaves {} para pegar a exportação NOMEADA 'uploadToMemory'
import { uploadToMemory } from '../config/multer.js';

import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// --- ROTAS DO APOIADOR ---

// Rota para criar um novo apoiador (usa a importação correta)
router.post('/', uploadToMemory.single('foto'), createApoiador);

// Rota para atualizar a foto (usa a importação correta)
router.put('/update-foto', verifyToken, uploadToMemory.single('foto'), updateApoiadorFoto);

// Rota para obter o perfil do apoiador logado
router.get('/perfil', verifyToken, getProfile);

// Rota para servir a imagem de um apoiador específico
router.get('/foto/:id', getApoiadorFoto);

// Rotas para atualizar dados específicos
router.put('/update-senha', verifyToken, updatePassword);
router.put('/update-email', verifyToken, updateEmail);
router.put('/update-telefone', verifyToken, updatePhone);


export default router;