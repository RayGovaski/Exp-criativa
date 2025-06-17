// backend/routes/doacaoRoutes.js

import express from 'express';
import {
    get4Doacoes,
    getAllDoacoesFull,
    getDoacaoById,
    createDoacaoCard,
    getDoacaoImage,
    processDonation
} from '../controllers/doacaoController.js';

import { uploadToMemory } from '../config/multer.js';

import { verifyToken } from '../middleware/auth.js';

const router = express.Router();


// Rota para a home page, que pega as 4 doações principais
router.get('/', get4Doacoes);

// Rota para a página "Doar", que lista todas as doações
router.get('/todas', getAllDoacoesFull);

// Rota para ver os detalhes de uma doação específica
router.get('/:id', getDoacaoById);

// Rota para servir a imagem de uma doação
router.get('/imagem/:id', getDoacaoImage);

router.post('/processar', verifyToken, processDonation);

router.post('/criar', verifyToken, uploadToMemory.single('imagem'), createDoacaoCard);


export default router;