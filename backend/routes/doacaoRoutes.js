// backend/routes/doacaoRoutes.js

import express from 'express';
import { get4Doacoes, createDoacao, getDoacaoImage, getAllDoacoesFull, getDoacaoById, processDonation } from '../controllers/doacaoController.js'; 
import { uploadImage } from '../config/multer.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// -- ROTAS POST -- (coloque esta primeira)
// Rota para processar uma doação
router.post('/doar-valor', verifyToken, processDonation); // <-- Esta é a rota do problema!

// Rota para criar uma nova doação (geralmente para admin)
router.post('/', uploadImage.single('imagem'), createDoacao);

// -- ROTAS GET -- (coloque as estáticas antes das dinâmicas)
// Rota para buscar as 4 doações principais (para Home)
router.get('/', getAllDoacoes);

// Rota para criar uma nova doação com upload de imagem
// 'imagem' deve ser o nome do campo 'input type="file"' no seu formulário
router.post('/', upload.single('imagem'), createDoacao); // <--- 'upload' agora está definido

// Rota para servir imagem de doação por ID
router.get('/imagem/:id', getDoacaoImage);

// NOVA ROTA: Para a página que lista TODAS as doações
router.get('/doar', getAllDoacoesFull);

export default router;