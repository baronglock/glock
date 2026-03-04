const BRAND = '#9b1b30';

export function GlockLogo({ size = 28 }: { size?: number }) {
  return (
    <span style={{
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700, fontSize: size, letterSpacing: '-0.03em',
      color: BRAND, lineHeight: 1, whiteSpace: 'nowrap',
    }}>
      {/* G as real text so it shares the same baseline as "lock" */}
      <span style={{ position: 'relative', display: 'inline' }}>
        G
        {/* Lightning bolt overlaid on the G */}
        <svg
          viewBox="0 0 100 100"
          style={{
            position: 'absolute',
            left: 0, top: '-15%',
            width: '100%', height: '130%',
            pointerEvents: 'none',
          }}
        >
          <path
            d="M60 0 L38 42 L56 42 L30 100"
            fill="none"
            stroke={BRAND}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      lock.
    </span>
  );
}
