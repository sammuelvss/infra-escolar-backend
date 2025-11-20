import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';
import { login } from './modules/auth/auth.controller';
import { getMetrics } from './modules/metrics/metrics.controller';
import { setupSwagger } from './docs/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_me';

app.use(express.json());

// Config Swagger
setupSwagger(app);

// Middleware Auth
interface AuthRequest extends Request {
    user?: any;
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        res.status(401).send("Token faltando");
        return;
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            res.status(403).send("Token invalido");
            return;
        }
        req.user = user;
        next();
    });
};

/**
 * @swagger
 * /auth/login:
 * post:
 * summary: Login do usuario
 * tags: [Auth]
 * responses:
 * 200:
 * description: Login ok
 * 401:
 * description: Erro de login
 */
app.post('/auth/login', login);

app.get('/metrics', authenticateToken, getMetrics);

app.listen(PORT, () => {
    console.log(`🚀 API rodando em http://localhost:${PORT}`);
    console.log(`📄 Documentação disponível em http://localhost:${PORT}/docs`);
});