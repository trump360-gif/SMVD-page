'use client';

import { useState, useEffect, useRef } from 'react';

export function CursorGlassEffect() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const animationFrameId = useRef<number | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // RAF로 60fps 제한
      cancelAnimationFrame(animationFrameId.current!);
      animationFrameId.current = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });

        if (!isActive) setIsActive(true);

        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setIsActive(false);
        }, 2000);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId.current!);
      clearTimeout(timeoutRef.current);
    };
  }, [isActive]);

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x - 40,
        top: position.y - 40,
        width: 80,
        height: 80,
        pointerEvents: 'none',
        zIndex: 40,

        // ✨ 글래스모피즘 (유리 느낌)
        backdropFilter: 'blur(12px) brightness(1.15)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '50%',

        // 부드러운 엣지 (그라데이션)
        boxShadow: `
          inset 0 0 20px rgba(255, 255, 255, 0.3),
          0 0 30px rgba(255, 255, 255, 0.1)
        `,

        // 부드러운 애니메이션
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.3s ease-out',

        // 성능 최적화
        transform: `translate3d(0, 0, 0)`,
        willChange: 'opacity',
      }}
    />
  );
}
