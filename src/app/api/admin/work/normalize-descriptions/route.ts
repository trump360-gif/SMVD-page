import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/work/normalize-descriptions
 * Normalize work project descriptions from BlockEditor JSON to plain text
 * Secret parameter required for safety
 */
export async function POST(req: NextRequest) {
  try {
    // Simple protection: check secret parameter
    const secret = req.nextUrl.searchParams.get('secret');
    if (secret !== 'normalize-work-2026') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔄 Starting work project description normalization...\n');

    const projects = await prisma.workProject.findMany();
    const results: any[] = [];
    let normalizedCount = 0;

    for (const project of projects) {
      let cleanDescription = project.description;
      let wasNormalized = false;

      // Try to parse as BlockEditor JSON
      try {
        if (cleanDescription && typeof cleanDescription === 'string' && cleanDescription.trim().startsWith('{')) {
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
        results.push({
          slug: project.slug,
          title: project.title,
          status: 'normalized',
          preview: cleanDescription.substring(0, 60),
        });
        console.log(`✅ ${project.slug}: "${cleanDescription.substring(0, 50)}..."`);
      } else {
        results.push({
          slug: project.slug,
          title: project.title,
          status: 'skipped',
          reason: 'Already plain text or empty',
        });
        console.log(`⏭️  ${project.slug}: Already plain text or empty`);
      }
    }

    logger.info(
      { context: 'POST /api/admin/work/normalize-descriptions', normalizedCount },
      `Normalized ${normalizedCount}/${projects.length} descriptions`
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          totalProjects: projects.length,
          normalizedCount,
          results,
        },
        message: `✨ Normalized ${normalizedCount} descriptions`,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error(
      { err: error, context: 'POST /api/admin/work/normalize-descriptions' },
      'Description normalization error'
    );
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
