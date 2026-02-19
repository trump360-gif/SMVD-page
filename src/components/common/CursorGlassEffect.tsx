'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function CursorGlassEffect() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glassIndicatorRef = useRef<HTMLDivElement | null>(null);
  const isClickableRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 커서 숨김 스타일 생성
    const style = document.createElement('style');
    style.id = 'cursor-glass-effect-style';
    style.textContent = `
      .cursor-glass-hidden * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    // 글래스 인디케이터 생성
    const glassIndicator = document.createElement('div');
    glassIndicator.style.position = 'fixed';
    glassIndicator.style.width = '30px';
    glassIndicator.style.height = '30px';
    glassIndicator.style.borderRadius = '50%';
    glassIndicator.style.backgroundColor = 'rgba(120, 120, 120, 0.8)';
    glassIndicator.style.pointerEvents = 'none';
    glassIndicator.style.zIndex = '50';
    glassIndicator.style.opacity = '0';
    glassIndicator.style.transform = 'translate(-50%, -50%)';
    glassIndicator.style.backdropFilter = 'blur(12px) brightness(1.15)';
    glassIndicator.style.boxShadow = 'inset 0 0 15px rgba(180, 180, 180, 0.4), 0 0 20px rgba(120, 120, 120, 0.3)';
    glassIndicator.style.transition = 'none';

    container.appendChild(glassIndicator);
    glassIndicatorRef.current = glassIndicator;

    // 클릭 가능한 요소 확인
    const isClickable = (element: Element): boolean => {
      const tagName = element.tagName.toLowerCase();
      const clickableElements = ['button', 'a', 'input', 'select', 'textarea'];

      if (clickableElements.includes(tagName)) return true;
      if (element.getAttribute('role') === 'button') return true;
      if (element.getAttribute('onclick')) return true;
      if (element.hasAttribute('clickable')) return true;

      // 클릭 이벤트 리스너 확인
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.cursor === 'pointer') return true;

      return false;
    };

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
      const target = e.target as HTMLElement;
      const clickable = isClickable(target);
      isClickableRef.current = clickable;

      // 글래스 인디케이터 위치 업데이트 + 상태 전환
      if (glassIndicatorRef.current) {
        gsap.set(glassIndicatorRef.current, {
          left: e.clientX,
          top: e.clientY,
        });

        if (clickable) {
          // 클릭 가능 → 글래스 표시 + 커서 숨김
          gsap.to(glassIndicatorRef.current, {
            opacity: 0.5,
            duration: 0.2,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          document.documentElement.classList.add('cursor-glass-hidden');
        } else {
          // 클릭 불가능 → 글래스 숨김 + 커서 표시
          gsap.to(glassIndicatorRef.current, {
            opacity: 0,
            duration: 0.2,
            ease: 'power2.out',
            overwrite: 'auto',
          });
          document.documentElement.classList.remove('cursor-glass-hidden');
        }
      }

      // 파티클 생성 (항상)
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
      // 커서 복원
      document.documentElement.classList.remove('cursor-glass-hidden');
      const styleElement = document.getElementById('cursor-glass-effect-style');
      if (styleElement) {
        styleElement.remove();
      }
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
