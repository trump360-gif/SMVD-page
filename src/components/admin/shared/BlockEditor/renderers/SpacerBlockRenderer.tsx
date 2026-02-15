'use client';

import React from 'react';
import type { SpacerBlock } from '../types';

interface SpacerBlockRendererProps {
  block: SpacerBlock;
}

const HEIGHT_MAP: Record<SpacerBlock['height'], number> = {
  small: 20,
  medium: 40,
  large: 80,
};

/**
 * Renders a spacer block as an empty div with the configured height.
 */
export default function SpacerBlockRenderer({ block }: SpacerBlockRendererProps) {
  const px = HEIGHT_MAP[block.height] ?? 40;

  return (
    <div
      className="bg-gray-100 rounded"
      style={{ height: `${px}px` }}
      aria-hidden="true"
    />
  );
}
