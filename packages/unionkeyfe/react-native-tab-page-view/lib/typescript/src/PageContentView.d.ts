import { Component } from 'react';
import { Animated } from 'react-native';
import type { FlatListProps } from 'react-native';
interface PageContentViewProps extends FlatListProps<any> {
    shouldSelectedPageAnimation?: boolean;
    onInitScrollPageIndexValue?: (scrollPageIndex: Animated.AnimatedDivision<string | number>) => void;
}
interface PageContentViewState {
    scrollViewWidth: number;
}
export default class PageContentView extends Component<PageContentViewProps> {
    static defaultProps: PageContentViewProps;
    state: PageContentViewState;
    private _scrollViewWidthValue;
    private _contentOffsetValueX;
    private _scrollPageIndexValue;
    private _event;
    private scrollView;
    componentDidMount(): void;
    scrollPageIndex: (pageIndex: number, animated?: boolean | undefined) => void;
    private _onLayout;
    private _renderItem;
    shouldComponentUpdate(nextProps: PageContentViewProps, nextState: PageContentViewState): boolean;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=PageContentView.d.ts.map