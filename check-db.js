const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

(async () => {
  try {
    const pages = await prisma.page.findMany({
      select: { id: true, slug: true, title: true }
    });
    console.log('\n=== All Pages in DB ===');
    if (pages.length === 0) {
      console.log('❌ NO PAGES in database!');
    } else {
      pages.forEach(p => console.log(`- ${p.slug}: ${p.title}`));
    }
    
    const aboutPage = await prisma.page.findUnique({
      where: { slug: 'about' },
      include: { 
        sections: {
          select: { id: true, type: true, title: true, order: true }
        }
      }
    });
    
    if (aboutPage) {
      console.log('\n✅ About Page Found!');
      console.log(`Title: ${aboutPage.title}`);
      console.log(`Sections count: ${aboutPage.sections.length}`);
      if (aboutPage.sections.length > 0) {
        aboutPage.sections.forEach(s => 
          console.log(`  - ${s.type}: "${s.title}" (order: ${s.order})`)
        );
      } else {
        console.log('  ⚠️  No sections!');
      }
    } else {
      console.log('\n❌ CRITICAL: About page NOT found in DB!');
      console.log('Need to create About page with sections');
    }
    
  } catch (e) {
    console.error('❌ Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
})();
