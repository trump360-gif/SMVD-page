'use client';

import React from 'react';
import type { HeadingBlock } from '../types';

interface HeadingBlockRendererProps {
  block: HeadingBlock;
}

/**
 * Renders a heading block at the appropriate level (h1/h2/h3).
 */
export default function HeadingBlockRenderer({ block }: HeadingBlockRendererProps) {
  if (!block.content) {
    return (
      <p className="text-gray-400 text-sm italic">Empty heading block</p>
    );
  }

  switch (block.level) {
    case 1:
      return <h1 className="text-4xl font-bold text-gray-900">{block.content}</h1>;
    case 2:
      return <h2 className="text-2xl font-bold text-gray-900">{block.content}</h2>;
    case 3:
      return <h3 className="text-xl font-semibold text-gray-900">{block.content}</h3>;
    default:
      return <h2 className="text-2xl font-bold text-gray-900">{block.content}</h2>;
  }
}
