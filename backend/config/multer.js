// backend/config/multer.js

import multer from 'multer';

// --- Filtro de arquivo para aceitar apenas imagens (reutilizável) ---
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    // Rejeita o arquivo com um erro que pode ser capturado
    cb(new Error('Formato de arquivo inválido. Apenas imagens são permitidas.'), false);
  }
};

// --- Configuração para salvar na MEMÓRIA (para BLOBs no banco de dados) ---
const memoryStorage = multer.memoryStorage();

// ✅ Use esta instância para fotos de perfil e outras imagens que vão para o BD
export const uploadToMemory = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB (opcional, mas recomendado)
});


// --- Configuração para salvar em DISCO (se você precisar para outras coisas) ---
// (Esta é a sua configuração antiga, mantida caso precise dela para PDFs, etc.)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Use esta instância se precisar salvar arquivos no servidor
export const uploadToDisk = multer({
  storage: diskStorage,
  fileFilter: imageFilter
});