server.js
require('dotenv').config(); 
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET; 
const PORT = process.env.PORT || 3000;

app.use(express.json());


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) return res.status(401).send("Token não fornecido.");

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send("Token inválido ou expirado."); 
        req.user = user;
        next();
    });
};


app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    
    const user = await prisma.user.findUnique({ where: { email, password } }); 

    if (!user) {
        return res.status(401).send('Credenciais inválidas');
    }

    
    const accessToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: accessToken });
});


app.get('/metrics', authenticateToken, async (req, res) => {
    try {
        const metrics = await prisma.metric.findMany({
            include: { school: true }
        });
        res.json(metrics);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao buscar métricas.");
    }
});


app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});
