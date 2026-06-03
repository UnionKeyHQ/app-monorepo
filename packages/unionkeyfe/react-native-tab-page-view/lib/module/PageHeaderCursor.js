import React, { Component } from 'react';
import { View, Animated } from 'react-native';
export default class PageHeaderCursor extends Component {
  state = {
    itemContainerLayoutList: this.props.data.map(() => undefined)
  };
  reloadItemListContainerLayout = (refList, scrollRef) => {
    this.state.itemContainerLayoutList = this.props.data.map(() => undefined);
    refList.map((ref, index) => {
      var _ref$current;
      ref === null || ref === void 0 || (_ref$current = ref.current) === null || _ref$current === void 0 || _ref$current.measureLayout(scrollRef.current, (x, y, width, height) => {
        if (x + width <= 0) {
          return;
        }
        this.state.itemContainerLayoutList[index] = {
          x,
          y,
          width,
          height
        };
        if (this.state.itemContainerLayoutList.findIndex(item => !item) == -1) {
          this.setState(this.state);
        }
      });
    });
  };
  _findPercentCursorWidth = () => {
    const {
      width
    } = this.props.cursorStyle;
    if (typeof width === 'string') {
      var _width$match;
      return (_width$match = width.match(/(\d+(\.\d+)?)%/)) === null || _width$match === void 0 ? void 0 : _width$match[1];
    }
    return null;
  };
  _findFixCursorWidth = () => {
    const {
      width
    } = this.props.cursorStyle;
    if (this._findPercentCursorWidth()) {
      return null;
    }
    return width;
  };
  _reloadPageIndexValue = isWidth => {
    var _this$props;
    const fixCursorWidth = this._findFixCursorWidth();
    const {
      left = 0,
      right = 0
    } = this === null || this === void 0 || (_this$props = this.props) === null || _this$props === void 0 ? void 0 : _this$props.cursorStyle;
    const percentWidth = this._findPercentCursorWidth();
    const rangeList = isIndex => {
      const itemList = [isIndex ? -1 : 0];
      itemList.push(...this.state.itemContainerLayoutList.map((item, index) => {
        if (isIndex) {
          return index;
        } else {
          if (item) {
            if (fixCursorWidth) {
              return isWidth ? fixCursorWidth : item.x + (item.width - fixCursorWidth) / 2.0;
            } else {
              const width = item.width - left - right;
              return isWidth ? width * Number(percentWidth ?? 100) / 100 : item.x + left;
            }
          } else {
            return 0;
          }
        }
      }));
      itemList.push(isIndex ? itemList.length - 1 : 0);
      return itemList;
    };
    return this.props.scrollPageIndexValue.interpolate({
      inputRange: rangeList(true),
      outputRange: rangeList(false)
    });
  };
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.data !== this.props.data || nextProps.cursorStyle !== this.props.cursorStyle || nextState !== this.state) {
      return true;
    }
    return false;
  }
  render() {
    const fixCursorWidth = this._findFixCursorWidth();
    const translateX = this._reloadPageIndexValue(false);
    const widthX = this._reloadPageIndexValue(true);
    const containerStyle = {
      transform: [{
        translateX
      }],
      width: fixCursorWidth ?? widthX,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      alignItems: 'center'
    };
    const contentStyle = [this.props.cursorStyle, {
      left: null,
      right: null,
      width: fixCursorWidth ?? widthX
    }];
    return /*#__PURE__*/React.createElement(View, {
      pointerEvents: "none",
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        opacity: this.state.itemContainerLayoutList.findIndex(item => !item) == -1 ? 1 : 0
      }
    }, /*#__PURE__*/React.createElement(Animated.View, {
      style: containerStyle
    }, this.props.renderCursor ? this.props.renderCursor() : /*#__PURE__*/React.createElement(Animated.View, {
      style: contentStyle
    })));
  }
}
//# sourceMappingURL=PageHeaderCursor.js.map