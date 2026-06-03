function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React, { Component } from 'react';
import { Animated } from 'react-native';
export default class SelectedLabel extends Component {
  render() {
    var _style$transform;
    const {
      text,
      normalColor,
      selectedColor,
      selectedScale,
      style,
      ...rest
    } = this.props;
    const scale = style === null || style === void 0 || (_style$transform = style.transform) === null || _style$transform === void 0 || (_style$transform = _style$transform[0]) === null || _style$transform === void 0 ? void 0 : _style$transform.scale;
    const color = scale.interpolate({
      inputRange: [1, selectedScale],
      outputRange: [normalColor, selectedColor]
    });
    return /*#__PURE__*/React.createElement(Animated.Text, _extends({}, rest, {
      style: [style, {
        color
      }]
    }), text);
  }
}
//# sourceMappingURL=index.js.map