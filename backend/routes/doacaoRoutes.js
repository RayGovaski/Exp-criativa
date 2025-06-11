// backend/routes/doacaoRoutes.js

import express from 'express';
import { getAllDoacoes, createDoacao, getDoacaoImage, getAllDoacoesFull } from '../controllers/doacaoController.js';
import upload from '../config/multer.js'; // <--- ADICIONE ESTA LINHA PARA IMPORTAR O MULTER

const router = express.Router();

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