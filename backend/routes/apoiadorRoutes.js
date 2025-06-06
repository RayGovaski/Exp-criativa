
import express from 'express';
import upload from '../config/multer.js';
import { verifyToken } from '../middleware/auth.js';
import {
    getAllApoiadores,
    createApoiador,
    getProfile,
    updatePassword,
    updateEmail,
    updatePhone,
    updatePhoto,
    getPhoto
} from '../controllers/apoiadorController.js';

const router = express.Router();

// Public routes
router.get('/', getAllApoiadores);
router.post('/', upload.single('foto'), createApoiador);
router.get('/foto/:id', getPhoto);

// Protected routes
router.get('/profile', verifyToken, getProfile);
router.put('/update-senha', verifyToken, updatePassword);
router.put('/update-email', verifyToken, updateEmail);
router.put('/update-telefone', verifyToken, updatePhone);
router.put('/update-foto', verifyToken, upload.single('foto'), updatePhoto);

export default router;