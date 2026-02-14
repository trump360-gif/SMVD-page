import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if users table exists
    const userCount = await prisma.user.count();
    console.log(`✅ Users table: ${userCount} users`);

    // Check if pages table exists
    const pageCount = await prisma.page.count();
    console.log(`✅ Pages table: ${pageCount} pages`);

    // Check if sections table exists
    const sectionCount = await prisma.section.count();
    console.log(`✅ Sections table: ${sectionCount} sections`);

    // Check if media table exists
    const mediaCount = await prisma.media.count();
    console.log(`✅ Media table: ${mediaCount} media files`);

    console.log('\n✅ All tables created successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
