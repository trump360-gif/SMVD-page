import { PrismaClient } from '../src/generated/prisma';
import { put } from '@vercel/blob';
import * as fs from 'fs/promises';
import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const prisma = new PrismaClient();
const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function uploadFile(localPath: string, destPath: string, contentType: string): Promise<string | null> {
  try {
    const fullPath = path.join(PUBLIC_DIR, localPath);
    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch {
      // File does not exist locally
      return null;
    }

    const content = await fs.readFile(fullPath);
    const blob = await put(destPath, content, {
      access: 'public',
      contentType: contentType,
    });
    console.log(`Uploaded ${localPath} -> ${blob.url}`);
    return blob.url;
  } catch (error) {
    console.error(`Failed to upload ${localPath}:`, (error as Error).message);
    return null;
  }
}

async function main() {
  const medias = await prisma.media.findMany();
  console.log(`Found ${medias.length} media records to process.`);

  const urlMap = new Map<string, string>();

  // 1. Upload all local media
  for (const media of medias) {
    if (media.filepath.startsWith('/uploads/')) {
      const localPath = media.filepath; // e.g. /uploads/2026/02/123.webp
      const destPath = localPath.replace(/^\//, ''); // uploads/2026/02/123.webp
      
      const newUrl = await uploadFile(localPath, destPath, media.mimeType);
      
      if (newUrl) {
        urlMap.set(localPath, newUrl);
        
        // Update Media record
        await prisma.media.update({
          where: { id: media.id },
          data: { filepath: newUrl },
        });

        // Also upload thumbnail if it exists locally
        if (localPath.endsWith('.webp')) {
            const localThumbPath = localPath.replace(/\.webp$/, '-thumb.webp');
            const destThumbPath = destPath.replace(/\.webp$/, '-thumb.webp');
            const newThumbUrl = await uploadFile(localThumbPath, destThumbPath, 'image/webp');
            if (newThumbUrl) {
                urlMap.set(localThumbPath, newThumbUrl);
            }
        }

        // Upload original if it exists
        const formats = media.formats as any;
        if (formats && formats.original) {
            const pathParts = localPath.split('/');
            if (pathParts.length >= 4) {
                const yearMonth = `${pathParts[2]}/${pathParts[3]}`; // 2026/02
                const hash = path.basename(localPath, '.webp').replace('.svg', ''); 
                const origDir = path.join(PUBLIC_DIR, 'uploads', 'originals', yearMonth);
                
                try {
                    const files = await fs.readdir(origDir);
                    const origFile = files.find(f => f.startsWith(hash + '.'));
                    if (origFile) {
                        const localOrigPath = `/uploads/originals/${yearMonth}/${origFile}`;
                        const destOrigPath = `uploads/originals/${yearMonth}/${origFile}`;
                        // For SVG we might not have originals, but just in case
                        const newOrigUrl = await uploadFile(localOrigPath, destOrigPath, formats.original);
                        if (newOrigUrl) {
                            urlMap.set(localOrigPath, newOrigUrl);
                        }
                    }
                } catch (e) {
                    // Ignore if directory doesn't exist
                }
            }
        }
      }
    }
  }

  console.log(`Uploaded ${urlMap.size} files. Updating references...`);

  // 2. Update WorkProject references
  const projects = await prisma.workProject.findMany();
  for (const p of projects) {
    let changed = false;
    const data: any = {};
    
    if (urlMap.has(p.heroImage)) {
      data.heroImage = urlMap.get(p.heroImage);
      changed = true;
    }
    if (urlMap.has(p.thumbnailImage)) {
      data.thumbnailImage = urlMap.get(p.thumbnailImage);
      changed = true;
    }

    if (p.galleryImages) {
        let galleryStr = JSON.stringify(p.galleryImages);
        let gChanged = false;
        urlMap.forEach((newUrl, oldUrl) => {
            if (galleryStr.includes(oldUrl)) {
                galleryStr = galleryStr.split(oldUrl).join(newUrl);
                gChanged = true;
            }
        });
        if (gChanged) {
            data.galleryImages = JSON.parse(galleryStr);
            changed = true;
        }
    }

    if (p.content) {
        let contentStr = JSON.stringify(p.content);
        let cChanged = false;
        urlMap.forEach((newUrl, oldUrl) => {
            if (contentStr.includes(oldUrl)) {
                contentStr = contentStr.split(oldUrl).join(newUrl);
                cChanged = true;
            }
        });
        if (cChanged) {
            data.content = JSON.parse(contentStr);
            changed = true;
        }
    }

    if (changed) {
        await prisma.workProject.update({
            where: { id: p.id },
            data
        });
        console.log(`Updated WorkProject: ${p.title}`);
    }
  }

  // 3. Update WorkExhibition references
  const exhibitions = await prisma.workExhibition.findMany();
  for (const ex of exhibitions) {
    if (urlMap.has(ex.image)) {
        await prisma.workExhibition.update({
            where: { id: ex.id },
            data: { image: urlMap.get(ex.image) }
        });
        console.log(`Updated WorkExhibition: ${ex.title}`);
    }
  }

  // 4. Update NewsEvent references
  const newsEvents = await prisma.newsEvent.findMany();
  for (const event of newsEvents) {
    let changed = false;
    const data: any = {};
    
    if (urlMap.has(event.thumbnailImage)) {
      data.thumbnailImage = urlMap.get(event.thumbnailImage);
      changed = true;
    }
    
    if (event.content) {
        let contentStr = JSON.stringify(event.content);
        let cChanged = false;
        urlMap.forEach((newUrl, oldUrl) => {
            if (contentStr.includes(oldUrl)) {
                contentStr = contentStr.split(oldUrl).join(newUrl);
                cChanged = true;
            }
        });
        if (cChanged) {
            data.content = JSON.parse(contentStr);
            changed = true;
        }
    }
    
    if (changed) {
        await prisma.newsEvent.update({
            where: { id: event.id },
            data
        });
        console.log(`Updated NewsEvent: ${event.title}`);
    }
  }

  // 5. Update People profileImage
  const people = await prisma.people.findMany();
  for (const person of people) {
    if (person.profileImage && urlMap.has(person.profileImage)) {
        await prisma.people.update({
            where: { id: person.id },
            data: { profileImage: urlMap.get(person.profileImage) }
        });
        console.log(`Updated People: ${person.name}`);
    }
  }

  console.log("Migration complete!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
