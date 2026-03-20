import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import * as THREE from 'three';
import { mountainDepth, galaxyDepth } from './depthMaps';

export function WireframeLandscape() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const [enabled, setEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('stauf-wireframe') !== 'off';
    }
    return true;
  });
  const { theme } = useTheme();
  const dk = theme === 'dark';
  const cleanupRef = useRef<(() => void) | null>(null);

  const toggleWireframe = () => {
    setEnabled(prev => {
      const next = !prev;
      localStorage.setItem('stauf-wireframe', next ? 'on' : 'off');
      return next;
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    if (!enabled || !containerRef.current) {
      if (cleanupRef.current) cleanupRef.current();
      return;
    }

    const container = containerRef.current;
    let W = window.innerWidth;
    let H = window.innerHeight;

    const depthMap = dk ? galaxyDepth : mountainDepth;
    const dSize = depthMap.size;

    // Scene
    const scene = new THREE.Scene();

    // Orthographic camera — perfectly aligned with screen, no perspective distortion
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Plane fills entire screen (-1 to 1 in ortho)
    const segs = dSize - 1;
    const geometry = new THREE.PlaneGeometry(2, 2, segs, segs);

    // Apply depth as Z displacement from AI depth map
    const positions = geometry.attributes.position;
    const baseZ = new Float32Array(positions.count);

    for (let i = 0; i < positions.count; i++) {
      const col = i % dSize;
      const row = Math.floor(i / dSize);
      const depth = depthMap.data[row * dSize + col] || 0;
      const z = depth * 0.15; // subtle Z push — visible when camera tilts
      positions.setZ(i, z);
      baseZ[i] = z;
    }
    positions.needsUpdate = true;

    // Shader material — wireframe that glows near mouse
    const material = new THREE.ShaderMaterial({
      wireframe: true,
      transparent: true,
      uniforms: {
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uColor: { value: dk ? new THREE.Color(0x2dd4bf) : new THREE.Color(0x0d6450) },
        uBaseOpacity: { value: dk ? 0.05 : 0.035 },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vDepth;
        void main() {
          vUv = uv;
          vDepth = position.z / 0.15;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec2 uMouse;
        uniform vec3 uColor;
        uniform float uBaseOpacity;
        uniform float uTime;
        varying vec2 vUv;
        varying float vDepth;
        void main() {
          float dist = distance(vUv, uMouse);
          float mouseGlow = smoothstep(0.25, 0.0, dist);
          float depthGlow = vDepth * 0.03;
          float pulse = sin(uTime + vUv.x * 20.0 + vUv.y * 15.0) * 0.008;
          float opacity = uBaseOpacity + depthGlow + mouseGlow * 0.3 + pulse;
          gl_FragColor = vec4(uColor, clamp(opacity, 0.0, 0.6));
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / W, y: 1 - e.clientY / H };
    };
    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      renderer.setSize(W, H);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let animId = 0;
    let time = 0;
    let camAngleX = 0;
    let camAngleY = 0;

    const animate = () => {
      time += 0.003;

      // Subtle breathing on vertices
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const wave = Math.sin(time * 2 + x * 8 + y * 6) * 0.002;
        positions.setZ(i, baseZ[i] + wave);
      }
      positions.needsUpdate = true;

      // Camera: subtle auto-rotation to always reveal some depth
      camAngleX = Math.sin(time * 0.5) * 0.03;
      camAngleY = Math.cos(time * 0.4) * 0.02;

      // Plus mouse influence on camera angle
      const mx = (mouseRef.current.x - 0.5) * 0.06;
      const my = (mouseRef.current.y - 0.5) * 0.04;

      camera.position.x = camAngleX + mx;
      camera.position.y = camAngleY + my;
      camera.position.z = 5;
      camera.lookAt(0, 0, 0);

      // Update shader uniforms
      material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      material.uniforms.uTime.value = time * 5;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    cleanupRef.current = () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };

    return () => { if (cleanupRef.current) cleanupRef.current(); };
  }, [enabled, dk]);

  return (
    <>
      {enabled && (
        <div ref={containerRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
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
