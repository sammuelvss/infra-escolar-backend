import { Request, Response } from 'express';
import { prisma } from '../../prisma';

/**
 * @swagger
 * /schools:
 *   get:
 *     summary: Lista as primeiras 50 escolas
 *     tags:
 *       - Schools
 *     responses:
 *       200:
 *         description: Lista de escolas
 */
export const getSchools = async (req: Request, res: Response) => {
    try {
        // Buscamos apenas 50 para não pesar a tela
        // O nome da tabela deve ser 'escola' (minúsculo) pois veio do banco assim
        const schools = await prisma.escola.findMany({
            take: 50, 
            orderBy: {
                id_escola: 'asc' // Ordena pelo ID
            }
        });
        res.json(schools);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao buscar escolas.");
    }
};