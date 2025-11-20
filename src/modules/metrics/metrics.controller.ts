import { Request, Response } from 'express';
import { prisma } from '../../prisma';

/**
 * @swagger
 * /metrics:
 * get:
 * summary: Retorna dados para graficos
 * tags: [Metrics]
 * responses:
 * 200:
 * description: Sucesso
 * 401:
 * description: Nao autorizado
 */
export const getMetrics = async (req: Request, res: Response) => {
    try {
        const metrics = await prisma.metric.findMany();
        res.json(metrics);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao buscar métricas.");
    }
};