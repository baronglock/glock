export function StaufLogo({ size = 28 }: { size?: number }) {
  return (
    <span style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      fontSize: size, letterSpacing: '-0.03em',
      lineHeight: 1, whiteSpace: 'nowrap',
    }}>
      <span style={{ color: '#fff', fontWeight: 600 }}>S</span>
      <span style={{ color: '#fff', fontWeight: 300 }}>tauf</span>
      <span style={{ color: '#2563eb', fontWeight: 600 }}>.</span>
    </span>
  );
}
