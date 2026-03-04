import { useState, useCallback, useEffect } from 'react';

export type Theme = 'dark' | 'light';

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
  gridLine: 'rgba(155,27,48,0.08)',
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
  gridLine: 'rgba(155,27,48,0.1)',
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
