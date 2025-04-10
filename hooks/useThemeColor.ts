import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;
type PrimaryShade = keyof typeof Colors.light.primary;
type GrayShade = keyof typeof Colors.light.gray;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorName | `primary-${PrimaryShade}` | `gray-${GrayShade}`
):string {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  if (colorName.startsWith("primary-")) {
    const shade = colorName.split("-")[1] as unknown as PrimaryShade;
    return Colors[theme].primary[shade];
  }
  if (colorName.startsWith("gray-")) {
    const shade = colorName.split("-")[1] as unknown as GrayShade;
    return Colors[theme].gray[shade];
  }

  const color = Colors[theme][colorName as keyof typeof Colors.light];
  return typeof color === 'string' ? color : '';
}