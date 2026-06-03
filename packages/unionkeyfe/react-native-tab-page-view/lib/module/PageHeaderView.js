function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React, { Component } from 'react';
import { View, Pressable, ScrollView, Animated, Easing, PixelRatio } from 'react-native';
import SelectedLabel from './SelectedLabel';
import PageHeaderCursor from './PageHeaderCursor';
export default class PageHeaderView extends Component {
  scrollPageIndex = this.props.initialScrollIndex ?? 0;
  scrollPageIndexValue = new Animated.Value(this.scrollPageIndex, {
    useNativeDriver: false
  });
  nextScrollPageIndex = -1;
  shouldHandlerAnimationValue = true;
  itemConfigList = this.props.data.map(_ => ({
    _animtedEnabledValue: new Animated.Value(1),
    _containerRef: /*#__PURE__*/React.createRef()
  }));
  itemContainerStyle = () => ({
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...this.props.itemContainerStyle
  });
  itemTitleNormalStyle = () => ({
    fontSize: 16,
    color: '#333',
    ...this.props.itemTitleStyle,
    ...this.props.itemTitleNormalStyle
  });
  itemTitleSelectedStyle = () => ({
    ...this.itemTitleNormalStyle(),
    fontSize: 20,
    color: '#666',
    ...this.props.itemTitleSelectedStyle
  });
  cursorStyle = () => ({
    position: 'absolute',
    bottom: 0,
    height: 1 / PixelRatio.get(),
    backgroundColor: '#999',
    ...this.props.cursorStyle
  });
  scrollView = /*#__PURE__*/React.createRef();
  cursor = /*#__PURE__*/React.createRef();
  scrollViewWidth = 0;
  static defaultProps = {
    data: [],
    horizontal: true,
    selectedPageIndexDuration: 250,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    contentInsetAdjustmentBehavior: 'never',
    automaticallyAdjustContentInsets: false,
    bounces: false
  };
  bindScrollPageIndexValue = scrollPageIndexValue => {
    this.scrollPageIndexValue.removeAllListeners();
    this.scrollPageIndexValue = scrollPageIndexValue;
    this.shouldHandlerAnimationValue = false;
    this.addScrollPageIndexListener();
    this.forceUpdate();
  };
  addScrollPageIndexListener = () => {
    this.scrollPageIndexValue.addListener(_ref => {
      let {
        value
      } = _ref;
      const scrollIsStop = Math.floor(value) === value;
      if (this.props.shouldSelectedPageIndex && this.nextScrollPageIndex === -1 && scrollIsStop && value !== this.scrollPageIndex && !this.props.shouldSelectedPageIndex(value)) {
        var _this$props, _this$props$onSelecte;
        (_this$props = this.props) === null || _this$props === void 0 || (_this$props$onSelecte = _this$props.onSelectedPageIndex) === null || _this$props$onSelecte === void 0 || _this$props$onSelecte.call(_this$props, this.scrollPageIndex);
        this.scrollPageIndex = value;
        return;
      }
      if (this.nextScrollPageIndex >= 0 && Math.abs(this.nextScrollPageIndex - value) <= 0.01) {
        this.nextScrollPageIndex = -1;
        this.itemConfigList.map((item, _index) => {
          item._animtedEnabledValue.setValue(1);
        });
      }
      const newPageIndex = Math.round(value);
      if (newPageIndex != this.scrollPageIndex && scrollIsStop) {
        var _this$cursor, _this$scrollView;
        const itemLayout = (this === null || this === void 0 || (_this$cursor = this.cursor) === null || _this$cursor === void 0 || (_this$cursor = _this$cursor.current) === null || _this$cursor === void 0 || (_this$cursor = _this$cursor.state) === null || _this$cursor === void 0 || (_this$cursor = _this$cursor.itemContainerLayoutList) === null || _this$cursor === void 0 ? void 0 : _this$cursor[newPageIndex]) ?? {
          x: 0,
          width: 0
        };
        this === null || this === void 0 || (_this$scrollView = this.scrollView) === null || _this$scrollView === void 0 || (_this$scrollView = _this$scrollView.current) === null || _this$scrollView === void 0 || _this$scrollView.scrollTo({
          x: itemLayout.x + itemLayout.width / 2.0 - this.scrollViewWidth / 2.0
        });
        this.scrollPageIndex = newPageIndex;
      }
    });
  };
  constructor(props) {
    super(props);
    this.addScrollPageIndexListener();
  }
  componentWillUnmount() {
    this.scrollPageIndexValue.removeAllListeners();
  }
  _animation = (() => function (key, value) {
    let duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    let native = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    Animated.timing(key, {
      toValue: value,
      duration: duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: native
    }).start();
  })();
  _itemTitleProps = (item, index) => {
    var _this$itemConfigList;
    let fontScale = 1 + (this.itemTitleSelectedStyle().fontSize - this.itemTitleNormalStyle().fontSize) / this.itemTitleNormalStyle().fontSize;
    if (fontScale === 1) {
      fontScale = 1.0001;
    }
    let scale = this.scrollPageIndexValue.interpolate({
      inputRange: [index - 2, index - 1, index, index + 1, index + 2],
      outputRange: [1, 1, fontScale, 1, 1]
    });
    const enabled = (this === null || this === void 0 || (_this$itemConfigList = this.itemConfigList) === null || _this$itemConfigList === void 0 || (_this$itemConfigList = _this$itemConfigList[index]) === null || _this$itemConfigList === void 0 ? void 0 : _this$itemConfigList._animtedEnabledValue) ?? new Animated.Value(1);
    scale = Animated.add(Animated.multiply(scale, enabled), Animated.multiply(1, Animated.subtract(1, enabled)));
    const normalColor = this.itemTitleNormalStyle().color;
    const selectedColor = this.itemTitleSelectedStyle().color;
    return {
      ...this.itemTitleNormalStyle(),
      normalColor,
      selectedColor,
      selectedScale: fontScale,
      text: this.props.titleFromItem ? this.props.titleFromItem(item, index) : item,
      style: {
        ...this.itemTitleNormalStyle(),
        transform: [{
          scale
        }]
      }
    };
  };
  _renderTitle = (item, index) => {
    return /*#__PURE__*/React.createElement(SelectedLabel, this._itemTitleProps(item, index));
  };
  _itemDidTouch = (_, index) => {
    var _this$props$onSelecte2, _this$props2;
    if (this.props.shouldSelectedPageIndex) {
      const result = this.props.shouldSelectedPageIndex(index);
      if (result === false) {
        return;
      }
    }
    this.nextScrollPageIndex = index;
    this.itemConfigList.map((item, _index) => {
      item._animtedEnabledValue.setValue(_index === index || _index === this.scrollPageIndex ? 1 : 0);
    });
    if (this.shouldHandlerAnimationValue) {
      this._animation(this.scrollPageIndexValue, index, this.props.selectedPageIndexDuration, false);
    }
    (_this$props$onSelecte2 = (_this$props2 = this.props).onSelectedPageIndex) === null || _this$props$onSelecte2 === void 0 || _this$props$onSelecte2.call(_this$props2, index);
  };
  _renderItem = (item, index) => {
    var _this$itemConfigList2;
    let content = this.props.renderItem != null ? this.props.renderItem(item, index, this._itemTitleProps(item, index)) : this._renderTitle(item, index);
    return /*#__PURE__*/React.createElement(Pressable, {
      key: index,
      ref: this === null || this === void 0 || (_this$itemConfigList2 = this.itemConfigList) === null || _this$itemConfigList2 === void 0 || (_this$itemConfigList2 = _this$itemConfigList2[index]) === null || _this$itemConfigList2 === void 0 ? void 0 : _this$itemConfigList2._containerRef,
      style: this.itemContainerStyle(),
      onPress: () => this._itemDidTouch(item, index)
    }, content);
  };
  _renderCursor = () => {
    return /*#__PURE__*/React.createElement(PageHeaderCursor, {
      ref: this.cursor,
      data: this.props.data,
      scrollPageIndexValue: this.scrollPageIndexValue,
      renderCursor: this.props.renderCursor,
      cursorStyle: this.cursorStyle()
    });
  };
  shouldComponentUpdate(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.nextScrollPageIndex = -1;
      this.itemConfigList = nextProps.data.map(_ => ({
        _animtedEnabledValue: new Animated.Value(1),
        _containerRef: /*#__PURE__*/React.createRef()
      }));
      return true;
    }
    return false;
  }
  render() {
    var _this$itemContainerSt, _this$props$data;
    const {
      style,
      ...restProps
    } = this.props;
    return /*#__PURE__*/React.createElement(View, {
      style: style
    }, /*#__PURE__*/React.createElement(ScrollView, _extends({
      onContentSizeChange: (width, height) => {
        var _this$cursor2, _this$props3, _this$props3$onConten;
        this === null || this === void 0 || (_this$cursor2 = this.cursor) === null || _this$cursor2 === void 0 || (_this$cursor2 = _this$cursor2.current) === null || _this$cursor2 === void 0 || _this$cursor2.reloadItemListContainerLayout(this.itemConfigList.map(item => item._containerRef), this.scrollView);
        this === null || this === void 0 || (_this$props3 = this.props) === null || _this$props3 === void 0 || (_this$props3$onConten = _this$props3.onContentSizeChange) === null || _this$props3$onConten === void 0 || _this$props3$onConten.call(_this$props3, width, height);
      },
      onLayout: event => {
        var _this$props4, _this$props4$onLayout;
        this.scrollViewWidth = event.nativeEvent.layout.width;
        this === null || this === void 0 || (_this$props4 = this.props) === null || _this$props4 === void 0 || (_this$props4$onLayout = _this$props4.onLayout) === null || _this$props4$onLayout === void 0 || _this$props4$onLayout.call(_this$props4, event);
      },
      style: this.props.containerStyle
    }, restProps, {
      contentContainerStyle: [{
        width: (_this$itemContainerSt = this.itemContainerStyle()) !== null && _this$itemContainerSt !== void 0 && _this$itemContainerSt.flex ? '100%' : null
      }, this.props.scrollContainerStyle],
      ref: this.scrollView
    }), /*#__PURE__*/React.createElement(View, {
      style: [{
        minWidth: '100%',
        flexDirection: 'row',
        alignItems: 'center'
      }, this.props.contentContainerStyle]
    }, this._renderCursor(), (_this$props$data = this.props.data) === null || _this$props$data === void 0 ? void 0 : _this$props$data.map((item, index) => {
      return this._renderItem(item, index);
    }))), this.props.ToolBar);
  }
}
//# sourceMappingURL=PageHeaderView.js.map