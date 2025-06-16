
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_secure_jwt_key_change_this_in_production";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Formato de token inválido" });
    }
    
    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
};

export { JWT_SECRET };