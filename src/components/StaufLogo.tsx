export function StaufLogo({ size = 28 }: { size?: number }) {
  return (
    <span style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      fontWeight: 900, fontSize: size, letterSpacing: '-0.03em',
      lineHeight: 1, whiteSpace: 'nowrap',
    }}>
      <span style={{ color: '#2563eb' }}>S</span>
      <span style={{ color: '#2563eb', fontWeight: 300 }}>tauf</span>
      <span style={{ color: '#60a5fa' }}>.</span>
    </span>
  );
}
