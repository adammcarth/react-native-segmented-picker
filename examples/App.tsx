import React from 'react';
import { View, Text } from 'react-native';
import { Selections } from 'react-native-segmented-picker';
import './src/config/YellowBox';
import { showSelections } from './src/utils';
import ExampleA from './src/ExampleA';
import ExampleB from './src/ExampleB';
import ExampleC from './src/ExampleC';
import ExampleD from './src/ExampleD';

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
          <ExampleB onConfirm={this.onConfirm} />
          <ExampleC onConfirm={this.onConfirm} />
          <ExampleD onConfirm={this.onConfirm} />
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
