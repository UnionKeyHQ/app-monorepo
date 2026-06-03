"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _ContentFlatList = _interopRequireDefault(require("./ContentFlatList"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const SCREEN_WIDTH = _reactNative.Dimensions.get('window').width;
class PageContentView extends _react.Component {
  static defaultProps = {
    data: [],
    renderItem: null,
    horizontal: true,
    initialNumToRender: 1,
    windowSize: 3,
    updateCellsBatchingPeriod: 0,
    maxToRenderPerBatch: 1,
    removeClippedSubviews: true,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    contentInsetAdjustmentBehavior: 'never',
    automaticallyAdjustContentInsets: false,
    bounces: false,
    pagingEnabled: true,
    shouldSelectedPageAnimation: true,
    keyExtractor: (_, index) => `${index}`
  };
  state = {
    scrollViewWidth: _reactNative.PixelRatio.roundToNearestPixel(SCREEN_WIDTH)
  };
  _scrollViewWidthValue = new _reactNative.Animated.Value(this.state.scrollViewWidth);
  _contentOffsetValueX = new _reactNative.Animated.Value(this.props.initialScrollIndex ?? 0);
  _scrollPageIndexValue = _reactNative.Animated.divide(this._contentOffsetValueX, this._scrollViewWidthValue);
  _event = _reactNative.Animated.event([{
    nativeEvent: {
      contentOffset: {
        x: this._contentOffsetValueX
      },
      layoutMeasurement: {
        width: this._scrollViewWidthValue
      }
    }
  }], {
    useNativeDriver: false
  });
  scrollView = /*#__PURE__*/_react.default.createRef();
  componentDidMount() {
    var _this$props$onInitScr, _this$props;
    (_this$props$onInitScr = (_this$props = this.props).onInitScrollPageIndexValue) === null || _this$props$onInitScr === void 0 || _this$props$onInitScr.call(_this$props, this._scrollPageIndexValue);
  }
  scrollPageIndex = (() => {
    var _this = this;
    return function (pageIndex) {
      let animated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this.props.shouldSelectedPageAnimation;
      try {
        var _this$scrollView, _this$scrollView$scro;
        const scrollConfig = {
          index: pageIndex,
          animated: animated ?? false
        };
        _this === null || _this === void 0 || (_this$scrollView = _this.scrollView) === null || _this$scrollView === void 0 || (_this$scrollView = _this$scrollView.current) === null || _this$scrollView === void 0 || (_this$scrollView$scro = _this$scrollView.scrollToIndex) === null || _this$scrollView$scro === void 0 || _this$scrollView$scro.call(_this$scrollView, scrollConfig);
      } catch (e) {}
    };
  })();
  _onLayout = event => {
    var _this$props$onLayout, _this$props2, _this$props3;
    (_this$props$onLayout = (_this$props2 = this.props).onLayout) === null || _this$props$onLayout === void 0 || _this$props$onLayout.call(_this$props2, event);
    const {
      nativeEvent: {
        layout: {
          width
        }
      }
    } = event;
    const reloadWidth = _reactNative.PixelRatio.roundToNearestPixel(width);
    if (reloadWidth !== this.state.scrollViewWidth && reloadWidth > 0 && ((this === null || this === void 0 || (_this$props3 = this.props) === null || _this$props3 === void 0 || (_this$props3 = _this$props3.data) === null || _this$props3 === void 0 ? void 0 : _this$props3.length) ?? 0) > 0) {
      this._scrollViewWidthValue.setValue(reloadWidth);
      this.setState({
        scrollViewWidth: reloadWidth
      }, () => {
        var _this$scrollView2, _this$scrollView2$rel;
        this === null || this === void 0 || (_this$scrollView2 = this.scrollView) === null || _this$scrollView2 === void 0 || (_this$scrollView2 = _this$scrollView2.current) === null || _this$scrollView2 === void 0 || (_this$scrollView2$rel = _this$scrollView2.reloadScrollContainerWidth) === null || _this$scrollView2$rel === void 0 || _this$scrollView2$rel.call(_this$scrollView2, reloadWidth);
      });
    }
  };
  _renderItem = info => {
    var _this$props$renderIte, _this$props4;
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: {
        width: this.state.scrollViewWidth,
        height: '100%'
      }
    }, (_this$props$renderIte = (_this$props4 = this.props).renderItem) === null || _this$props$renderIte === void 0 ? void 0 : _this$props$renderIte.call(_this$props4, info));
  };
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.data != this.props.data || nextState.scrollViewWidth != this.state.scrollViewWidth;
  }
  render() {
    return /*#__PURE__*/_react.default.createElement(_ContentFlatList.default, _extends({}, this.props, {
      onLayout: this._onLayout,
      ref: this.scrollView,
      style: [{
        width: '100%'
      }, this.props.style],
      renderItem: this._renderItem,
      onScroll: this._event,
      getItemLayout: (_, index) => ({
        length: this.state.scrollViewWidth,
        offset: index * this.state.scrollViewWidth,
        index
      }),
      scrollViewWidth: this.state.scrollViewWidth
    }));
  }
}
exports.default = PageContentView;
//# sourceMappingURL=PageContentView.js.map