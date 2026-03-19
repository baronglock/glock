export function StaufLogo({ size = 28, colors }: { size?: number; colors?: any }) {
  const textColor = colors?.white || '#ffffff';
  const dotColor = colors?.brand || '#2dd4bf';
  const iconSize = size * 0.85;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: size * 0.25,
      lineHeight: 1, whiteSpace: 'nowrap',
    }}>
      <img src="/stauf-icon.png" alt="" width={iconSize} height={iconSize} style={{ width: iconSize, height: iconSize, objectFit: 'contain' }} />
      <span style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: size, letterSpacing: '0.12em',
        fontWeight: 700, textTransform: 'uppercase' as const,
        color: textColor,
      }}>
        STAUF
        <span style={{ color: dotColor }}>.</span>
      </span>
    </span>
  );
}
