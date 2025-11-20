import { PrismaClient } from '@prisma/client';

// Cria uma única instância do Prisma para o projeto todo.
// Isso evita criar múltiplas conexões com o banco sem necessidade.
export const prisma = new PrismaClient();