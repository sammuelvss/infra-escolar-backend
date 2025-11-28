import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import helmet from 'helmet';
import { prisma } from './prisma';
import { login, register } from './modules/auth/auth.controller';
import { getMetrics } from './modules/metrics/metrics.controller';
import { getSchools } from './modules/schools/schools.controller'; 
import { setupSwagger } from './docs/swagger';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_me';


app.use(helmet());
app.use(cors());
app.use(express.json());

setupSwagger(app);

interface AuthRequest extends Request {
    user?: any;
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        res.status(401).send("Token não fornecido.");
        return;
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            res.status(403).send("Token inválido ou expirado.");
            return;
        }
        req.user = user;
        next();
    });
};

// --- Rotas ---

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
app.post('/auth/login', login);
app.post('/auth/register', register);

// Rota de Métricas (Documentação está no controller)
app.get('/metrics', authenticateToken, getMetrics);

// Rota de Escolas (Documentação está no controller)
app.get('/schools', authenticateToken, getSchools);

// --- Inicialização ---
app.listen(PORT, () => {
    console.log(`🚀 API rodando em http://localhost:${PORT}`);
    console.log(`📄 Documentação disponível em http://localhost:${PORT}/docs`);
});