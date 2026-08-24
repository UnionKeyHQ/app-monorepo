
import Svg, { Path, Rect, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';
const SvgUnionKeyDevice = (props: SvgProps) => (
  <Svg
  width={24}
  height={24}
  viewBox="0 0 24 24"
  fill="none"
  {...props}
>
  {/* 手机外框 */}
  <Path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M7.75 2C6.09315 2 4.75 3.34315 4.75 5V19C4.75 20.6569 6.09315 22 7.75 22H16.25C17.9069 22 19.25 20.6569 19.25 19V5C19.25 3.34315 17.9069 2 16.25 2H7.75ZM6.75 5C6.75 4.44772 7.19772 4 7.75 4H16.25C16.8023 4 17.25 4.44772 17.25 5V18C17.25 18.5523 16.8023 19 16.25 19H7.75C7.19772 19 6.75 18.5523 6.75 18V5Z"
    fill="currentColor"
  />

  {/* 中间竖条 */}
  <Rect
    x="11.3555"
    y="7.48242"
    width="1.28573"
    height="6"
    fill="currentColor"
  />

  {/* 底部盾牌 / 徽章 */}
  <Path
    d="M15 8.7998V13C15 14.6569 13.6569 16 12 16C10.3432 16 9.00002 14.6568 9 13V8.7998L12 7L15 8.7998ZM10.2148 9.7832V12.7979C10.2151 13.7839 11.0149 14.583 12.001 14.583C12.9869 14.5828 13.7859 13.7837 13.7861 12.7979V9.7832L12.001 8.58301L10.2148 9.7832Z"
    fill="currentColor"
  />
</Svg>

);
export default SvgUnionKeyDevice;
