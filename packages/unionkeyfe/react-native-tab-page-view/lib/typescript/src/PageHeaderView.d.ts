import React, { Component } from 'react';
import type { ReactElement } from 'react';
import { Animated } from 'react-native';
import type { ScrollViewProps } from 'react-native';
interface PageHeaderViewProps extends ScrollViewProps {
    data: any[];
    itemContainerStyle?: object;
    initialScrollIndex?: number;
    renderItem?: (item: any, index: number, titleStyle: object) => React.ReactNode;
    titleFromItem?: (item: any, index: number) => string;
    itemTitleStyle?: object;
    itemTitleNormalStyle?: object;
    itemTitleSelectedStyle?: object;
    cursorStyle?: object;
    renderCursor?: () => React.ReactElement | null;
    onSelectedPageIndex?: (index: number) => void;
    selectedPageIndexDuration?: number;
    shouldSelectedPageIndex?: (pageIndex: number) => boolean;
    scrollContainerStyle?: object;
    contentContainerStyle?: object;
    containerStyle?: object;
    ToolBar?: ReactElement;
}
export default class PageHeaderView extends Component<PageHeaderViewProps> {
    private scrollPageIndex;
    private scrollPageIndexValue;
    private nextScrollPageIndex;
    private shouldHandlerAnimationValue;
    private itemConfigList;
    private itemContainerStyle;
    private itemTitleNormalStyle;
    private itemTitleSelectedStyle;
    private cursorStyle;
    private scrollView;
    private cursor;
    private scrollViewWidth;
    static defaultProps: PageHeaderViewProps;
    bindScrollPageIndexValue: (scrollPageIndexValue: Animated.Value) => void;
    private addScrollPageIndexListener;
    constructor(props: PageHeaderViewProps);
    componentWillUnmount(): void;
    private _animation;
    private _itemTitleProps;
    private _renderTitle;
    private _itemDidTouch;
    private _renderItem;
    private _renderCursor;
    shouldComponentUpdate(nextProps: PageHeaderViewProps): boolean;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=PageHeaderView.d.ts.map