const BRAND = '#9b1b30';

export function GlockLogo({ size = 28 }: { size?: number }) {
  /* Raio proporcional: usa em units so it scales with any size */
  const boltH = size * 1.3;
  const boltW = size * 0.55;
  const boltTop = size * -0.18;
  const boltLeft = size * 0.15;

  return (
    <span style={{
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700, fontSize: size, letterSpacing: '-0.03em',
      color: BRAND, lineHeight: 1, whiteSpace: 'nowrap',
    }}>
      <span style={{ position: 'relative', display: 'inline-block' }}>
        G
        <svg
          viewBox="0 0 55 130"
          width={boltW}
          height={boltH}
          style={{
            position: 'absolute',
            left: boltLeft, top: boltTop,
            pointerEvents: 'none',
          }}
        >
          <path
            d="M38 0 L18 52 L35 52 L12 130"
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
