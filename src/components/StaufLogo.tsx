import { useTheme } from '../hooks/useTheme';

export function StaufLogo({ size = 28 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <span style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      fontSize: size, letterSpacing: '0.12em',
      lineHeight: 1, whiteSpace: 'nowrap',
      fontWeight: 700, textTransform: 'uppercase' as const,
      color: colors.white,
    }}>
      STAUF
      <span style={{ color: colors.brand }}>.</span>
    </span>
  );
}
// cache bust 1773932985
