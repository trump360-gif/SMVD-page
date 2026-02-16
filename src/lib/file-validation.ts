/**
 * File Validation - Magic Byte Verification
 *
 * Validates file content by checking magic bytes (file signatures)
 * to prevent Content-Type spoofing attacks.
 *
 * Supported formats: JPEG, PNG, WebP, GIF
 */

interface FileTypeResult {
  /** Detected MIME type */
  mime: string;
  /** File extension */
  ext: string;
}

/**
 * Known magic byte signatures for image formats.
 * Each entry has the byte sequence and the offset where it starts.
 */
const SIGNATURES: Array<{
  bytes: number[];
  offset: number;
  mime: string;
  ext: string;
}> = [
  // JPEG: FF D8 FF
  { bytes: [0xFF, 0xD8, 0xFF], offset: 0, mime: 'image/jpeg', ext: 'jpg' },
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  { bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A], offset: 0, mime: 'image/png', ext: 'png' },
  // WebP: RIFF....WEBP
  { bytes: [0x52, 0x49, 0x46, 0x46], offset: 0, mime: 'image/webp', ext: 'webp' },
  // GIF87a
  { bytes: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61], offset: 0, mime: 'image/gif', ext: 'gif' },
  // GIF89a
  { bytes: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61], offset: 0, mime: 'image/gif', ext: 'gif' },
];

/**
 * Detect file type from buffer content by checking magic bytes.
 *
 * @param buffer - File content as a Buffer (at least first 12 bytes needed)
 * @returns Detected file type or null if unknown
 */
export function detectFileType(buffer: Buffer): FileTypeResult | null {
  if (buffer.length < 12) return null;

  for (const sig of SIGNATURES) {
    let matches = true;
    for (let i = 0; i < sig.bytes.length; i++) {
      if (buffer[sig.offset + i] !== sig.bytes[i]) {
        matches = false;
        break;
      }
    }

    if (matches) {
      // Special check for WebP: bytes at offset 8-11 must be "WEBP"
      if (sig.mime === 'image/webp') {
        const webpTag = buffer.slice(8, 12).toString('ascii');
        if (webpTag !== 'WEBP') continue;
      }
      return { mime: sig.mime, ext: sig.ext };
    }
  }

  return null;
}

/**
 * Validate that the buffer content matches one of the allowed MIME types.
 *
 * @param buffer - File content
 * @param allowedTypes - Array of allowed MIME types
 * @returns Object with validation result and detected type
 */
export function validateFileContent(
  buffer: Buffer,
  allowedTypes: string[]
): { valid: boolean; detectedType: FileTypeResult | null; message?: string } {
  const detected = detectFileType(buffer);

  if (!detected) {
    return {
      valid: false,
      detectedType: null,
      message: '파일 형식을 확인할 수 없습니다. 지원하는 이미지 파일을 업로드해주세요.',
    };
  }

  if (!allowedTypes.includes(detected.mime)) {
    return {
      valid: false,
      detectedType: detected,
      message: `파일 내용이 선언된 형식과 일치하지 않습니다. 감지된 형식: ${detected.mime}`,
    };
  }

  return { valid: true, detectedType: detected };
}
