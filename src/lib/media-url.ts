/**
 * Normalize a media filepath for client use.
 *
 * After the Vercel Blob migration, new uploads store full Blob URLs
 * (https://…blob.vercel-storage.com/uploads/…) in the DB.  However
 * older rows still contain relative paths like "/uploads/2026/02/…"
 * which 404 on the app domain.
 *
 * This helper detects relative /uploads/ paths and rewrites them to
 * the correct Blob URL using the BLOB_READ_WRITE_TOKEN env var.
 * Paths that already start with "http" or point to static assets
 * (e.g. /images/…) are returned as-is.
 */
export function normalizeMediaUrl(filepath: string | null | undefined): string | null {
  if (!filepath) return null;
  if (filepath.startsWith("http")) return filepath;

  if (filepath.startsWith("/uploads/")) {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (token) {
      const match = token.match(/^vercel_blob_rw_([^_]+)_/);
      if (match) {
        return `https://${match[1]}.public.blob.vercel-storage.com${filepath}`;
      }
    }
  }

  // Static assets (/images/…) or other paths – return as-is
  return filepath;
}
