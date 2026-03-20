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

    const scene = new THREE.Scene();

    // Camera: perspective, straight ahead
    const fov = 50;
    const camera = new THREE.PerspectiveCamera(fov, W / H, 0.1, 100);
    const camZ = 5;
    camera.position.set(0, 0, camZ);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Plane sized to fill viewport
    const vFovRad = THREE.MathUtils.degToRad(fov / 2);
    const planeH = 2 * camZ * Math.tan(vFovRad);
    const planeW = planeH * (W / H);

    // LESS segments = more spaced grid (60 instead of 150)
    const gridSize = 60;
    const geometry = new THREE.PlaneGeometry(planeW * 1.05, planeH * 1.05, gridSize, gridSize);

    const positions = geometry.attributes.position;
    const basePositions = new Float32Array(positions.count * 3);
    const displacementScale = planeH * 0.15;
    const gSize = gridSize + 1;

    // Sample depth map and displace Y
    const depthValues = new Float32Array(positions.count);
    for (let i = 0; i < positions.count; i++) {
      const col = i % gSize;
      const row = Math.floor(i / gSize);
      const dCol = Math.min(Math.floor(col / gSize * dSize), dSize - 1);
      const dRow = Math.min(Math.floor(row / gSize * dSize), dSize - 1);
      const depth = depthMap.data[dRow * dSize + dCol] || 0;
      depthValues[i] = depth;

      const x = positions.getX(i);
      const y = positions.getY(i) + depth * displacementScale;

      positions.setY(i, y);
      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = 0;
    }
    positions.needsUpdate = true;

    // Depth as vertex attribute
    geometry.setAttribute('aDepth', new THREE.BufferAttribute(depthValues, 1));

    // Shader: wireframe visible only on terrain, mouse reveals more
    const material = new THREE.ShaderMaterial({
      wireframe: true,
      transparent: true,
      uniforms: {
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uColor: { value: dk ? new THREE.Color(0x2dd4bf) : new THREE.Color(0x0d6450) },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vDepth;
        attribute float aDepth;
        void main() {
          vUv = uv;
          vDepth = aDepth;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec2 uMouse;
        uniform vec3 uColor;
        uniform float uTime;
        varying vec2 vUv;
        varying float vDepth;
        void main() {
          // Only mountains: mid-range depth (not too close=trees, not too far=sky)
          if (vDepth < 0.2 || vDepth > 0.85) discard;

          float dist = distance(vUv, uMouse);
          float mouseGlow = smoothstep(0.3, 0.0, dist);
          // Peak visibility at mountain range depth (~0.4-0.7)
          float terrain = smoothstep(0.2, 0.4, vDepth) * smoothstep(0.85, 0.6, vDepth);
          float pulse = sin(uTime + vUv.x * 12.0 + vUv.y * 8.0) * 0.008;

          float opacity = (0.04 + terrain * 0.05 + mouseGlow * 0.35 + pulse);
          gl_FragColor = vec4(uColor, clamp(opacity, 0.0, 0.5));
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / W, y: 1 - e.clientY / H };
    };
    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let animId = 0;
    let time = 0;

    const animate = () => {
      time += 0.002;

      // Subtle breathing
      for (let i = 0; i < positions.count; i++) {
        const bx = basePositions[i * 3];
        const by = basePositions[i * 3 + 1];
        const wave = Math.sin(time * 2 + bx * 2 + by * 1.5) * 0.003;
        positions.setY(i, by + wave);
      }
      positions.needsUpdate = true;

      // Update shader
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
