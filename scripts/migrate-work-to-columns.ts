/**
 * Migration script: Convert /work/9 (STUDIO KNOT) flat Tiptap content
 * to use `columns` node for 2-column layout (title+author | description).
 *
 * Before:
 *   { type: "doc", content: [image, paragraph, image, image, ...] }
 *
 * After:
 *   { type: "doc", content: [
 *     { type: "columns", attrs: { count: 2 }, content: [
 *       { type: "column", content: [heading(title), paragraph(author+email)] },
 *       { type: "column", content: [paragraph(description)] }
 *     ]},
 *     image, image, ...  (remaining images, without the first hero duplicate)
 *   ]}
 */

import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function migrateWorkToColumns() {
  // Find all Tiptap-content work projects
  const projects = await prisma.workProject.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      author: true,
      email: true,
      description: true,
      content: true,
    },
  });

  for (const project of projects) {
    const content = project.content as any;
    if (!content || content.type !== 'doc' || !Array.isArray(content.content)) {
      console.log(`[SKIP] ${project.slug}: No Tiptap content`);
      continue;
    }

    // Check if already migrated (has columns node)
    const hasColumns = content.content.some((n: any) => n.type === 'columns');
    if (hasColumns) {
      console.log(`[SKIP] ${project.slug}: Already has columns layout`);
      continue;
    }

    // Find the first paragraph (description text)
    const firstParagraphIdx = content.content.findIndex(
      (n: any) => n.type === 'paragraph' && n.content?.length > 0
    );

    if (firstParagraphIdx === -1) {
      console.log(`[SKIP] ${project.slug}: No paragraph found`);
      continue;
    }

    const descriptionParagraph = content.content[firstParagraphIdx];

    // Build 2-column layout:
    // Left column: title (heading) + author/email (paragraph)
    // Right column: description text
    const columnsNode = {
      type: 'columns',
      attrs: { count: 2 },
      content: [
        {
          type: 'column',
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: project.title }],
            },
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: project.author, marks: [{ type: 'bold' }] },
                ...(project.email
                  ? [{ type: 'text', text: ` ${project.email}` }]
                  : []),
              ],
            },
          ],
        },
        {
          type: 'column',
          content: [descriptionParagraph],
        },
      ],
    };

    // Build new content: columns node first, then remaining images (skip first hero image duplicate and the description paragraph)
    const remainingNodes = content.content.filter((_: any, idx: number) => {
      if (idx === 0 && content.content[0].type === 'image') return false; // Skip first hero image (duplicate of heroImage field)
      if (idx === firstParagraphIdx) return false; // Skip description paragraph (moved into column)
      return true;
    });

    const newContent = {
      type: 'doc',
      content: [columnsNode, ...remainingNodes],
      // Preserve original block content for reference
      _originalBlockContent: content._originalBlockContent,
    };

    // Update DB
    await prisma.workProject.update({
      where: { id: project.id },
      data: { content: newContent as any },
    });

    console.log(`[MIGRATED] ${project.slug}: Converted to 2-column layout`);
    console.log(`  Left column: "${project.title}" + "${project.author}"`);
    console.log(`  Right column: description paragraph`);
    console.log(`  Remaining nodes: ${remainingNodes.length}`);
  }

  console.log('\nMigration complete!');
}

migrateWorkToColumns()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
