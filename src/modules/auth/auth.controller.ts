import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 
import { prisma } from '../../prisma'; 

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_me';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        console.log(`Tentativa de login para: ${email}`); // Log para depuração

        // 1. Busca o usuário
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
             console.log('Usuário não encontrado no banco.');
             res.status(401).send('Credenciais inválidas'); // Mensagem genérica por segurança
             return;
        }

        // 2. Compara a senha
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log('Senha incorreta.');
            res.status(401).send('Credenciais inválidas');
            return;
        }

        // 3. Gera o token
        const accessToken = jwt.sign(
            { userId: user.id, email: user.email }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );

        console.log('Login com sucesso!');
        res.json({ token: accessToken });

    } catch (error) {
        console.error('Erro no servidor:', error);
        res.status(500).send("Erro interno no login");
    }
};

export const register = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        try {
            // 1. Verifica se já existe
            const userExists = await prisma.user.findUnique({ where: { email } });
            if (userExists) {
                res.status(400).send('Usuário já existe.');
                return;
            }

            // 2. Criptografa a senha
            const hashedPassword = await bcrypt.hash(password, 10);

            // 3. Salva no banco
            const user = await prisma.user.create({
                data: { email, password: hashedPassword }
            });

            res.status(201).json({ message: "Criado com sucesso!" });
        } catch (error) {
            console.error(error);
            res.status(500).send("Erro ao criar conta.");
        }
    };