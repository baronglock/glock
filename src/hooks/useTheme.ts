import { useState, useCallback, useEffect } from 'react';

export type Theme = 'dark' | 'light';

/* ── Neural network SVG pattern ── */
function createNeuralBg(nodeOpacity: number, lineOpacity: number, faintOpacity: number): string {
  const r = 155, g = 27, b = 48;
  const n = `rgba(${r},${g},${b},${nodeOpacity})`;
  const l = `rgba(${r},${g},${b},${lineOpacity})`;
  const f = `rgba(${r},${g},${b},${faintOpacity})`;
  const svg = `<svg width='220' height='220' xmlns='http://www.w3.org/2000/svg'>` +
    /* edge nodes — match across tiles */
    `<circle cx='0' cy='55' r='1.5' fill='${n}'/>` +
    `<circle cx='220' cy='55' r='1.5' fill='${n}'/>` +
    `<circle cx='0' cy='165' r='1.5' fill='${n}'/>` +
    `<circle cx='220' cy='165' r='1.5' fill='${n}'/>` +
    `<circle cx='75' cy='0' r='1.5' fill='${n}'/>` +
    `<circle cx='75' cy='220' r='1.5' fill='${n}'/>` +
    `<circle cx='160' cy='0' r='1.5' fill='${n}'/>` +
    `<circle cx='160' cy='220' r='1.5' fill='${n}'/>` +
    /* interior nodes */
    `<circle cx='55' cy='85' r='2' fill='${n}'/>` +
    `<circle cx='110' cy='42' r='1.8' fill='${n}'/>` +
    `<circle cx='170' cy='95' r='2' fill='${n}'/>` +
    `<circle cx='85' cy='148' r='1.8' fill='${n}'/>` +
    `<circle cx='140' cy='168' r='2' fill='${n}'/>` +
    `<circle cx='38' cy='190' r='1.5' fill='${n}'/>` +
    `<circle cx='195' cy='38' r='1.5' fill='${n}'/>` +
    /* main connections */
    `<line x1='0' y1='55' x2='55' y2='85' stroke='${l}' stroke-width='0.6'/>` +
    `<line x1='55' y1='85' x2='110' y2='42' stroke='${l}' stroke-width='0.6'/>` +
    `<line x1='110' y1='42' x2='170' y2='95' stroke='${l}' stroke-width='0.6'/>` +
    `<line x1='110' y1='42' x2='75' y2='0' stroke='${f}' stroke-width='0.5'/>` +
    `<line x1='110' y1='42' x2='160' y2='0' stroke='${f}' stroke-width='0.5'/>` +
    `<line x1='170' y1='95' x2='220' y2='55' stroke='${l}' stroke-width='0.6'/>` +
    `<line x1='170' y1='95' x2='195' y2='38' stroke='${f}' stroke-width='0.5'/>` +
    `<line x1='170' y1='95' x2='220' y2='165' stroke='${f}' stroke-width='0.5'/>` +
    `<line x1='55' y1='85' x2='85' y2='148' stroke='${l}' stroke-width='0.6'/>` +
    `<line x1='85' y1='148' x2='140' y2='168' stroke='${l}' stroke-width='0.6'/>` +
    `<line x1='140' y1='168' x2='220' y2='165' stroke='${f}' stroke-width='0.5'/>` +
    `<line x1='85' y1='148' x2='0' y2='165' stroke='${f}' stroke-width='0.5'/>` +
    `<line x1='140' y1='168' x2='160' y2='220' stroke='${l}' stroke-width='0.6'/>` +
    `<line x1='38' y1='190' x2='75' y2='220' stroke='${f}' stroke-width='0.5'/>` +
    `<line x1='38' y1='190' x2='0' y2='165' stroke='${f}' stroke-width='0.5'/>` +
    `<line x1='38' y1='190' x2='85' y2='148' stroke='${l}' stroke-width='0.6'/>` +
    `<line x1='195' y1='38' x2='220' y2='55' stroke='${f}' stroke-width='0.5'/>` +
    `<line x1='55' y1='85' x2='0' y2='55' stroke='${f}' stroke-width='0.5'/>` +
    `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export const dark = {
  bg: '#0a0a0f',
  bgCard: 'rgba(20, 20, 30, 0.6)',
  bgAlt: 'rgba(16, 16, 24, 0.4)',
  border: 'rgba(255,255,255,0.06)',
  borderHover: 'rgba(155, 27, 48, 0.3)',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  white: '#ffffff',
  brand: '#9b1b30',
  brandLight: '#c2314a',
  brandDark: '#7a1526',
  gold: '#d4a574',
  goldLight: '#e0be98',
  glass: 'rgba(16, 16, 24, 0.75)',
  glassBorder: 'rgba(155, 27, 48, 0.15)',
  glassCard: 'rgba(20, 20, 30, 0.6)',
  glassCardBorder: 'rgba(255, 255, 255, 0.06)',
  inputBg: 'rgba(20,20,30,0.6)',
  shadow: 'rgba(0,0,0,0.4)',
  neuralBg: createNeuralBg(0.35, 0.2, 0.12),
  orbBrand: 'rgba(155,27,48,0.07)',
  orbGold: 'rgba(212,165,116,0.05)',
  badgeBg: 'rgba(255,255,255,0.03)',
  badgeBorder: 'rgba(255,255,255,0.06)',
  tagBg: 'rgba(255,255,255,0.04)',
  tagBorder: 'rgba(255,255,255,0.06)',
  footerBorder: '#475569',
};

export const light = {
  bg: '#faf9f7',
  bgCard: 'rgba(255, 255, 255, 0.7)',
  bgAlt: 'rgba(245, 243, 240, 0.6)',
  border: 'rgba(0,0,0,0.08)',
  borderHover: 'rgba(155, 27, 48, 0.25)',
  text: '#1e293b',
  textMuted: '#475569',
  textDim: '#64748b',
  white: '#0f172a',
  brand: '#9b1b30',
  brandLight: '#b82640',
  brandDark: '#7a1526',
  gold: '#a07040',
  goldLight: '#c49060',
  glass: 'rgba(255, 255, 255, 0.8)',
  glassBorder: 'rgba(155, 27, 48, 0.12)',
  glassCard: 'rgba(255, 255, 255, 0.65)',
  glassCardBorder: 'rgba(0, 0, 0, 0.06)',
  inputBg: 'rgba(255,255,255,0.8)',
  shadow: 'rgba(0,0,0,0.08)',
  neuralBg: createNeuralBg(0.22, 0.13, 0.07),
  orbBrand: 'rgba(155,27,48,0.05)',
  orbGold: 'rgba(212,165,116,0.06)',
  badgeBg: 'rgba(0,0,0,0.04)',
  badgeBorder: 'rgba(0,0,0,0.08)',
  tagBg: 'rgba(0,0,0,0.04)',
  tagBorder: 'rgba(0,0,0,0.08)',
  footerBorder: '#94a3b8',
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('glock-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  const colors = theme === 'dark' ? dark : light;

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('glock-theme', next);
      return next;
    });
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = colors.bg;
    document.body.style.color = colors.text;
  }, [colors]);

  return { theme, colors, toggleTheme };
}
