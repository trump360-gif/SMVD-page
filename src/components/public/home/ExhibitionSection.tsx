'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useResponsive } from '@/lib/responsive';
import { GAP } from '@/constants/responsive';

interface ExhibitionItem {
  year: string;
  src: string;
  alt: string;
}

interface ExhibitionSectionProps {
  items?: ExhibitionItem[];
}

export default function ExhibitionSection({
  items = [
    {
      year: '2025',
      src: '/images/home/exhibition-2025.png',
      alt: 'SMVD Grad Exhibition 2025',
    },
    {
      year: '2024',
      src: '/images/home/exhibition-2024.png',
      alt: 'Visual Media Design Graduation Show 2024',
    },
    {
      year: '2023',
      src: '/images/home/exhibition-2023.png',
      alt: 'Kickoff 2023',
    },
  ],
}: ExhibitionSectionProps) {
  const { isMobile, isTablet } = useResponsive();

  const sectionGap = isMobile ? GAP.mobile : isTablet ? GAP.tablet : GAP.desktop;
  const sectionMarginBottom = isMobile ? '40px' : isTablet ? '60px' : '80px';
  const titleFontSize = isMobile ? '20px' : isTablet ? '24px' : '32px';
  const cardGap = isMobile ? GAP.mobile : isTablet ? GAP.tablet : GAP.desktop;

  // Number of visible cards per viewport
  const visibleCount = isMobile ? 1 : isTablet ? 2 : 3;
  const canDrag = items.length > visibleCount;

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    currentX: 0,
    startTranslate: 0,
    velocity: 0,
    lastX: 0,
    lastTime: 0,
  });

  const [isDragging, setIsDragging] = useState(false);

  // Get current translateX using GSAP's internal state
  const getCurrentTranslate = useCallback(() => {
    if (!trackRef.current) return 0;
    return gsap.getProperty(trackRef.current, 'x') as number;
  }, []);

  // Calculate max drag distance
  const getMaxTranslate = useCallback(() => {
    if (!containerRef.current || !trackRef.current) return 0;
    const containerWidth = containerRef.current.offsetWidth;
    const trackWidth = trackRef.current.scrollWidth;
    return Math.min(0, containerWidth - trackWidth);
  }, []);

  // Clamp and animate to position
  const animateTo = useCallback((x: number, duration = 0.4) => {
    if (!trackRef.current) return;
    const maxTranslate = getMaxTranslate();
    const clamped = Math.max(maxTranslate, Math.min(0, x));
    gsap.to(trackRef.current, {
      x: clamped,
      duration,
      ease: 'power3.out',
    });
  }, [getMaxTranslate]);

  // Mouse handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!canDrag) return;
    const state = dragState.current;
    state.isDragging = true;
    state.startX = e.clientX;
    state.currentX = e.clientX;
    state.startTranslate = getCurrentTranslate();
    state.velocity = 0;
    state.lastX = e.clientX;
    state.lastTime = Date.now();
    setIsDragging(true);

    // Stop any ongoing animation
    if (trackRef.current) gsap.killTweensOf(trackRef.current);

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [canDrag, getCurrentTranslate]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const state = dragState.current;
    if (!state.isDragging || !trackRef.current) return;

    const dx = e.clientX - state.startX;
    const newX = state.startTranslate + dx;
    const maxTranslate = getMaxTranslate();

    // Rubber-band effect at edges
    let clampedX: number;
    if (newX > 0) {
      clampedX = newX * 0.3; // Resistance at left edge
    } else if (newX < maxTranslate) {
      clampedX = maxTranslate + (newX - maxTranslate) * 0.3; // Resistance at right edge
    } else {
      clampedX = newX;
    }

    gsap.set(trackRef.current, { x: clampedX });

    // Track velocity for momentum
    const now = Date.now();
    const dt = now - state.lastTime;
    if (dt > 0) {
      state.velocity = (e.clientX - state.lastX) / dt * 1000; // px/s
    }
    state.lastX = e.clientX;
    state.lastTime = now;
    state.currentX = e.clientX;
  }, [getMaxTranslate]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const state = dragState.current;
    if (!state.isDragging) return;
    state.isDragging = false;
    setIsDragging(false);

    const dx = e.clientX - state.startX;

    // If barely moved (click, not drag), keep current position
    if (Math.abs(dx) < 5) return;

    const currentTranslate = getCurrentTranslate();

    // Apply momentum
    const momentum = state.velocity * 0.3; // 300ms of momentum
    const targetX = currentTranslate + momentum;

    animateTo(targetX, Math.abs(momentum) > 500 ? 0.6 : 0.4);
  }, [getCurrentTranslate, animateTo]);

  // Prevent default drag on images
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const preventDrag = (e: Event) => e.preventDefault();
    track.addEventListener('dragstart', preventDrag);
    return () => track.removeEventListener('dragstart', preventDrag);
  }, []);

  return (
    <section
      id="exhibition"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${sectionGap}px`,
        width: '100%',
        marginBottom: sectionMarginBottom,
      }}
    >
      {/* Exhibition Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #141414ff',
          paddingBottom: '20px',
        }}
      >
        <h2
          style={{
            fontSize: titleFontSize,
            fontWeight: '700',
            fontFamily: 'Helvetica',
            color: '#141414ff',
            margin: 0,
          }}
        >
          Exhibition
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {canDrag && (
            <span
              style={{
                fontSize: '12px',
                fontWeight: '400',
                fontFamily: 'Helvetica',
                color: '#999',
              }}
            >
              ← drag →
            </span>
          )}
          <a
            href="#"
            style={{
              fontSize: '14px',
              fontWeight: '400',
              fontFamily: 'Helvetica',
              color: '#141414ff',
              textDecoration: 'none',
            }}
          >
            More →
          </a>
        </div>
      </div>

      {/* Exhibition Items - Horizontal Scrollable Track */}
      <div
        ref={containerRef}
        style={{
          overflow: 'hidden',
          width: '100%',
          cursor: canDrag ? (isDragging ? 'grabbing' : 'grab') : 'default',
          touchAction: canDrag ? 'pan-y' : 'auto',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: `${cardGap}px`,
            willChange: canDrag ? 'transform' : 'auto',
          }}
        >
          {items.map((item, idx) => {
            // Card width: fill visible area accounting for gaps
            const gapTotal = (visibleCount - 1) * cardGap;
            const cardWidthCalc = `calc((100% - ${gapTotal}px) / ${visibleCount})`;

            return (
              <div
                key={idx}
                style={{
                  flex: `0 0 ${cardWidthCalc}`,
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  userSelect: 'none',
                }}
              >
                {/* Year Indicator */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '400',
                      fontFamily: 'Helvetica',
                      color: '#141414ff',
                    }}
                  >
                    {item.year}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 14L14 2M14 2H6M14 2V10"
                      stroke="#141414ff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Exhibition Image */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '9/13',
                    backgroundColor: '#f5f5f5ff',
                    overflow: 'hidden',
                    borderRadius: '0',
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                      objectFit: 'cover',
                      pointerEvents: 'none',
                    }}
                    priority={idx === 0}
                    draggable={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
