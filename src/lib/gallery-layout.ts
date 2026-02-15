/**
 * Gallery Layout Calculator
 * Calculates optimal image layout based on image count.
 *
 * Each row is an array of percentage widths (summing to ~100).
 * Example: [[100], [50, 50]] means one full-width row then a 2-column row.
 */

export type LayoutRow = number[];
export type LayoutConfig = LayoutRow[];

/**
 * Calculate optimal gallery layout based on image count.
 * Returns an array of rows, where each row is an array of column percentages.
 */
export function calculateLayout(imageCount: number): LayoutConfig {
  if (imageCount <= 0) return [];

  const presets: Record<number, LayoutConfig> = {
    1: [[100]],
    2: [[50, 50]],
    3: [[100], [50, 50]],
    4: [[50, 50], [50, 50]],
    5: [[100], [50, 50], [50, 50]],
    6: [[100], [50, 50], [33.33, 33.33, 33.34]],
    7: [[100], [50, 50], [50, 50], [50, 50]],
    8: [[100], [50, 50], [33.33, 33.33, 33.34], [50, 50]],
    9: [[100], [50, 50], [33.33, 33.33, 33.34], [33.33, 33.33, 33.34]],
  };

  if (presets[imageCount]) {
    return presets[imageCount];
  }

  // Dynamic layout for 10+ images
  return calculateDynamicLayout(imageCount);
}

function calculateDynamicLayout(count: number): LayoutConfig {
  const layout: LayoutConfig = [];
  let remaining = count;

  // First row is always full width
  layout.push([100]);
  remaining -= 1;

  // Fill remaining with alternating 2-col and 3-col rows
  while (remaining > 0) {
    if (remaining >= 3) {
      layout.push([33.33, 33.33, 33.34]);
      remaining -= 3;
    } else if (remaining >= 2) {
      layout.push([50, 50]);
      remaining -= 2;
    } else {
      layout.push([100]);
      remaining -= 1;
    }
  }

  return layout;
}

/**
 * Distribute images into layout rows.
 * Returns array of arrays, each inner array containing image indices for that row.
 */
export function distributeImages(imageCount: number, layout: LayoutConfig): number[][] {
  const result: number[][] = [];
  let imageIndex = 0;

  for (const row of layout) {
    const rowImages: number[] = [];
    for (let i = 0; i < row.length && imageIndex < imageCount; i++) {
      rowImages.push(imageIndex);
      imageIndex++;
    }
    if (rowImages.length > 0) {
      result.push(rowImages);
    }
  }

  return result;
}

/**
 * Layout preset names for UI display
 */
export const LAYOUT_PRESETS = [
  { name: 'Auto', value: 'auto' },
  { name: '1 Column', value: '1col' },
  { name: '2 Column', value: '2col' },
  { name: '3 Column', value: '3col' },
  { name: '1+2 (Hero)', value: '1+2' },
  { name: '1+2+3', value: '1+2+3' },
] as const;

export type LayoutPreset = (typeof LAYOUT_PRESETS)[number]['value'];

/**
 * Get layout config from preset name
 */
export function getLayoutFromPreset(preset: LayoutPreset, imageCount: number): LayoutConfig {
  if (preset === 'auto') return calculateLayout(imageCount);

  switch (preset) {
    case '1col': {
      const rows: LayoutConfig = [];
      for (let i = 0; i < imageCount; i++) rows.push([100]);
      return rows;
    }
    case '2col': {
      const rows: LayoutConfig = [];
      for (let i = 0; i < imageCount; i += 2) {
        if (i + 1 < imageCount) rows.push([50, 50]);
        else rows.push([100]);
      }
      return rows;
    }
    case '3col': {
      const rows: LayoutConfig = [];
      for (let i = 0; i < imageCount; i += 3) {
        const remaining = imageCount - i;
        if (remaining >= 3) rows.push([33.33, 33.33, 33.34]);
        else if (remaining === 2) rows.push([50, 50]);
        else rows.push([100]);
      }
      return rows;
    }
    case '1+2': {
      const rows: LayoutConfig = [[100]];
      let remaining = imageCount - 1;
      while (remaining > 0) {
        if (remaining >= 2) { rows.push([50, 50]); remaining -= 2; }
        else { rows.push([100]); remaining -= 1; }
      }
      return rows;
    }
    case '1+2+3': {
      const rows: LayoutConfig = [];
      if (imageCount >= 1) rows.push([100]);
      let remaining = imageCount - 1;
      if (remaining >= 2) { rows.push([50, 50]); remaining -= 2; }
      else if (remaining === 1) { rows.push([100]); remaining -= 1; }
      while (remaining > 0) {
        if (remaining >= 3) { rows.push([33.33, 33.33, 33.34]); remaining -= 3; }
        else if (remaining >= 2) { rows.push([50, 50]); remaining -= 2; }
        else { rows.push([100]); remaining -= 1; }
      }
      return rows;
    }
    default:
      return calculateLayout(imageCount);
  }
}
