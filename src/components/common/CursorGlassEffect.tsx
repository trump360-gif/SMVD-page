'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  life: number;
  maxLife: number;
  size: number;
}

export function CursorGlassEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | undefined>(undefined);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas 설정
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const createParticles = (x: number, y: number) => {
      const particleCount = Math.random() * 2 + 2; // 2-4개

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.random() * Math.PI * 2);
        const velocity = Math.random() * 0.5 + 0.5;

        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * velocity * 0.3,
          vy: Math.sin(angle) * velocity + 0.8, // 아래쪽으로 강하게
          opacity: Math.random() * 0.3 + 0.2, // 0.2-0.5 (투명한 유리)
          life: 0,
          maxLife: Math.random() * 40 + 60, // 60-100 프레임
          size: Math.random() * 1.5 + 1.5, // 1.5-3px (섬세한 유리 입자)
        });
      }
    };

    const animate = () => {
      // Canvas 초기화 (반투명)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 입자 업데이트 및 렌더링
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const particle = particlesRef.current[i];

        // 생명주기 업데이트
        particle.life++;
        const lifeRatio = particle.life / particle.maxLife;

        // 투명도 감소 (페이드아웃)
        particle.opacity = (1 - lifeRatio) * particle.opacity;

        // 위치 업데이트
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 중력 효과
        particle.vy += 0.1;

        // 렌더링 (투명한 청록색 유리 입자)
        ctx.fillStyle = `rgba(100, 220, 200, ${particle.opacity})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // 생명이 다한 입자 제거
        if (particle.life >= particle.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      // 마우스 이동할 때마다 입자 생성
      createParticles(e.clientX, e.clientY);
    };

    // 이벤트 리스너 등록
    window.addEventListener('mousemove', handleMouseMove);

    // 애니메이션 시작
    animationFrameId.current = requestAnimationFrame(animate);

    // 윈도우 리사이즈 처리
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId.current!);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 40,
      }}
    />
  );
}
