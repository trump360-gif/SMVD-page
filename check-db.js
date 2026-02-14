const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    const pageCount = await prisma.page.count();
    const sectionCount = await prisma.section.count();
    const mediaCount = await prisma.media.count();

    console.log("✅ Database Tables Status:");
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Pages: ${pageCount}`);
    console.log(`   - Sections: ${sectionCount}`);
    console.log(`   - Media: ${mediaCount}`);
    console.log("\n✅ All tables created successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
