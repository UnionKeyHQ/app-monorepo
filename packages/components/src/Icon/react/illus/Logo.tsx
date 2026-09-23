import Svg, { G, Path, SvgProps, Text } from 'react-native-svg';

const SvgLogo = (props: SvgProps) => (
  <Svg viewBox="0 0 82 25" fill="none" accessibilityRole="image" {...props}>
    <G transform="translate(0.5 0.5) scale(0.081)">
      <Path d="M216 90.2v112.58c0 24.422-19.798 44.22-44.22 44.22h-47.56C99.798 247 80 227.202 80 202.78V90.2L148 51l68 39.2Zm-108.477 21.412v64.057c0 22.354 18.123 40.477 40.477 40.477s40.476-18.123 40.476-40.477v-64.057L148 85.479l-40.477 26.133Z" fill="#FD6303" />
      <Path d="M133.434 61.778h29.143v129.333h-29.143z" fill="#FD6303" />
    </G>
    <Text x={27} y={17} fill="#8C8CA1" fontSize={13} fontWeight="700">
      UnionKey
    </Text>
  </Svg>
);
export default SvgLogo;
