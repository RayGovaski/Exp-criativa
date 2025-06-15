
import express from 'express';
import { uploadImage } from '../config/multer.js';
import { verifyToken } from '../middleware/auth.js';
import {
    getAllApoiadores,
    createApoiador,
    getProfile,
    updatePassword,
    updateEmail,
    updatePhone,
    updatePhoto,
    subscribeToPlan,
    cancelSubscription,
    getPhoto,
    getApoiadorHistoricoDoacao
} from '../controllers/apoiadorController.js';

const router = express.Router();

// Public routes
router.get('/', getAllApoiadores);
router.post('/', uploadImage.single('foto'), createApoiador);
router.get('/foto/:id', getPhoto);

// Protected routes
router.get('/profile', verifyToken, getProfile);
router.put('/update-senha', verifyToken, updatePassword);
router.put('/update-email', verifyToken, updateEmail);
router.put('/update-telefone', verifyToken, updatePhone);
router.put('/update-foto', verifyToken, uploadImage.single('foto'), updatePhoto);
router.post('/assinar-plano', verifyToken, subscribeToPlan);
router.delete('/cancelar-assinatura', verifyToken, cancelSubscription);

router.get('/doacao/historico', verifyToken, getApoiadorHistoricoDoacao);

export default router;