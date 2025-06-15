// backend/config/multer.js

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Storage comum para todos os uploads ---
const commonStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Pode criar subpastas se quiser, por exemplo:
    // if (file.fieldname === 'curriculo') {
    //   cb(null, path.resolve(__dirname, '../uploads/curriculos'));
    // } else { // Para fotos
    //   cb(null, path.resolve(__dirname, '../uploads/imagens'));
    // }
    cb(null, path.resolve(__dirname, '../uploads')); // Salva tudo na raiz 'uploads'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});


// --- FileFilter ESPECÍFICO para IMAGENS ---
const imageFilterFunction = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos.'), false);
  }
};

// --- FileFilter ESPECÍFICO para PDFs ---
const pdfFilterFunction = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos PDF são permitidos.'), false); // <--- ESTA É A LINHA DO ERRO
  }
};


// --- EXPORTE CADA INSTÂNCIA SEPARADAMENTE E DE FORMA CLARA ---

// Para uploads de imagens (fotos de perfil, etc.)
export const uploadImage = multer({ storage: commonStorage, fileFilter: imageFilterFunction });

// Para uploads de PDFs (currículos)
export const uploadPdf = multer({ storage: commonStorage, fileFilter: pdfFilterFunction });

// REMOVA QUALQUER export default ANTIGO OU OUTRAS DEFINIÇÕES DE 'upload'
// Ex: Se você tinha: export default multer(...); APAGUE ISSO.