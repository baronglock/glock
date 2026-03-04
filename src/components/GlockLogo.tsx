const BRAND = '#9b1b30';

export function GlockLogo({ size = 28 }: { size?: number }) {
  /* The SVG G must match the cap-height of the CSS text.
     We use 1em-based sizing so the SVG scales with font-size. */
  const gWidth = size * 0.72; // G is narrower than tall

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'baseline',
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700, fontSize: size, letterSpacing: '-0.03em',
      color: BRAND, lineHeight: 1,
    }}>
      {/* G with lightning bolt — sized to match text cap height */}
      <svg
        viewBox="0 0 52 62"
        width={gWidth}
        height={size}
        style={{ display: 'inline-block', verticalAlign: 'baseline', marginRight: -1 }}
      >
        {/* G letter */}
        <text x="0" y="52" fontFamily="'Playfair Display', Georgia, serif" fontSize="58" fontWeight="700" fill={BRAND}>G</text>
        {/* Lightning bolt crossing through — outline only */}
        <path d="M34 2 L24 26 L32 26 L20 60" fill="none" stroke={BRAND} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>lock</span>
      <span>.</span>
    </span>
  );
}
