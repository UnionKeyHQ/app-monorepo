import React from 'react';
import type { RefObject } from 'react';
import PageHeaderView from './PageHeaderView';
import PageContentView from './PageContentView';
interface PageManagerProps {
    data: any[];
    initialScrollIndex?: number;
    onSelectedPageIndex?: (pageIndex: number) => void;
}
export default class PageManager extends React.Component<PageManagerProps> {
    static defaultProps: PageManagerProps;
    constructor(props: PageManagerProps);
    headerView: RefObject<PageHeaderView> | null;
    contentView: RefObject<PageContentView> | null;
    pageIndex: number;
    renderHeaderView: (props: any) => JSX.Element;
    renderContentView: (props: any) => JSX.Element;
}
export {};
//# sourceMappingURL=PageManager.d.ts.map