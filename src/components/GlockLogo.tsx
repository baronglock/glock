const B = '#9b1b30';

export function GlockLogo({ size = 28 }: { size?: number }) {
  /* Scale factor: design is based on size=28 */
  const s = size / 28;
  const w = 160 * s;
  const h = 42 * s;

  return (
    <svg viewBox="0 0 160 42" width={w} height={h} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      {/* ── G: lightning bolt left side (two strokes forming the zigzag) ── */}
      {/* Main bolt stroke: top → center zag → bottom */}
      <path
        d="M 48 0 L 20 18 L 52 18 L 6 42"
        fill="none" stroke={B} strokeWidth="2.8"
        strokeLinecap="round" strokeLinejoin="round"
      />
      {/* Second parallel stroke (gives G its body) */}
      <path
        d="M 58 0 L 32 18 L 14 42"
        fill="none" stroke={B} strokeWidth="2.8"
        strokeLinecap="round" strokeLinejoin="round"
      />

      {/* ── "oc" text embedded at the bolt's center junction ── */}
      <text
        x="58" y="27"
        fontFamily="'Playfair Display', Georgia, serif"
        fontSize="18" fontWeight="700" fill={B}
        letterSpacing="-0.5"
      >oc</text>

      {/* ── K: two diagonal strokes on the right ── */}
      {/* Upper arm */}
      <path
        d="M 120 1 L 95 19"
        fill="none" stroke={B} strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Lower arm */}
      <path
        d="M 96 22 L 126 42"
        fill="none" stroke={B} strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* ── Dot ── */}
      <circle cx="140" cy="38" r="2.8" fill={B} />
    </svg>
  );
}
