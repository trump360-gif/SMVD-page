import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

/**
 * Image Optimization Script - Convert PNG/JPG to WebP
 *
 * Usage:
 * - npm run optimize-images -- --dry-run          # Simulate conversion
 * - npm run optimize-images -- --dry-run --dirs=home,work  # Test specific directories
 * - npm run optimize-images                       # Full conversion
 *
 * Features:
 * - Dry-run mode to preview changes
 * - Directory filtering
 * - Quality control (default: 80%)
 * - Preserves original files
 * - Detailed progress reporting
 */

interface ConversionStats {
  total: number;
  converted: number;
  skipped: number;
  errors: string[];
  originalSize: number;
  optimizedSize: number;
}

interface ConversionOptions {
  quality?: number;
  preserveOriginal?: boolean;
  dryRun?: boolean;
  targetDirs?: string[];
}

async function optimizeImages(options: ConversionOptions = {}): Promise<ConversionStats> {
  const {
    quality = 80,
    preserveOriginal = true,
    dryRun = false,
    targetDirs,
  } = options;

  const stats: ConversionStats = {
    total: 0,
    converted: 0,
    skipped: 0,
    errors: [],
    originalSize: 0,
    optimizedSize: 0,
  };

  // Get images directory - use process.cwd() for relative path
  const imagesDir = path.join(process.cwd(), 'public', 'images');

  // 1. Recursive directory scan
  async function scanDirectory(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await scanDirectory(fullPath)));
      } else if (/\.(png|jpg|jpeg)$/i.test(entry.name)) {
        files.push(fullPath);
      }
    }

    return files;
  }

  // 2. Convert to WebP
  async function convertToWebP(filePath: string): Promise<void> {
    try {
      const webpPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

      // Check if WebP already exists
      const webpExists = await fs
        .access(webpPath)
        .then(() => true)
        .catch(() => false);

      if (webpExists && preserveOriginal) {
        stats.skipped++;
        return;
      }

      // Get original file size
      const originalStat = await fs.stat(filePath);
      stats.originalSize += originalStat.size;

      if (!dryRun) {
        // Convert using Sharp
        await sharp(filePath)
          .webp({ quality, effort: 6 })
          .toFile(webpPath);

        // Get WebP file size
        const webpStat = await fs.stat(webpPath);
        stats.optimizedSize += webpStat.size;

        // Delete original if not preserving
        if (!preserveOriginal) {
          await fs.unlink(filePath);
        }
      } else {
        // Dry run: estimate WebP size at 25% of original
        stats.optimizedSize += Math.floor(originalStat.size * 0.25);
      }

      stats.converted++;
    } catch (error) {
      stats.errors.push(`${filePath}: ${(error as Error).message}`);
    }
  }

  // 3. Main execution
  try {
    const allFiles = await scanDirectory(imagesDir);

    // Filter by target directories if specified
    const targetFiles = targetDirs
      ? allFiles.filter((f) => targetDirs.some((d) => f.includes(`/images/${d}/`)))
      : allFiles;

    stats.total = targetFiles.length;

    console.log(`\n🔍 Found ${stats.total} images to convert...`);
    if (dryRun) console.log('🏃 DRY RUN MODE - No files will be modified\n');
    else console.log('');

    // Convert each file
    for (const file of targetFiles) {
      await convertToWebP(file);
      const progress = Math.round((stats.converted / stats.total) * 100);
      process.stdout.write(
        `\r⏳ Progress: ${progress}% (${stats.converted}/${stats.total})`
      );
    }

    console.log('\n');
  } catch (error) {
    console.error('❌ Error during optimization:', error);
    throw error;
  }

  // 4. Print report
  console.log('┌─────────────────────────────────────────────────────┐');
  console.log('│  Image Optimization Report                         │');
  console.log('├─────────────────────────────────────────────────────┤');
  console.log(`│  Total files:        ${stats.total.toString().padStart(3)}                            │`);
  console.log(`│  Converted:          ${stats.converted.toString().padStart(3)}                            │`);
  console.log(`│  Skipped:            ${stats.skipped.toString().padStart(3)}                            │`);
  console.log(`│  Errors:             ${stats.errors.length.toString().padStart(3)}                            │`);
  console.log('├─────────────────────────────────────────────────────┤');

  const originalMB = (stats.originalSize / 1024 / 1024).toFixed(2);
  const optimizedMB = (stats.optimizedSize / 1024 / 1024).toFixed(2);
  const savingsMB = stats.originalSize - stats.optimizedSize;
  const savingsPercent = stats.originalSize > 0
    ? Math.round((savingsMB / stats.originalSize) * 100)
    : 0;

  console.log(`│  Original size:      ${originalMB} MB                       │`);
  console.log(`│  Optimized size:     ${optimizedMB} MB                       │`);
  console.log(
    `│  Savings:            ${(savingsMB / 1024 / 1024).toFixed(2)} MB (${savingsPercent}%)              │`
  );
  console.log('└─────────────────────────────────────────────────────┘\n');

  if (stats.errors.length > 0) {
    console.log('⚠️  Errors:');
    stats.errors.forEach((err) => console.log(`   ${err}`));
    console.log('');
  }

  if (dryRun) {
    console.log('✅ Dry run completed. Use "npm run optimize-images" to apply changes.\n');
  } else {
    console.log('✅ Optimization completed successfully!\n');
  }

  return stats;
}

// Parse CLI arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const dirsArg = args.find((a) => a.startsWith('--dirs='));
const targetDirs = dirsArg ? dirsArg.split('=')[1].split(',') : undefined;

// Run optimization
optimizeImages({ dryRun, targetDirs }).catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
