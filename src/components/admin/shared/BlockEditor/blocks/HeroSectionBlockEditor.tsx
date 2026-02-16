'use client';

import React, { useState } from 'react';
import { ImageIcon, AlertCircle } from 'lucide-react';
import type { HeroSectionBlock } from '../types';

interface HeroSectionBlockEditorProps {
  block: HeroSectionBlock;
  onChange: (data: Partial<HeroSectionBlock>) => void;
}

/**
 * Hero section block editor for Work detail pages.
 * Combines image (860px height) with title/author/email overlay.
 */
export default function HeroSectionBlockEditor({ block, onChange }: HeroSectionBlockEditorProps) {
  const [imgError, setImgError] = useState(false);
  const [activeTab, setActiveTab] = useState<'image' | 'title' | 'styling' | 'overlay'>('image');

  const titleFontSize = block.titleFontSize ?? 60;
  const authorFontSize = block.authorFontSize ?? 14;
  const gap = block.gap ?? 24;
  const titleFontWeight = block.titleFontWeight ?? '700';
  const authorFontWeight = block.authorFontWeight ?? '500';
  const emailFontWeight = block.emailFontWeight ?? '400';
  const titleColor = block.titleColor ?? '#1b1d1f';
  const authorColor = block.authorColor ?? '#1b1d1f';
  const emailColor = block.emailColor ?? '#7b828e';
  const overlayPosition = block.overlayPosition ?? 'bottom-left';
  const overlayOpacity = block.overlayOpacity ?? 0.8;

  const getOverlayPositionClass = () => {
    switch (overlayPosition) {
      case 'bottom-left':
        return 'bottom-0 left-0';
      case 'bottom-right':
        return 'bottom-0 right-0';
      case 'center':
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'none':
        return '';
      default:
        return 'bottom-0 left-0';
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-gray-200">
        {(['image', 'title', 'styling', 'overlay'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'image' && 'Image'}
            {tab === 'title' && 'Title'}
            {tab === 'styling' && 'Styling'}
            {tab === 'overlay' && 'Overlay'}
          </button>
        ))}
      </div>

      {/* Image Tab */}
      {activeTab === 'image' && (
        <div className="space-y-3">
          {/* Preview */}
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            {block.url && !imgError ? (
              <div
                className="relative w-full overflow-hidden"
                style={{ height: '200px' }}
              >
                <img
                  src={block.url}
                  alt={block.alt || 'Hero image'}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
                {overlayPosition !== 'none' && (
                  <div
                    className={`absolute ${getOverlayPositionClass()} text-white p-4 rounded`}
                    style={{
                      backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
                      maxWidth: '80%',
                    }}
                  >
                    <div
                      style={{
                        fontSize: `${titleFontSize * 0.3}px`,
                        fontWeight: titleFontWeight,
                        color: titleColor,
                        fontFamily: 'Satoshi, sans-serif',
                      }}
                    >
                      {block.title}
                    </div>
                    {block.author && (
                      <div
                        style={{
                          fontSize: `${authorFontSize * 0.7}px`,
                          fontWeight: authorFontWeight,
                          color: authorColor,
                          marginTop: `${gap * 0.3}px`,
                        }}
                      >
                        {block.author}
                      </div>
                    )}
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">
                  860px height (scaled)
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                {imgError ? (
                  <>
                    <AlertCircle size={28} className="text-red-400 mb-1" />
                    <p className="text-xs text-red-500">Failed to load image</p>
                  </>
                ) : (
                  <>
                    <ImageIcon size={28} className="mb-1" />
                    <p className="text-xs">Full-width hero image (860px height)</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* URL input */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Hero Image URL
            </label>
            <input
              type="text"
              value={block.url}
              onChange={(e) => {
                setImgError(false);
                onChange({ url: e.target.value });
              }}
              placeholder="/images/work/project/hero.png"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Alt text */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Alt Text
            </label>
            <input
              type="text"
              value={block.alt}
              onChange={(e) => onChange({ alt: e.target.value })}
              placeholder="Project hero image description..."
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      )}

      {/* Title Tab */}
      {activeTab === 'title' && (
        <div className="space-y-3">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Project Title
            </label>
            <input
              type="text"
              value={block.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Project title"
              className="w-full px-3 py-2 text-lg font-bold border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
              style={{ fontFamily: 'Satoshi, sans-serif' }}
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Author
            </label>
            <input
              type="text"
              value={block.author}
              onChange={(e) => onChange({ author: e.target.value })}
              placeholder="Author name"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={block.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="contact@example.com"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      )}

      {/* Styling Tab */}
      {activeTab === 'styling' && (
        <div className="space-y-4">
          {/* Title Styling */}
          <div className="border-b border-gray-200 pb-4">
            <h4 className="text-xs font-semibold text-gray-700 mb-3">Title Styling</h4>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Font Size (px)
                </label>
                <input
                  type="number"
                  min="20"
                  max="120"
                  value={titleFontSize}
                  onChange={(e) => onChange({ titleFontSize: parseInt(e.target.value) })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Font Weight
                </label>
                <select
                  value={titleFontWeight}
                  onChange={(e) => onChange({ titleFontWeight: e.target.value as '400' | '500' | '700' })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="400">Regular</option>
                  <option value="500">Medium</option>
                  <option value="700">Bold</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Title Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={titleColor}
                  onChange={(e) => onChange({ titleColor: e.target.value })}
                  className="w-10 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={titleColor}
                  onChange={(e) => onChange({ titleColor: e.target.value })}
                  className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Author/Email Styling */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-3">Author/Email Styling</h4>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Font Size (px)
                </label>
                <input
                  type="number"
                  min="10"
                  max="24"
                  value={authorFontSize}
                  onChange={(e) => onChange({ authorFontSize: parseInt(e.target.value) })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Gap (px)
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={gap}
                  onChange={(e) => onChange({ gap: parseInt(e.target.value) })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Author Font Weight
                </label>
                <select
                  value={authorFontWeight}
                  onChange={(e) => onChange({ authorFontWeight: e.target.value as '400' | '500' | '700' })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="400">Regular</option>
                  <option value="500">Medium</option>
                  <option value="700">Bold</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Email Font Weight
                </label>
                <select
                  value={emailFontWeight}
                  onChange={(e) => onChange({ emailFontWeight: e.target.value as '400' | '500' | '700' })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="400">Regular</option>
                  <option value="500">Medium</option>
                  <option value="700">Bold</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Author Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={authorColor}
                    onChange={(e) => onChange({ authorColor: e.target.value })}
                    className="w-10 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={authorColor}
                    onChange={(e) => onChange({ authorColor: e.target.value })}
                    className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Email Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={emailColor}
                    onChange={(e) => onChange({ emailColor: e.target.value })}
                    className="w-10 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={emailColor}
                    onChange={(e) => onChange({ emailColor: e.target.value })}
                    className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay Tab */}
      {activeTab === 'overlay' && (
        <div className="space-y-3">
          {/* Overlay Position */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Text Overlay Position
            </label>
            <div className="space-y-2">
              {['bottom-left', 'bottom-right', 'center', 'none'].map((pos) => (
                <label key={pos} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="overlayPosition"
                    value={pos}
                    checked={overlayPosition === pos}
                    onChange={(e) => onChange({ overlayPosition: e.target.value as any })}
                    className="w-4 h-4"
                  />
                  <span className="text-xs text-gray-700 capitalize">
                    {pos === 'bottom-left' && 'Bottom Left'}
                    {pos === 'bottom-right' && 'Bottom Right'}
                    {pos === 'center' && 'Center'}
                    {pos === 'none' && 'No Overlay'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {overlayPosition !== 'none' && (
            <>
              {/* Overlay Opacity */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Background Opacity
                </label>
                <div className="flex gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={overlayOpacity}
                    onChange={(e) => onChange({ overlayOpacity: parseFloat(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500 w-12">{overlayOpacity.toFixed(1)}</span>
                </div>
              </div>

              {/* Overlay Background */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={block.overlayBackground || 'rgba(0, 0, 0, 0.3)'}
                    onChange={(e) => onChange({ overlayBackground: e.target.value })}
                    placeholder="rgba(0, 0, 0, 0.3)"
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
