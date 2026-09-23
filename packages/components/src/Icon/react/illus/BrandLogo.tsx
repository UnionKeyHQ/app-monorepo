import Svg, { SvgProps, Path, Rect } from 'react-native-svg';
const SvgBrandLogo = (props: SvgProps) => (
  <Svg fill="none" viewBox="0 0 296 296" accessibilityRole="image" {...props}>
    <Rect width={296} height={296} rx={64} fill="#000" />
    <Path
      d="M216 90.2v112.58c0 24.422-19.798 44.22-44.22 44.22h-47.56C99.798 247 80 227.202 80 202.78V90.2L148 51l68 39.2Zm-108.477 21.412v64.057c0 22.354 18.123 40.477 40.477 40.477s40.476-18.123 40.476-40.477v-64.057L148 85.479l-40.477 26.133Z"
      fill="#FD6303"
    />
    <Rect x={133.434} y={61.778} width={29.143} height={129.333} fill="#FD6303" />
  </Svg>
);
export default SvgBrandLogo;
