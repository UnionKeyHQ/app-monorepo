import { Component } from 'react';
import type { ViewStyle } from 'react-native';
interface SelectedLabelProps {
    text: string;
    normalColor: string;
    selectedColor: string;
    selectedScale: number;
    style: ViewStyle;
}
export default class SelectedLabel extends Component<SelectedLabelProps> {
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=index.d.ts.map