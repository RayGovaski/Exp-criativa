// Index.js no back
import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import db from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import apoiadorRoutes from './routes/apoiadorRoutes.js';
import alunoRoutes from './routes/alunoRoutes.js';
import doacaoRoutes from './routes/doacaoRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'API is running successfully',
        endpoints: [
            'GET /apoiadores - List all apoiadores',
            'GET /test-db - Test database connection',
            'POST /apoiador - Create new apoiador',
            'POST /auth/login - User login'
        ]
    });
});

// Test database connection route
app.get('/test-db', (req, res) => {
    db.query('SELECT 1 + 1 AS solution', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database error', message: err.message });
        }
        return res.json({ 
            message: 'Database connection successful',
            data: results[0].solution
        });
    });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/apoiador', apoiadorRoutes);
app.use('/alunos', alunoRoutes);
app.use('/doacoes', doacaoRoutes);
app.use('/administrador', adminRoutes); 

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});