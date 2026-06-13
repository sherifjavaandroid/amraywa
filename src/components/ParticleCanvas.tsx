import { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const PARTICLE_COUNT = 80;
const CONNECTION_DISTANCE = 150;
const RED = '#e53935';
const CYAN = '#00e5ff';

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameIdRef = useRef<number>(0);
  const wRef = useRef(0);
  const hRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function init() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      wRef.current = w;
      hRef.current = h;
      canvas!.width = w;
      canvas!.height = h;

      const particles: Particle[] = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          color: Math.random() > 0.5 ? RED : CYAN,
        });
      }
      particlesRef.current = particles;
    }

    function draw() {
      const w = wRef.current;
      const h = hRef.current;
      const particles = particlesRef.current;

      if (!ctx) return;

      ctx.fillStyle = 'rgba(5, 5, 8, 0.15)';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particles[i].x;
          const dy = particles[j].y - particles[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const opacity = 1 - dist / CONNECTION_DISTANCE;
            const gradient = ctx.createLinearGradient(
              particles[i].x,
              particles[i].y,
              particles[j].x,
              particles[j].y
            );

            const r1 = particles[i].color === RED ? 229 : 0;
            const g1 = particles[i].color === RED ? 57 : 229;
            const b1 = particles[i].color === RED ? 53 : 255;
            const r2 = particles[j].color === RED ? 229 : 0;
            const g2 = particles[j].color === RED ? 57 : 229;
            const b2 = particles[j].color === RED ? 53 : 255;

            gradient.addColorStop(0, `rgba(${r1}, ${g1}, ${b1}, ${opacity * 0.4})`);
            gradient.addColorStop(1, `rgba(${r2}, ${g2}, ${b2}, ${opacity * 0.4})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].x += particles[i].vx;
        particles[i].y += particles[i].vy;

        if (particles[i].x < -50 || particles[i].x > w + 50) {
          particles[i].vx *= -1;
        }
        if (particles[i].y < -50 || particles[i].y > h + 50) {
          particles[i].vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(particles[i].x, particles[i].y, particles[i].radius, 0, Math.PI * 2);
        ctx.fillStyle = particles[i].color;
        ctx.fill();

        ctx.shadowBlur = 8;
        ctx.shadowColor = particles[i].color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameIdRef.current = requestAnimationFrame(draw);
    }

    function resize() {
      wRef.current = window.innerWidth;
      hRef.current = window.innerHeight;
      canvas!.width = wRef.current;
      canvas!.height = hRef.current;
      init();
    }

    init();
    draw();

    window.addEventListener('resize', resize);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameIdRef.current);
      } else {
        draw();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
}
