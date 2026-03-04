export function GlockLogo({ size = 28 }: { size?: number }) {
  return (
    <span style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      fontWeight: 900, fontSize: size, letterSpacing: '-0.04em',
      lineHeight: 1, whiteSpace: 'nowrap',
    }}>
      <span style={{ color: '#2563eb' }}>G</span>
      <span style={{ color: '#60a5fa' }}>.</span>
    </span>
  );
}
