import React, { Component } from 'react';
import type { RefObject } from 'react';
import { View, Animated } from 'react-native';
import type { LayoutRectangle } from 'react-native';
interface PageHeaderCursorProps {
    data: any[];
    cursorStyle?: object;
    scrollPageIndexValue: Animated.Value;
    renderCursor?: () => React.ReactElement | null;
}
interface PageHeaderCursorState {
    itemContainerLayoutList: (LayoutRectangle | undefined)[];
}
export default class PageHeaderCursor extends Component<PageHeaderCursorProps> {
    state: PageHeaderCursorState;
    reloadItemListContainerLayout: (refList: Array<RefObject<View>>, scrollRef: RefObject<View>) => void;
    private _findPercentCursorWidth;
    private _findFixCursorWidth;
    private _reloadPageIndexValue;
    shouldComponentUpdate(nextProps: PageHeaderCursorProps, nextState: PageHeaderCursorState): boolean;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=PageHeaderCursor.d.ts.map