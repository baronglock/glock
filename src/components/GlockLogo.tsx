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
            left: '5%', top: '-8%',
            width: '90%', height: '115%',
            pointerEvents: 'none',
          }}
        >
          <path
            d="M62 2 L42 44 L58 44 L34 98"
            fill="none"
            stroke={BRAND}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      lock.
    </span>
  );
}
