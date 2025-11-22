import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@teste.com'; // Email que vamos usar
  const senha = '123';             // Senha simples que vamos usar

  console.log(`🔐 Gerando hash para a senha: ${senha}...`);
  const hashedPassword = await bcrypt.hash(senha, 10);

  console.log('👤 Criando ou atualizando usuário no banco...');
  
  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword }, // Se já existir, atualiza a senha
    create: {
      email,
      password: hashedPassword,
    },
  });

  console.log('\n✅ SUCESSO! Usuário pronto para uso.');
  console.log('-----------------------------------');
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Senha: ${senha}`);
  console.log('-----------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });