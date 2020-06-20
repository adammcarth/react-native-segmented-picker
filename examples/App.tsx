import React from 'react';
import { View, Text, requireNativeComponent, UIManager, findNodeHandle } from 'react-native';
import { Selections } from 'react-native-segmented-picker';
import './src/config/YellowBox';
import { showSelections } from './src/utils';
import ExampleA from './src/ExampleA';
import ExampleB from './src/ExampleB';

interface Props {}

interface State {
  stringifiedSelections: string;
}

export default class SegmentedPickerDemo extends React.Component<Props, State> {
  uiPickerRef: any;

  constructor(props) {
    super(props);
    this.state = {
      stringifiedSelections: '{}',
    };
  }

  componentDidMount() {
    setTimeout(() => {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this.uiPickerRef),
        UIManager.UIPicker.Commands.confirmSelections,
        [],
      );
    }, 10000);
  }

  /**
   * Keeps a log of the latest selection JSON from any of the examples below. This is
   * required for the E2E tests, where we place this content in a hidden view on the screen.
   */
  onConfirm = (selections: Selections) => {
    this.setState({
      stringifiedSelections: JSON.stringify(selections),
    }, () => {
      showSelections(selections);
    });
  };

  render() {
    const UIPicker = requireNativeComponent('UIPicker');
    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
        }}
      >
        <View style={{ width: '100%' }}>
          <ExampleA columns={1} onConfirm={this.onConfirm} />
          <ExampleA columns={2} onConfirm={this.onConfirm} />
          <ExampleA columns={3} onConfirm={this.onConfirm} />
          <ExampleB columns={1} onConfirm={this.onConfirm} />
          <UIPicker
            ref={e => this.uiPickerRef = e}
            style={{ width: 300, height: 200 }}
            options={{ column1: [{ label: 'Adam' }, { label: 'Emma' }], column2: [{ label: 'Rob' }] }}
            defaultSelections={{ column1: 'Emma' }}
            onValueChange={e => console.info('onValueChange', e.nativeEvent)}
            onConfirm={e => console.info('onConfirm', e.nativeEvent)}
          />
        </View>

        <View style={{ position: 'absolute', bottom: 0, left: 0 }}>
          <Text style={{ fontSize: 8, color: '#FFFFFF' }} testID="SEGMENTED_PICKER_SELECTIONS">
            {encodeURIComponent(this.state.stringifiedSelections)}
          </Text>
        </View>
      </View>
    );
  }
}
