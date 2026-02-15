'use client';

import React from 'react';
import type { DividerBlock } from '../types';

interface DividerBlockRendererProps {
  block: DividerBlock;
}

/**
 * Renders a divider block as an <hr> with the configured border style.
 */
export default function DividerBlockRenderer({ block }: DividerBlockRendererProps) {
  const borderStyle = block.style ?? 'solid';

  return (
    <hr
      className="border-gray-300 my-6"
      style={{ borderStyle }}
    />
  );
}
