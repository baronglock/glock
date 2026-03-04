const BRAND = '#9b1b30';

export function GlockLogo({ size = 28 }: { size?: number }) {
  const svgH = size * 1.1;
  const svgW = svgH * 0.75;

  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: size, letterSpacing: '-0.03em', color: BRAND, lineHeight: 1 }}>
      {/* G with lightning bolt */}
      <svg viewBox="0 0 64 72" width={svgW} height={svgH} style={{ display: 'inline-block', verticalAlign: 'baseline', marginBottom: '-0.12em' }}>
        {/* G letter */}
        <text x="4" y="58" fontFamily="'Playfair Display', Georgia, serif" fontSize="62" fontWeight="700" fill={BRAND}>G</text>
        {/* Lightning bolt crossing through — outline only */}
        <path d="M40 6 L29 30 L38 30 L25 66" fill="none" stroke={BRAND} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>lock</span>
      <span style={{ color: BRAND }}>.</span>
    </span>
  );
}
