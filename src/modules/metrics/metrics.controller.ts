import { Request, Response } from 'express';
import { prisma } from '../../prisma';

/**
 * @swagger
 * /metrics:
 *   get:
 *     summary: Retorna os dados para os gráficos
 *     tags:
 *       - Metrics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de métricas encontradas
 *       401:
 *         description: Não autorizado
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