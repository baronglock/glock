import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
// @ts-ignore
import Delaunator from 'delaunator';
import { darkPoints, lightPoints } from './landscapePoints';

export function WireframeLandscape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1, y: -1 });
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
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0;
    const srcPoints = dk ? darkPoints : lightPoints;

    // Scaled points with depth
    let scaled: { x: number; y: number; baseX: number; baseY: number; z: number }[] = [];
    let triangles: number[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;

      // Scale percentage points to pixel coordinates
      scaled = srcPoints.map(([px, py, pz]) => ({
        x: (px / 100) * w,
        y: (py / 100) * h,
        baseX: (px / 100) * w,
        baseY: (py / 100) * h,
        z: pz,
      }));

      // Compute Delaunay triangulation once
      const coords = scaled.flatMap(p => [p.baseX, p.baseY]);
      const delaunay = new Delaunator(coords);
      triangles = Array.from(delaunay.triangles);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1, y: -1 };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    resize();

    let time = 0;

    const draw = () => {
      time += 0.006;
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const hasPointer = mx >= 0 && my >= 0;

      // Animate points — gentle wave based on depth
      for (const p of scaled) {
        const wave = Math.sin(time + p.baseX * 0.003 + p.baseY * 0.002) * 2 * p.z;
        const wave2 = Math.cos(time * 0.7 - p.baseX * 0.002 + p.baseY * 0.003) * 1.5 * p.z;
        p.x = p.baseX + wave;
        p.y = p.baseY + wave2;
      }

      // Draw triangles
      for (let i = 0; i < triangles.length; i += 3) {
        const a = scaled[triangles[i]];
        const b = scaled[triangles[i + 1]];
        const c = scaled[triangles[i + 2]];
        if (!a || !b || !c) continue;

        // Triangle center
        const cx = (a.x + b.x + c.x) / 3;
        const cy = (a.y + b.y + c.y) / 3;
        const avgZ = (a.z + b.z + c.z) / 3;

        // Mouse distance to triangle center
        let mouseInfluence = 0;
        if (hasPointer) {
          const dx = cx - mx;
          const dy = cy - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          mouseInfluence = Math.max(0, 1 - dist / 250);
          mouseInfluence = mouseInfluence * mouseInfluence; // ease-in
        }

        // Opacity: stronger depth contrast + mouse boost
        const depthFactor = (1 - avgZ); // 0=far/bright, 1=close/dark
        const baseOp = dk ? 0.015 + depthFactor * 0.05 : 0.01 + depthFactor * 0.04;
        const mouseOp = mouseInfluence * (dk ? 0.25 : 0.18);
        const opacity = baseOp + mouseOp;

        if (opacity < 0.01) continue;

        const color = dk
          ? `rgba(45,212,191,${opacity.toFixed(3)})`
          : `rgba(13,100,80,${opacity.toFixed(3)})`;

        // Draw triangle edges
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(c.x, c.y);
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.4 + mouseInfluence * 0.8;
        ctx.stroke();

        // Fill triangle with very subtle color near mouse
        if (mouseInfluence > 0.4) {
          ctx.fillStyle = dk
            ? `rgba(45,212,191,${(mouseInfluence * 0.04).toFixed(3)})`
            : `rgba(13,100,80,${(mouseInfluence * 0.03).toFixed(3)})`;
          ctx.fill();
        }
      }

      // Draw vertex points near mouse
      if (hasPointer) {
        for (const p of scaled) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            const influence = Math.max(0, 1 - dist / 200);
            if (influence > 0.2) {
              ctx.beginPath();
              ctx.arc(p.x, p.y, 0.8 + influence * 2.5, 0, Math.PI * 2);
              ctx.fillStyle = dk
                ? `rgba(45,212,191,${(influence * 0.5).toFixed(3)})`
                : `rgba(13,100,80,${(influence * 0.4).toFixed(3)})`;
              ctx.fill();
            }
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
      document.removeEventListener('mouseleave', handleMouseLeave);
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
      <button
        onClick={toggleWireframe}
        aria-label={enabled ? 'Desativar efeito 3D' : 'Ativar efeito 3D'}
        style={{
          position: 'fixed', bottom: 24, left: 24, zIndex: 50,
          width: 36, height: 36, borderRadius: '50%',
          background: enabled ? 'rgba(45,212,191,0.15)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${enabled ? 'rgba(45,212,191,0.3)' : 'rgba(255,255,255,0.1)'}`,
          color: enabled ? (dk ? '#2dd4bf' : '#0d9488') : (dk ? '#475569' : '#94a3b8'),
          cursor: 'pointer', fontSize: 14,
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
