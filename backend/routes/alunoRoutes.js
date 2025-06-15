// backend/routes/alunoRoutes.js

import express from 'express';
// Importa TODAS as funções do alunoController.js que são usadas
import { 
    createAluno, 
    getAlunos, 
    getProfileAluno, 
    getAlunoPresenceReports, 
    getAvailableTurmas, 
    inscreverAlunoTurma, 
    desinscreverAlunoTurma, 
    getAlunoTurmas 
} from '../controllers/alunoController.js'; 

// Importa a instância específica para upload de IMAGENS do seu multer.js
// É importante que 'uploadImage' seja usada para arquivos de imagem.
import { uploadImage } from '../config/multer.js'; 

// Importa o middleware de verificação de token
import { verifyToken } from '../middleware/auth.js'; 

const router = express.Router();

// --- Configuração do Multer para múltiplos arquivos no registro de aluno ---
// Esta configuração DEVE usar 'uploadImage.fields' se os comprovantes e fotos forem IMAGENS.
// Se algum deles puder ser PDF, você precisaria de 'uploadPdf' ou uma lógica mais complexa.
const alunoResponsavelUploadFields = uploadImage.fields([ // <--- USE uploadImage.fields AQUI
    { name: 'responsavel_comprovante_residencia', maxCount: 1 }, // Assume imagem
    { name: 'responsavel_comprovante_renda', maxCount: 1 },     // Assume imagem
    { name: 'aluno_foto', maxCount: 1 } // Assume imagem
]);

// --- Rotas de Aluno ---

// Rota para CRIAR um novo aluno (Registro)
// URL: /alunos/
// Usa o middleware de upload para os arquivos do formulário
router.post('/', alunoResponsavelUploadFields, createAluno);

// Rota para LISTAR todos os alunos (geralmente para uso administrativo, pode ser protegida)
// URL: /alunos/
// Se esta rota for sensível, adicione 'verifyToken' aqui: router.get('/', verifyToken, getAlunos);
router.get('/', getAlunos); 

// Rota para obter o PERFIL COMPLETO do aluno logado (PROTEGIDA)
// URL: /alunos/profile
router.get('/profile', verifyToken, getProfileAluno); 

// Rota para obter RELATÓRIOS DE PRESENÇA do aluno logado (PROTEGIDA)
// URL: /alunos/reports/presence
router.get('/reports/presence', verifyToken, getAlunoPresenceReports); 

// Rota para obter TURMAS DISPONÍVEIS para inscrição do aluno (PROTEGIDA)
// URL: /alunos/turmas-disponiveis
router.get('/turmas-disponiveis', verifyToken, getAvailableTurmas); 

// Rota para INSCREVER o aluno logado em uma turma (PROTEGIDA)
// URL: /alunos/inscrever-turma
router.post('/inscrever-turma', verifyToken, inscreverAlunoTurma); 

// Rota para DESINSCREVER o aluno logado de uma turma (PROTEGIDA)
// URL: /alunos/desinscrever-turma
router.post('/desinscrever-turma', verifyToken, desinscreverAlunoTurma); 

// Rota para obter AS AULAS EM QUE O ALUNO LOGADO ESTÁ INSCRITO (Minha Sala) (PROTEGIDA)
// URL: /alunos/minhas-aulas
router.get('/minhas-aulas', verifyToken, getAlunoTurmas); 

export default router;