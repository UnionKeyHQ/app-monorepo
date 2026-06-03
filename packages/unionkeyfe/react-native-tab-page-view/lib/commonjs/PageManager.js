"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _PageHeaderView = _interopRequireDefault(require("./PageHeaderView"));
var _PageContentView = _interopRequireDefault(require("./PageContentView"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
class PageManager extends _react.default.Component {
  static defaultProps = {
    data: [],
    initialScrollIndex: 0,
    onSelectedPageIndex: () => {}
  };
  constructor(props) {
    super(props);
    this.pageIndex = props.initialScrollIndex ?? 0;
  }
  headerView = /*#__PURE__*/_react.default.createRef();
  contentView = /*#__PURE__*/_react.default.createRef();
  pageIndex = -1;
  renderHeaderView = props => {
    return /*#__PURE__*/_react.default.createElement(_PageHeaderView.default, _extends({
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
    return /*#__PURE__*/_react.default.createElement(_PageContentView.default, _extends({
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
exports.default = PageManager;
//# sourceMappingURL=PageManager.js.map