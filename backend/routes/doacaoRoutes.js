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

// ✅ CORREÇÃO 1: Importa a instância correta 'uploadToMemory' do seu arquivo de configuração
import { uploadToMemory } from '../config/multer.js';

import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// --- ROTAS PÚBLICAS (não precisam de token) ---

// Rota para a home page, que pega as 4 doações principais
router.get('/', get4Doacoes);

// Rota para a página "Doar", que lista todas as doações
router.get('/todas', getAllDoacoesFull);

// Rota para ver os detalhes de uma doação específica
router.get('/:id', getDoacaoById);

// Rota para servir a imagem de uma doação
router.get('/imagem/:id', getDoacaoImage);


// --- ROTAS PROTEGIDAS (precisam de token) ---

// Rota para processar o pagamento de uma doação
// Pode ser protegida para Apoiadores ou aberta, dependendo da sua regra.
// Vou assumir que precisa de token para vincular ao histórico do apoiador.
router.post('/processar', verifyToken, processDonation);


// Rota para criar um novo card de doação (ADMIN)
// ✅ CORREÇÃO 2: Usa a instância correta 'uploadToMemory'
// O campo no formulário do frontend deve ter name="imagem"
router.post('/criar', verifyToken, uploadToMemory.single('imagem'), createDoacaoCard);


export default router;