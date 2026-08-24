import Svg, { Path, Rect, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

const SvgMyLogo = (props: SvgProps) => (
  <Svg width="59" height="65" viewBox="0 0 59 65" fill="none" {...props}>
    <Rect y="4" width="59" height="56" rx="20" fill="black" />
    <Path
      d="M45.5928 20.4668V35.0371C45.5928 43.4851 38.7448 50.3338 30.2969 50.334C21.8488 50.334 15 43.4852 15 35.0371V20.4668L30.2969 13L45.5928 20.4668ZM21.1914 24.5459V35.3525C21.1917 40.3809 25.2684 44.457 30.2969 44.457C35.3251 44.4568 39.4011 40.3808 39.4014 35.3525V24.5459L30.2969 19.5674L21.1914 24.5459Z"
      fill="#FD6303"
    />
    <Rect x="27.0195" y="15.0742" width="6.55567" height="24.8893" fill="#FD6303" />
  </Svg>
);

export default SvgMyLogo;
