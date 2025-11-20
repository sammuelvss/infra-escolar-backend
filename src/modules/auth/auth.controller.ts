import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma'; 

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_me';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.password !== password) {
             res.status(401).send('Credenciais inválidas');
             return;
        }

        const accessToken = jwt.sign(
            { userId: user.id, email: user.email }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ token: accessToken });

    } catch (error) {
        console.error(error);
        res.status(500).send("Erro no login");
    }
};