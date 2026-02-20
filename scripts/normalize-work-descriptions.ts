import { prisma } from '../src/lib/db';

/**
 * Normalize work project descriptions from BlockEditor JSON to plain text
 * Extracts text blocks from BlockEditor format and saves as plain text
 */
async function main() {
  console.log('🔄 Starting description normalization...\n');

  try {
    const projects = await prisma.workProject.findMany();
    let normalizedCount = 0;
    let skippedCount = 0;

    for (const project of projects) {
      let cleanDescription = project.description;
      let wasNormalized = false;

      // Try to parse as BlockEditor JSON
      try {
        if (cleanDescription && cleanDescription.trim().startsWith('{')) {
          const parsed = JSON.parse(cleanDescription);
          if (parsed?.blocks && Array.isArray(parsed.blocks)) {
            // Extract text from text blocks
            const textBlocks = parsed.blocks
              .filter((b: any) => b.type === 'text' && b.content)
              .map((b: any) => b.content);

            if (textBlocks.length > 0) {
              cleanDescription = textBlocks.join('\n\n');
              wasNormalized = true;
            }
          }
        }
      } catch (e) {
        // Not JSON or parse error - keep as is
      }

      // Update if normalized
      if (wasNormalized) {
        await prisma.workProject.update({
          where: { id: project.id },
          data: { description: cleanDescription },
        });
        normalizedCount++;
        console.log(`✅ ${project.slug || project.title}: "${cleanDescription.substring(0, 50)}..."`);
      } else {
        skippedCount++;
        console.log(`⏭️  ${project.slug || project.title}: Already plain text or empty`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Normalized: ${normalizedCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log(`✨ Description normalization complete!\n`);

  } catch (error) {
    console.error('❌ Error during normalization:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
