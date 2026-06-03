"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _reactNative = require("react-native");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const BaseNestedTabView = (0, _reactNative.requireNativeComponent)('NestedTabView');
function NestedTabViewContainer(props, forwardRef) {
  const point = (0, _react.useRef)({
    x: 0,
    y: 0
  });
  const ref = (0, _react.useRef)();
  (0, _react.useImperativeHandle)(forwardRef, () => ({
    setVerticalScrollEnabled: scrollEnabled => {
      var _ref$current;
      if (ref !== null && ref !== void 0 && (_ref$current = ref.current) !== null && _ref$current !== void 0 && _ref$current._nativeTag) {
        _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(ref.current._nativeTag), _reactNative.UIManager.getViewManagerConfig('NestedTabView').Commands.setVerticalScrollEnabled, [scrollEnabled]);
      }
    },
    scrollToTop: () => {
      var _ref$current2;
      if (_reactNative.Platform.OS === 'ios' && ref !== null && ref !== void 0 && (_ref$current2 = ref.current) !== null && _ref$current2 !== void 0 && _ref$current2._nativeTag) {
        _reactNative.UIManager.dispatchViewManagerCommand((0, _reactNative.findNodeHandle)(ref.current._nativeTag), _reactNative.UIManager.getViewManagerConfig('NestedTabView').Commands.scrollToTop, []);
      }
    }
  }), []);
  return (
    /*#__PURE__*/
    // @ts-ignore
    React.createElement(BaseNestedTabView, _extends({
      ref: ref,
      onStartShouldSetResponderCapture: e => {
        const {
          locationX: x,
          locationY: y
        } = e.nativeEvent;
        point.current = {
          x,
          y
        };
        return false;
      },
      onMoveShouldSetResponderCapture: e => {
        const {
          locationX: x,
          locationY: y
        } = e.nativeEvent;
        const diffX = Math.abs(x - point.current.x);
        const diffY = Math.abs(y - point.current.y);
        return diffX + diffY > 5 && diffX > diffY;
      }
    }, props))
  );
}
var _default = exports.default = /*#__PURE__*/(0, _react.forwardRef)(NestedTabViewContainer);
//# sourceMappingURL=index.native.js.map