import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';

export function WireframeLandscape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const [enabled, setEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('stauf-wireframe') !== 'off';
    }
    return true;
  });
  const { theme } = useTheme();
  const dk = theme === 'dark';
  const animRef = useRef<number>(0);

  const toggleWireframe = () => {
    setEnabled(prev => {
      const next = !prev;
      localStorage.setItem('stauf-wireframe', next ? 'on' : 'off');
      return next;
    });
  };

  useEffect(() => {
    if (!enabled) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0;
    const cols = 45;
    const rows = 30;
    const points: { x: number; y: number; baseY: number; z: number }[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      initPoints();
    };

    const initPoints = () => {
      points.length = 0;
      const spacingX = w / (cols - 1);
      const spacingY = h / (rows - 1);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * spacingX;
          const baseY = row * spacingY;
          // Create depth: center rows have more "depth" (lower z)
          const centerDist = Math.abs(row / rows - 0.5) * 2;
          const z = 0.3 + centerDist * 0.7; // 0.3 at center (far), 1.0 at edges (close)
          points.push({ x, y: baseY, baseY, z });
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / w, y: e.clientY / h };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current = { x: e.touches[0].clientX / w, y: e.touches[0].clientY / h };
      }
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    resize();

    let time = 0;

    const draw = () => {
      time += 0.008;
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x * w;
      const my = mouseRef.current.y * h;

      // Update point positions with wave
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const col = i % cols;
        const row = Math.floor(i / cols);

        // Gentle wave animation
        const wave = Math.sin(time + col * 0.15 + row * 0.1) * 3 * p.z;
        const wave2 = Math.cos(time * 0.7 + col * 0.1 - row * 0.15) * 2 * p.z;
        p.y = p.baseY + wave + wave2;
      }

      // Draw connections
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const idx = row * cols + col;
          const p = points[idx];

          // Distance to mouse
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseRadius = 200;
          const mouseInfluence = Math.max(0, 1 - dist / mouseRadius);

          // Base opacity + mouse boost
          const baseOpacity = dk ? 0.04 : 0.03;
          const opacity = baseOpacity + mouseInfluence * (dk ? 0.15 : 0.1);

          const color = dk
            ? `rgba(45,212,191,${opacity})`
            : `rgba(13,100,80,${opacity})`;

          // Horizontal line
          if (col < cols - 1) {
            const next = points[idx + 1];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(next.x, next.y);
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.5 + mouseInfluence * 1;
            ctx.stroke();
          }

          // Vertical line
          if (row < rows - 1) {
            const below = points[idx + cols];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(below.x, below.y);
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.5 + mouseInfluence * 1;
            ctx.stroke();
          }

          // Diagonal (creates triangles)
          if (col < cols - 1 && row < rows - 1) {
            const diag = points[idx + cols + 1];
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(diag.x, diag.y);
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.3 + mouseInfluence * 0.5;
            ctx.stroke();
          }

          // Draw node point near mouse
          if (mouseInfluence > 0.3) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1 + mouseInfluence * 2, 0, Math.PI * 2);
            ctx.fillStyle = dk
              ? `rgba(45,212,191,${mouseInfluence * 0.5})`
              : `rgba(13,100,80,${mouseInfluence * 0.4})`;
            ctx.fill();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [enabled, dk]);

  return (
    <>
      {enabled && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'fixed', inset: 0, zIndex: 0,
            pointerEvents: 'none', width: '100%', height: '100%',
          }}
        />
      )}
      {/* Toggle button */}
      <button
        onClick={toggleWireframe}
        aria-label={enabled ? 'Desativar efeito 3D' : 'Ativar efeito 3D'}
        style={{
          position: 'fixed', bottom: 24, left: 24, zIndex: 50,
          width: 36, height: 36, borderRadius: '50%',
          background: enabled ? 'rgba(45,212,191,0.15)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${enabled ? 'rgba(45,212,191,0.3)' : 'rgba(255,255,255,0.1)'}`,
          color: enabled ? (dk ? '#2dd4bf' : '#0d9488') : (dk ? '#475569' : '#94a3b8'),
          cursor: 'pointer', fontSize: 14, fontWeight: 600,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s',
        }}
        title={enabled ? 'Desativar wireframe' : 'Ativar wireframe'}
      >
        ◇
      </button>
    </>
  );
}
