import { Component } from 'react';
import type { FlatListProps } from 'react-native';
export interface ContentFlatListProps extends FlatListProps<any> {
    scrollViewWidth: number;
}
export default class ContentFlatList extends Component<ContentFlatListProps> {
    private pageIndex;
    private isDraging;
    private hasScrolledToInitScrollIndex;
    private panResponder;
    private scrollView;
    constructor(props: ContentFlatListProps);
    private _onPanGestureStart;
    private _onPanGestureMove;
    private _onPanGestureEnd;
    private _onScroll;
    scrollToIndex: (config: {
        animated: boolean;
        index: number;
    }) => void;
    reloadScrollContainerWidth: (_: number) => void;
    render(): JSX.Element;
}
//# sourceMappingURL=index.d.ts.map