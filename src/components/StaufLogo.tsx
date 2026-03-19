import { useTheme } from '../hooks/useTheme';

export function StaufLogo({ size = 28 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <span style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      fontSize: size, letterSpacing: '-0.03em',
      lineHeight: 1, whiteSpace: 'nowrap',
    }}>
      <span style={{ color: colors.white, fontWeight: 600 }}>S</span>
      <span style={{ color: colors.white, fontWeight: 300 }}>tauf</span>
      <span style={{ color: colors.brand, fontWeight: 600 }}>.</span>
    </span>
  );
}
