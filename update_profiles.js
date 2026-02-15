const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

const updates = [
  { name: '윤여종', image: '/images/people/yun-yeojong.png' },
  { name: '김기영', image: '/images/people/kim-kiyoung.png' },
  { name: '이지선', image: '/images/people/lee-jisun.png' },
  { name: '나유미', image: '/images/people/na-youmi.png' },
];

async function main() {
  for (const update of updates) {
    const result = await prisma.people.updateMany({
      where: { name: update.name },
      data: { profileImage: update.image }
    });
    console.log(`✅ ${update.name}: ${result.count} updated`);
  }
  
  // 확인
  const all = await prisma.people.findMany({
    where: { archivedAt: null },
    select: { id: true, name: true, profileImage: true, order: true },
    orderBy: { order: 'asc' }
  });
  console.log('\n📋 Updated people:');
  all.forEach(p => console.log(`   ${p.name}: ${p.profileImage}`));
}

main()
  .catch(err => console.error(err))
  .finally(() => prisma.$disconnect());
