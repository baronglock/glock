import { useState, useCallback, useEffect } from 'react';

export type Theme = 'dark' | 'light';

/* ══════════════════════════════════════════════════════
   COSMIC NEURAL PATTERN
   ──────────────────────────────────────────────────────
   Stars + Neural connections + Astrological positioning

   Traditional astrology positions for business success:
   ─ Regulus (α Leo)        → authority, leadership, ambition
   ─ Spica (α Virgo)        → wealth, harvest, prosperity
   ─ Jupiter (benefic)      → expansion, abundance, fortune
   ─ Aldebaran (α Taurus)   → material success, persistence
   ─ Vega (α Lyra)          → charisma, artistic success
   ─ MC / 10th House (top)  → career peak, public image
   ─ 2nd House (lower-left) → wealth, resources
   ─ 11th House (upper-rt)  → goals, networks, future gains

   These are placed as bright "anchor nodes" in the tile,
   connected by neural lines forming a prosperity sigil.
   Smaller stars fill the cosmic background.
   ══════════════════════════════════════════════════════ */

function createCosmicPattern(theme: 'dark' | 'light'): string {
  const dk = theme === 'dark';

  /* ── Color palette ── */
  const starBright  = dk ? 'rgba(255,255,255,0.75)' : 'rgba(13,148,136,0.18)';
  const starMed     = dk ? 'rgba(255,255,255,0.35)' : 'rgba(13,148,136,0.1)';
  const starDim     = dk ? 'rgba(255,255,255,0.12)' : 'rgba(13,148,136,0.05)';
  const starTiny    = dk ? 'rgba(255,255,255,0.07)' : 'rgba(13,148,136,0.03)';
  const nodeBrand   = dk ? 'rgba(13,148,136,0.55)'  : 'rgba(13,148,136,0.22)';
  const nodeGold    = dk ? 'rgba(45,212,191,0.5)'    : 'rgba(45,212,191,0.18)';
  const line        = dk ? 'rgba(13,148,136,0.18)'   : 'rgba(13,148,136,0.09)';
  const lineFaint   = dk ? 'rgba(13,148,136,0.09)'   : 'rgba(13,148,136,0.045)';
  const lineGold    = dk ? 'rgba(45,212,191,0.12)'   : 'rgba(45,212,191,0.06)';

  /* ── Astrological anchor positions (450×450 tile) ──
     Based on whole-sign house positions projected onto 2D:
     MC (10th) = top center, ASC (1st) = left center,
     2nd = lower-left, 11th = upper-right, etc.           */
  const astro = {
    regulus:   { x: 225, y: 42,  r: 2.5 }, // MC – leadership peak
    spica:     { x: 78,  y: 340, r: 2.2 }, // 2nd house – wealth
    jupiter:   { x: 370, y: 98,  r: 2.8 }, // 11th house – expansion
    aldebaran: { x: 130, y: 195, r: 2.0 }, // ASC/1st – material foundation
    vega:      { x: 340, y: 280, r: 2.2 }, // 7th – partnerships/charisma
    saturn:    { x: 55,  y: 110, r: 1.8 }, // 12th→1st cusp – discipline
    mercury:   { x: 290, y: 185, r: 1.8 }, // 6th – commerce/daily work
    venus:     { x: 180, y: 395, r: 2.0 }, // 3rd – value/attraction
  };

  /* ── Random-ish small stars (hand-placed for natural feel) ── */
  const stars = [
    { x: 15, y: 22, r: 0.8, c: starDim }, { x: 67, y: 8, r: 0.6, c: starTiny },
    { x: 145, y: 15, r: 1.0, c: starMed }, { x: 210, y: 5, r: 0.5, c: starTiny },
    { x: 310, y: 18, r: 0.7, c: starDim }, { x: 395, y: 10, r: 0.9, c: starDim },
    { x: 440, y: 35, r: 0.5, c: starTiny }, { x: 28, y: 65, r: 0.6, c: starTiny },
    { x: 100, y: 58, r: 1.1, c: starMed }, { x: 195, y: 75, r: 0.5, c: starTiny },
    { x: 265, y: 52, r: 0.7, c: starDim }, { x: 410, y: 60, r: 0.8, c: starDim },
    { x: 42, y: 142, r: 0.5, c: starTiny }, { x: 175, y: 130, r: 0.9, c: starDim },
    { x: 320, y: 140, r: 0.6, c: starTiny }, { x: 430, y: 145, r: 1.0, c: starMed },
    { x: 12, y: 205, r: 0.7, c: starDim }, { x: 200, y: 230, r: 0.5, c: starTiny },
    { x: 355, y: 215, r: 0.8, c: starDim }, { x: 445, y: 210, r: 0.6, c: starTiny },
    { x: 90, y: 265, r: 1.0, c: starMed }, { x: 165, y: 285, r: 0.5, c: starTiny },
    { x: 240, y: 270, r: 0.7, c: starDim }, { x: 410, y: 290, r: 0.6, c: starTiny },
    { x: 25, y: 320, r: 0.8, c: starDim }, { x: 305, y: 325, r: 0.5, c: starTiny },
    { x: 420, y: 340, r: 0.9, c: starDim }, { x: 50, y: 385, r: 0.6, c: starTiny },
    { x: 255, y: 380, r: 0.7, c: starDim }, { x: 350, y: 395, r: 1.0, c: starMed },
    { x: 115, y: 420, r: 0.5, c: starTiny }, { x: 200, y: 440, r: 0.8, c: starDim },
    { x: 380, y: 430, r: 0.6, c: starTiny }, { x: 445, y: 415, r: 0.7, c: starDim },
    { x: 15, y: 440, r: 0.9, c: starDim }, { x: 310, y: 445, r: 0.5, c: starTiny },
    /* edge stars for seamless tiling */
    { x: 0, y: 100, r: 0.7, c: starDim }, { x: 450, y: 100, r: 0.7, c: starDim },
    { x: 0, y: 300, r: 0.6, c: starTiny }, { x: 450, y: 300, r: 0.6, c: starTiny },
    { x: 150, y: 0, r: 0.8, c: starDim }, { x: 150, y: 450, r: 0.8, c: starDim },
    { x: 350, y: 0, r: 0.6, c: starTiny }, { x: 350, y: 450, r: 0.6, c: starTiny },
  ];

  /* ── Build SVG ── */
  let svg = `<svg width='450' height='450' xmlns='http://www.w3.org/2000/svg'>`;

  /* Small background stars */
  for (const s of stars) {
    svg += `<circle cx='${s.x}' cy='${s.y}' r='${s.r}' fill='${s.c}'/>`;
  }

  /* Astrological anchor nodes (bright, branded) */
  const a = astro;
  // Glow halos for major nodes
  if (dk) {
    svg += `<circle cx='${a.regulus.x}' cy='${a.regulus.y}' r='8' fill='rgba(13,148,136,0.06)'/>`;
    svg += `<circle cx='${a.jupiter.x}' cy='${a.jupiter.y}' r='10' fill='rgba(45,212,191,0.05)'/>`;
    svg += `<circle cx='${a.spica.x}' cy='${a.spica.y}' r='8' fill='rgba(45,212,191,0.04)'/>`;
  }
  // Node dots
  svg += `<circle cx='${a.regulus.x}' cy='${a.regulus.y}' r='${a.regulus.r}' fill='${nodeBrand}'/>`;
  svg += `<circle cx='${a.spica.x}' cy='${a.spica.y}' r='${a.spica.r}' fill='${nodeGold}'/>`;
  svg += `<circle cx='${a.jupiter.x}' cy='${a.jupiter.y}' r='${a.jupiter.r}' fill='${nodeGold}'/>`;
  svg += `<circle cx='${a.aldebaran.x}' cy='${a.aldebaran.y}' r='${a.aldebaran.r}' fill='${nodeBrand}'/>`;
  svg += `<circle cx='${a.vega.x}' cy='${a.vega.y}' r='${a.vega.r}' fill='${nodeBrand}'/>`;
  svg += `<circle cx='${a.saturn.x}' cy='${a.saturn.y}' r='${a.saturn.r}' fill='${nodeBrand}'/>`;
  svg += `<circle cx='${a.mercury.x}' cy='${a.mercury.y}' r='${a.mercury.r}' fill='${nodeBrand}'/>`;
  svg += `<circle cx='${a.venus.x}' cy='${a.venus.y}' r='${a.venus.r}' fill='${nodeGold}'/>`;
  // Bright center dot on each
  svg += `<circle cx='${a.regulus.x}' cy='${a.regulus.y}' r='1' fill='${starBright}'/>`;
  svg += `<circle cx='${a.jupiter.x}' cy='${a.jupiter.y}' r='1.2' fill='${starBright}'/>`;
  svg += `<circle cx='${a.spica.x}' cy='${a.spica.y}' r='1' fill='${starBright}'/>`;
  svg += `<circle cx='${a.aldebaran.x}' cy='${a.aldebaran.y}' r='0.8' fill='${starBright}'/>`;
  svg += `<circle cx='${a.vega.x}' cy='${a.vega.y}' r='1' fill='${starBright}'/>`;

  /* ── Neural / constellation connections ──
     Prosperity sigil: Jupiter → Regulus → Mercury → Vega → Spica → Venus
     Foundation line:  Saturn → Aldebaran → Mercury
     Wealth triangle:  Jupiter → Spica → Venus (golden lines) */

  // Primary prosperity circuit (brand color)
  const ln = (x1: number, y1: number, x2: number, y2: number, c: string, w = 0.6) =>
    `<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' stroke='${c}' stroke-width='${w}'/>`;

  svg += ln(a.jupiter.x, a.jupiter.y, a.regulus.x, a.regulus.y, line);
  svg += ln(a.regulus.x, a.regulus.y, a.mercury.x, a.mercury.y, line);
  svg += ln(a.mercury.x, a.mercury.y, a.vega.x, a.vega.y, line);
  svg += ln(a.vega.x, a.vega.y, a.spica.x, a.spica.y, lineFaint);
  svg += ln(a.spica.x, a.spica.y, a.venus.x, a.venus.y, lineFaint);

  // Foundation line (discipline → material → commerce)
  svg += ln(a.saturn.x, a.saturn.y, a.aldebaran.x, a.aldebaran.y, line);
  svg += ln(a.aldebaran.x, a.aldebaran.y, a.mercury.x, a.mercury.y, line);
  svg += ln(a.saturn.x, a.saturn.y, a.regulus.x, a.regulus.y, lineFaint);

  // Wealth triangle (golden lines)
  svg += ln(a.jupiter.x, a.jupiter.y, a.spica.x, a.spica.y, lineGold, 0.5);
  svg += ln(a.spica.x, a.spica.y, a.venus.x, a.venus.y, lineGold, 0.5);
  svg += ln(a.venus.x, a.venus.y, a.aldebaran.x, a.aldebaran.y, lineFaint);

  // Network extensions (connecting to edges for tiling)
  svg += ln(a.saturn.x, a.saturn.y, 0, 100, lineFaint, 0.4);
  svg += ln(a.jupiter.x, a.jupiter.y, 450, 100, lineFaint, 0.4);
  svg += ln(a.regulus.x, a.regulus.y, 150, 0, lineFaint, 0.4);
  svg += ln(a.venus.x, a.venus.y, 150, 450, lineFaint, 0.4);
  svg += ln(a.vega.x, a.vega.y, 450, 300, lineFaint, 0.4);
  svg += ln(a.spica.x, a.spica.y, 0, 300, lineFaint, 0.4);
  svg += ln(a.regulus.x, a.regulus.y, 350, 0, lineFaint, 0.4);
  svg += ln(a.venus.x, a.venus.y, 350, 450, lineFaint, 0.4);

  svg += `</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/* ── Cosmic gradient (space → atmosphere) ── */
function cosmicGradient(theme: 'dark' | 'light'): string {
  if (theme === 'dark') {
    return `linear-gradient(180deg,
      rgba(6,6,18,1) 0%,
      rgba(10,10,22,1) 8%,
      rgba(12,8,20,0.95) 20%,
      rgba(15,10,18,0.85) 35%,
      rgba(10,10,15,0.7) 50%,
      rgba(10,10,15,0.3) 70%,
      transparent 100%
    )`;
  }
  return `linear-gradient(180deg,
    rgba(235,232,228,1) 0%,
    rgba(240,236,232,0.95) 15%,
    rgba(248,244,240,0.8) 35%,
    rgba(250,249,247,0.5) 55%,
    transparent 100%
  )`;
}

export const dark = {
  bg: '#0a0a0f',
  bgCard: 'rgba(20, 20, 30, 0.6)',
  bgAlt: 'rgba(16, 16, 24, 0.4)',
  border: 'rgba(255,255,255,0.06)',
  borderHover: 'rgba(13, 148, 136, 0.3)',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  white: '#ffffff',
  brand: '#0d9488',
  brandLight: '#14b8a6',
  brandDark: '#0f766e',
  gold: '#2dd4bf',
  goldLight: '#5eead4',
  glass: 'rgba(16, 16, 24, 0.75)',
  glassBorder: 'rgba(13, 148, 136, 0.15)',
  glassCard: 'rgba(20, 20, 30, 0.6)',
  glassCardBorder: 'rgba(255, 255, 255, 0.06)',
  inputBg: 'rgba(20,20,30,0.6)',
  shadow: 'rgba(0,0,0,0.4)',
  cosmicBg: createCosmicPattern('dark'),
  cosmicGradient: cosmicGradient('dark'),
  orbBrand: 'rgba(13,148,136,0.07)',
  orbGold: 'rgba(45,212,191,0.05)',
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
  borderHover: 'rgba(13, 148, 136, 0.25)',
  text: '#1e293b',
  textMuted: '#475569',
  textDim: '#64748b',
  white: '#0f172a',
  brand: '#0d9488',
  brandLight: '#0f766e',
  brandDark: '#115e59',
  gold: '#0f766e',
  goldLight: '#0d9488',
  glass: 'rgba(255, 255, 255, 0.8)',
  glassBorder: 'rgba(13, 148, 136, 0.12)',
  glassCard: 'rgba(255, 255, 255, 0.65)',
  glassCardBorder: 'rgba(0, 0, 0, 0.06)',
  inputBg: 'rgba(255,255,255,0.8)',
  shadow: 'rgba(0,0,0,0.08)',
  cosmicBg: createCosmicPattern('light'),
  cosmicGradient: cosmicGradient('light'),
  orbBrand: 'rgba(13,148,136,0.05)',
  orbGold: 'rgba(45,212,191,0.06)',
  badgeBg: 'rgba(0,0,0,0.04)',
  badgeBorder: 'rgba(0,0,0,0.08)',
  tagBg: 'rgba(0,0,0,0.04)',
  tagBorder: 'rgba(0,0,0,0.08)',
  footerBorder: '#94a3b8',
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stauf-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  const colors = theme === 'dark' ? dark : light;

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('stauf-theme', next);
      return next;
    });
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = colors.bg;
    document.body.style.color = colors.text;
  }, [colors]);

  return { theme, colors, toggleTheme };
}
