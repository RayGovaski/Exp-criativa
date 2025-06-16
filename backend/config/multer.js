// backend/config/multer.js

import multer from 'multer';

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Formato de arquivo inválido. Apenas imagens são permitidas.'), false);
  }
};

const memoryStorage = multer.memoryStorage();

export const uploadToMemory = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB (opcional, mas recomendado)
});


const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const uploadToDisk = multer({
  storage: diskStorage,
  fileFilter: imageFilter
});