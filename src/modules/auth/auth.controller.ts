import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 
import { prisma } from '../../prisma'; 

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_me';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // 1. Busca o usuário pelo email
        const user = await prisma.user.findUnique({ where: { email } });

        // Se não achou o usuário, erro
        if (!user) {
             res.status(401).send('Credenciais inválidas (Email não encontrado)');
             return;
        }

        
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).send('Credenciais inválidas (Senha incorreta)');
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
