'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function CursorGlassEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createParticle = (x: number, y: number) => {
      // 파티클 DOM 생성
      const particle = document.createElement('div');
      const size = Math.random() * 3 + 2; // 2-5px
      const offsetX = (Math.random() - 0.5) * 60; // 좌우 분산
      const offsetY = Math.random() * 30; // 아래로만
      const duration = Math.random() * 0.8 + 0.6; // 0.6-1.4s

      particle.style.position = 'fixed';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.borderRadius = '50%';
      particle.style.backgroundColor = 'rgb(40, 160, 150)';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '40';
      particle.style.opacity = String(Math.random() * 0.3 + 0.2);

      container.appendChild(particle);

      // GSAP 애니메이션 (부드러운 이징)
      gsap.to(particle, {
        duration,
        y: offsetY + 100, // 아래로 떨어짐
        x: offsetX, // 좌우 분산
        opacity: 0, // 페이드아웃
        ease: 'power2.out', // 부드러운 이징
        onComplete: () => {
          particle.remove(); // 애니메이션 끝나면 제거
        },
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const particleCount = Math.random() * 4 + 4; // 4-8개

      for (let i = 0; i < particleCount; i++) {
        // 약간의 딜레이를 주어 자연스러운 효과
        setTimeout(() => {
          createParticle(e.clientX, e.clientY);
        }, i * 15); // 15ms 간격
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      // 남은 파티클 정리
      gsap.killTweensOf('div');
      container.innerHTML = '';
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 40,
      }}
    />
  );
}
