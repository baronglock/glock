export function StaufLogo({ size = 28, colors }: { size?: number; colors?: any }) {
  const textColor = colors?.white || '#ffffff';
  const dotColor = colors?.brand || '#2dd4bf';
  return (
    <span style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      fontSize: size, letterSpacing: '0.12em',
      lineHeight: 1, whiteSpace: 'nowrap',
      fontWeight: 700, textTransform: 'uppercase' as const,
      color: textColor,
    }}>
      STAUF
      <span style={{ color: dotColor }}>.</span>
    </span>
  );
}
