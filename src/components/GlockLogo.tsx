export function GlockLogo({ size = 28 }: { size?: number }) {
  return (
    <span style={{
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700, fontSize: size, letterSpacing: '-0.03em',
      lineHeight: 1, whiteSpace: 'nowrap',
    }}>
      <span style={{ color: '#2563eb' }}>Glock</span>
      <span style={{ color: '#2563eb' }}>.</span>
    </span>
  );
}
