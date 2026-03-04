export function GlockLogo({ size = 28, colors }: { size?: number; colors?: any }) {
  const textColor = colors?.white ?? '#fff';
  return (
    <span style={{
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 700, fontSize: size, letterSpacing: '-0.03em',
      lineHeight: 1, whiteSpace: 'nowrap',
    }}>
      <span style={{ color: '#9b1b30' }}>Glock</span>
      <span style={{ color: '#9b1b30' }}>.</span>
    </span>
  );
}
