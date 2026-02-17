import { PrismaClient } from "./src/generated/prisma/index.js";

const prisma = new PrismaClient();

const project = await prisma.workProject.findUnique({
  where: { slug: 'studio-knot' }
});

if (project) {
  console.log('📋 STUDIO KNOT 현재 구조:');
  console.log(JSON.stringify(project.content, null, 2));
} else {
  console.log('❌ STUDIO KNOT을 찾을 수 없습니다');
}

await prisma.$disconnect();
