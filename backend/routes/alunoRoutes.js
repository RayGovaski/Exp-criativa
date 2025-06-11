// routes/alunoRoutes.js
import express from 'express';
import { createAluno, getAlunos } from '../controllers/alunoController.js';
import upload from '../config/multer.js'; // Importa a configuração do Multer

const router = express.Router();

// Middleware para upload de múltiplos arquivos (para os comprovantes e foto)
const uploadFields = upload.fields([
    { name: 'responsavel_comprovante_residencia', maxCount: 1 },
    { name: 'responsavel_comprovante_renda', maxCount: 1 },
    { name: 'aluno_foto', maxCount: 1 }
]);

router.post('/', uploadFields, createAluno);
router.get('/', getAlunos);

export default router;