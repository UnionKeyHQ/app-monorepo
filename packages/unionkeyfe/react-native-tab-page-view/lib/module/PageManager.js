function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from 'react';
import PageHeaderView from './PageHeaderView';
import PageContentView from './PageContentView';
export default class PageManager extends React.Component {
  static defaultProps = {
    data: [],
    initialScrollIndex: 0,
    onSelectedPageIndex: () => {}
  };
  constructor(props) {
    super(props);
    this.pageIndex = props.initialScrollIndex ?? 0;
  }
  headerView = /*#__PURE__*/React.createRef();
  contentView = /*#__PURE__*/React.createRef();
  pageIndex = -1;
  renderHeaderView = props => {
    return /*#__PURE__*/React.createElement(PageHeaderView, _extends({
      ref: this.headerView
    }, this.props, props, {
      onSelectedPageIndex: pageIndex => {
        var _this$contentView;
        this === null || this === void 0 || (_this$contentView = this.contentView) === null || _this$contentView === void 0 || (_this$contentView = _this$contentView.current) === null || _this$contentView === void 0 || _this$contentView.scrollPageIndex(pageIndex);
        (props === null || props === void 0 ? void 0 : props.onSelectedPageIndex) && props.onSelectedPageIndex(pageIndex);
      }
    }));
  };
  renderContentView = props => {
    return /*#__PURE__*/React.createElement(PageContentView, _extends({
      ref: this.contentView
    }, this.props, props, {
      onInitScrollPageIndexValue: scrollPageIndexValue => {
        var _this$headerView;
        this === null || this === void 0 || (_this$headerView = this.headerView) === null || _this$headerView === void 0 || (_this$headerView = _this$headerView.current) === null || _this$headerView === void 0 || _this$headerView.bindScrollPageIndexValue(scrollPageIndexValue);
        scrollPageIndexValue.addListener(_ref => {
          let {
            value
          } = _ref;
          let willReloadPageIndex = Math.round(value);
          if (willReloadPageIndex !== this.pageIndex) {
            var _this$props$onSelecte, _this$props;
            this.pageIndex = willReloadPageIndex;
            (_this$props$onSelecte = (_this$props = this.props).onSelectedPageIndex) === null || _this$props$onSelecte === void 0 || _this$props$onSelecte.call(_this$props, this.pageIndex);
          }
        });
      }
    }));
  };
}
//# sourceMappingURL=PageManager.js.map