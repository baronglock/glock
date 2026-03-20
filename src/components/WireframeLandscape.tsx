import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { darkMesh, lightMesh } from './terrainData';

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

    const mesh = dk ? darkMesh : lightMesh;
    const { cols, rows, vertices } = mesh;

    let w = 0, h = 0;

    // Pre-computed projected positions
    let projected: { sx: number; sy: number; height: number }[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      project();
    };

    const project = () => {
      // 3D perspective projection
      // Camera looking slightly down at the terrain
      const fov = 1.2;
      const cameraY = -0.3; // slightly above
      const cameraZ = 1.8; // distance from terrain
      const heightScale = dk ? 0.25 : 0.35; // how much height affects Y

      projected = vertices.map(([vx, vy, vh]) => {
        // Convert percentage to -1..1 range
        const x3d = (vx / 100 - 0.5) * 2;
        const y3d = (vy / 100 - 0.5) * 2;
        const z3d = vh * heightScale;

        // Simple perspective: things further (higher y3d) appear smaller/higher
        const depth = y3d + cameraZ;
        const perspScale = fov / Math.max(depth, 0.1);

        const sx = w / 2 + x3d * perspScale * w * 0.5;
        const sy = h / 2 + (y3d - z3d + cameraY) * perspScale * h * 0.35;

        return { sx, sy, height: vh };
      });
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
      time += 0.004;
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const hasPointer = mx >= 0 && my >= 0;

      // Draw grid lines
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const idx = row * cols + col;
          const p = projected[idx];
          if (!p) continue;

          // Gentle wave on height
          const wave = Math.sin(time + col * 0.08 + row * 0.06) * 1.5;
          const px = p.sx;
          const py = p.sy + wave * (1 - p.height);

          // Mouse proximity
          let mouseInf = 0;
          if (hasPointer) {
            const dx = px - mx;
            const dy = py - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            mouseInf = Math.max(0, 1 - dist / 250);
            mouseInf *= mouseInf;
          }

          // Opacity based on height (terrain visible, sky fades)
          // For mountains: low brightness = terrain = visible | high = sky = hidden
          // For galaxy: medium brightness = nebula = visible | dark bg = hidden
          let terrainOpacity: number;
          if (dk) {
            // Galaxy: brighter areas (nebula) more visible
            terrainOpacity = p.height > 0.15 ? p.height * 0.8 : 0;
          } else {
            // Mountains: darker areas (terrain) more visible, sky fades
            terrainOpacity = p.height < 0.7 ? (1 - p.height) * 0.9 : 0;
          }

          const baseOp = terrainOpacity * (dk ? 0.06 : 0.05);
          const mouseOp = mouseInf * (dk ? 0.3 : 0.2);
          const opacity = baseOp + mouseOp;

          if (opacity < 0.005) continue;

          const color = dk
            ? `rgba(45,212,191,${opacity.toFixed(3)})`
            : `rgba(13,100,80,${opacity.toFixed(3)})`;

          const lineW = 0.4 + mouseInf * 1.2;

          // Horizontal line (to right neighbor)
          if (col < cols - 1) {
            const next = projected[idx + 1];
            if (next) {
              const npy = next.sy + Math.sin(time + (col+1) * 0.08 + row * 0.06) * 1.5 * (1 - next.height);
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(next.sx, npy);
              ctx.strokeStyle = color;
              ctx.lineWidth = lineW;
              ctx.stroke();
            }
          }

          // Vertical line (to bottom neighbor)
          if (row < rows - 1) {
            const below = projected[idx + cols];
            if (below) {
              const bpy = below.sy + Math.sin(time + col * 0.08 + (row+1) * 0.06) * 1.5 * (1 - below.height);
              ctx.beginPath();
              ctx.moveTo(px, py);
              ctx.lineTo(below.sx, bpy);
              ctx.strokeStyle = color;
              ctx.lineWidth = lineW;
              ctx.stroke();
            }
          }

          // Vertex point near mouse
          if (mouseInf > 0.3) {
            ctx.beginPath();
            ctx.arc(px, py, 0.8 + mouseInf * 2, 0, Math.PI * 2);
            ctx.fillStyle = dk
              ? `rgba(45,212,191,${(mouseInf * 0.5).toFixed(3)})`
              : `rgba(13,100,80,${(mouseInf * 0.4).toFixed(3)})`;
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
        aria-label={enabled ? 'Desativar wireframe' : 'Ativar wireframe'}
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
