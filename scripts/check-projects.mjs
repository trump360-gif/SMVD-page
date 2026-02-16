import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking WorkProject table...\n');

  try {
    const projects = await prisma.workProject.findMany({
      select: {
        id: true,
        title: true,
        content: true,
      },
      take: 20,
    });

    if (projects.length === 0) {
      console.log('❌ No projects found in DB');
      console.log('\n📌 You need to create projects via the API first');
    } else {
      console.log(`✅ Found ${projects.length} projects:\n`);
      projects.forEach((p) => {
        const hasContent = p.content && typeof p.content === 'object' && 'blocks' in p.content;
        console.log(`  • ID: ${p.id} | Title: ${p.title} | Has content: ${hasContent ? '✅' : '❌'}`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
