import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  try {
    const studioKnot = await prisma.workProject.findFirst({
      where: { title: 'STUDIO KNOT' },
    });

    if (!studioKnot) {
      console.error('❌ Not found');
      process.exit(1);
    }

    console.log('📊 Current DB Data:\n');
    console.log(JSON.stringify(studioKnot, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main();
