import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function verify() {
  const page = await prisma.page.findUnique({
    where: { slug: 'home' },
    include: {
      sections: {
        orderBy: { order: 'asc' },
        include: {
          exhibitionItems: { orderBy: { order: 'asc' } },
          workPortfolios: { orderBy: { order: 'asc' } },
        },
      },
    },
  });

  console.log('\n📊 Home Page Data Verification:');
  console.log('================================');
  console.log(`Page ID: ${page?.id}`);
  console.log(`Sections: ${page?.sections.length}`);

  page?.sections.forEach((section) => {
    console.log(`\n  [${section.order}] ${section.type}: ${section.title}`);
    if (section.exhibitionItems.length > 0) {
      console.log(`      Exhibition Items: ${section.exhibitionItems.length}`);
      section.exhibitionItems.forEach((item) => {
        console.log(`        - ${item.year} (order: ${item.order})`);
      });
    }
    if (section.workPortfolios.length > 0) {
      console.log(`      Work Portfolios: ${section.workPortfolios.length}`);
      section.workPortfolios.slice(0, 3).forEach((item) => {
        console.log(`        - ${item.title} (${item.category})`);
      });
      if (section.workPortfolios.length > 3) {
        console.log(`        ... and ${section.workPortfolios.length - 3} more`);
      }
    }
  });

  const media = await prisma.media.count();
  console.log(`\nTotal Media Items: ${media}`);

  await prisma.$disconnect();
  console.log('\n✅ Verification complete!');
}

verify();
