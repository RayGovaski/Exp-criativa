// backend/routes/doacaoRoutes.js
import express from 'express';
import { get4Doacoes, createDoacao, getDoacaoImage, getAllDoacoesFull, getDoacaoById, processDonation } from '../controllers/doacaoController.js'; 
import upload from '../config/multer.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// -- ROTAS POST -- (coloque esta primeira)
// Rota para processar uma doação
router.post('/doar-valor', verifyToken, processDonation); // <-- Esta é a rota do problema!

// Rota para criar uma nova doação (geralmente para admin)
router.post('/', upload.single('imagem'), createDoacao);

// -- ROTAS GET -- (coloque as estáticas antes das dinâmicas)
// Rota para buscar as 4 doações principais (para Home)
router.get('/', get4Doacoes);

// Rota para a página que lista TODAS as doações
router.get('/doar', getAllDoacoesFull);

// Rota para servir imagem de doação por ID
router.get('/imagem/:id', getDoacaoImage);

// Rota para obter detalhes de UMA doação por ID (DEVE VIR DEPOIS DE TODAS AS ROTAS GET ESTÁTICAS)
router.get('/:id', getDoacaoById); 

export default router;