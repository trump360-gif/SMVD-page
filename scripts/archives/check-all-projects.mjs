import { PrismaClient } from "./src/generated/prisma/index.js";

const prisma = new PrismaClient();

const projects = await prisma.workProject.findMany();

console.log(`📋 전체 ${projects.length}개 프로젝트:\n`);
projects.forEach(p => {
  console.log(`- ID: ${p.id}, Title: ${p.title}, Slug: ${p.slug}`);
  if (p.title.includes('STUDIO KNOT') || p.slug.includes('knot')) {
    console.log('  ★ STUDIO KNOT 발견!');
    console.log('  Content:', JSON.stringify(p.content, null, 2));
  }
});

await prisma.$disconnect();
