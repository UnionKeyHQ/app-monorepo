"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class ContentFlatList extends _react.Component {
  pageIndex = 0;
  isDraging = false;
  hasScrolledToInitScrollIndex = false;
  scrollView = /*#__PURE__*/_react.default.createRef();
  constructor(props) {
    super(props);
    const scrollEnabled = props.scrollEnabled ?? true;
    this.panResponder = _reactNative.PanResponder.create({
      onStartShouldSetPanResponder: () => scrollEnabled,
      onShouldBlockNativeResponder: () => scrollEnabled,
      onMoveShouldSetPanResponder: () => scrollEnabled,
      onMoveShouldSetPanResponderCapture: () => scrollEnabled,
      onPanResponderGrant: (_, gestureState) => this._onPanGestureStart(gestureState),
      onPanResponderMove: (_, gestureState) => this._onPanGestureMove(gestureState),
      onPanResponderTerminate: (_, gestureState) => this._onPanGestureEnd(gestureState),
      onPanResponderRelease: (_, gestureState) => this._onPanGestureEnd(gestureState),
      onPanResponderTerminationRequest: () => true
    });
  }
  _onPanGestureStart = _ => {
    this.isDraging = true;
  };
  _onPanGestureMove = gestureState => {
    var _this$scrollView;
    (_this$scrollView = this.scrollView) === null || _this$scrollView === void 0 || (_this$scrollView = _this$scrollView.current) === null || _this$scrollView === void 0 || _this$scrollView.scrollToOffset({
      animated: false,
      offset: this.pageIndex * this.props.scrollViewWidth - gestureState.dx
    });
  };
  _onPanGestureEnd = gestureState => {
    const decelerationRate = 0.998;
    let decelerationDistance = gestureState.vx * gestureState.vx / (2 * (1 - decelerationRate));
    decelerationDistance *= gestureState.vx > 0 ? 1 : -1;
    const finallyDistance = decelerationDistance + gestureState.dx;
    const reloadPageIndex = Math.abs(finallyDistance) * 2 >= this.props.scrollViewWidth ? this.pageIndex + (finallyDistance > 0 ? -1 : 1) : this.pageIndex;
    this.scrollToIndex({
      animated: true,
      index: reloadPageIndex
    });
    this.isDraging = false;
  };
  _onScroll = event => {
    if (event.nativeEvent.layoutMeasurement.width <= 0) {
      return;
    }
    this.props.onScroll && this.props.onScroll(event);
    if (this.isDraging) {
      return;
    }
    const {
      nativeEvent: {
        contentOffset: {
          x
        }
      }
    } = event;
    this.pageIndex = Math.round(x / this.props.scrollViewWidth);
  };
  scrollToIndex = config => {
    var _this$scrollView2;
    (_this$scrollView2 = this.scrollView) === null || _this$scrollView2 === void 0 || (_this$scrollView2 = _this$scrollView2.current) === null || _this$scrollView2 === void 0 || _this$scrollView2.scrollToIndex(config);
  };
  reloadScrollContainerWidth = _ => {
    if (!this.hasScrolledToInitScrollIndex) {
      this.hasScrolledToInitScrollIndex = true;
      if ((this.props.initialScrollIndex ?? 0) != 0) {
        this.scrollToIndex({
          animated: false,
          index: this.props.initialScrollIndex ?? 0
        });
      }
    } else {
      this.scrollToIndex({
        animated: false,
        index: this.pageIndex
      });
    }
  };
  render() {
    return /*#__PURE__*/_react.default.createElement(_reactNative.Animated.FlatList, _extends({}, this.props, this.panResponder.panHandlers, {
      ref: this.scrollView,
      pagingEnabled: false,
      scrollEnabled: false,
      disableScrollViewPanResponder: true,
      onScroll: this._onScroll
    }));
  }
}
exports.default = ContentFlatList;
//# sourceMappingURL=index.js.map