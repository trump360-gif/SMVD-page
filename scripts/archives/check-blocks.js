const { PrismaClient } = require('./src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  try {
    const workProject = await prisma.workProject.findUnique({
      where: { id: 'cmlnhb27t0008gpdpryyqubgv' }
    });

    if (workProject) {
      console.log('\n=== STUDIO KNOT (Direct Query) ===\n');
      console.log(`Title: ${workProject.title}`);
      console.log(`Author: ${workProject.author}`);
      console.log(`Content exists: ${workProject.content !== null && workProject.content !== undefined}`);
      
      if (workProject.content) {
        console.log(`\nContent.blocks: ${workProject.content.blocks ? workProject.content.blocks.length : 'N/A'} blocks`);
        
        if (workProject.content.blocks && Array.isArray(workProject.content.blocks)) {
          console.log('\n📦 Block Structure:');
          workProject.content.blocks.forEach((b, i) => {
            console.log(`\nBlock ${i + 1}: type="${b.type}" | order=${b.order}`);
            
            if (b.type === 'layout-row') {
              console.log(`  ✅ LayoutRow Block!`);
              console.log(`     Columns: ${b.columns}`);
              console.log(`     Distribution: ${b.distribution}`);
              console.log(`     Gap: ${b.columnGap}`);
              console.log(`\n     Column 1: ${b.children[0].length} blocks`);
              if (b.children[0].length > 0) {
                b.children[0].forEach((child, idx) => {
                  console.log(`       - Block ${idx + 1}: ${child.type}`);
                  if (child.type === 'text' && child.content) {
                    console.log(`         Content: "${child.content.substring(0, 50)}..."`);
                  }
                });
              }
              
              console.log(`\n     Column 2: ${b.children[1].length} blocks`);
              if (b.children[1].length > 0) {
                b.children[1].forEach((child, idx) => {
                  console.log(`       - Block ${idx + 1}: ${child.type}`);
                  if (child.type === 'heading' && child.content) {
                    console.log(`         Content: "${child.content}"`);
                  }
                });
              }
            }
          });
        }
      } else {
        console.log('Content field is null or undefined');
      }
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main().finally(() => prisma.$disconnect());
