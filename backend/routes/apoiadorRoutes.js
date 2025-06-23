// backend/routes/apoiadorRoutes.js

import express from 'express';
import {
    createApoiador,
    updateApoiadorFoto,
    getProfile,
    getApoiadorFoto,
    updatePassword,
    updateEmail,
    updatePhone,
    getApoiadorReports,
    getApoiadorDonationsHistory,
    cancelSubscription,
    subscribeToPlan 
} from '../controllers/apoiadorController.js';


import { uploadToMemory } from '../config/multer.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', uploadToMemory.single('foto'), createApoiador);
router.put('/update-foto', verifyToken, uploadToMemory.single('foto'), updateApoiadorFoto);
router.get('/perfil', verifyToken, getProfile);
router.get('/foto/:id', getApoiadorFoto);
router.put('/update-senha', verifyToken, updatePassword);
router.put('/update-email', verifyToken, updateEmail);
router.put('/update-telefone', verifyToken, updatePhone);
router.get('/historico-doacoes', verifyToken, getApoiadorDonationsHistory);
router.get('/relatorios', verifyToken, getApoiadorReports);
router.delete('/cancelar-assinatura', verifyToken, cancelSubscription);
router.post('/assinar-plano', verifyToken, subscribeToPlan);

export default router;
