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

router.get('/', get4Doacoes);
router.get('/todas', getAllDoacoesFull);
router.get('/:id', getDoacaoById);
router.get('/imagem/:id', getDoacaoImage);
router.post('/processar', verifyToken, processDonation);
router.post('/criar', verifyToken, uploadToMemory.single('imagem'), createDoacaoCard);


export default router;
