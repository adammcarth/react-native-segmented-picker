import React, { Component } from 'react';
import { View } from 'react-native';
import SegmentedPicker, {
  PickerOptions,
  Selections,
  ANIMATION_TIME,
} from 'react-native-segmented-picker';
import Button from '../Button';
import { generateOptions } from '../utils';

interface Props {
  columns: number;
  onConfirm: (selections: Selections) => void;
}

interface State {
  options: PickerOptions;
  selections: { [column: string]: string };
  visible: boolean;
}

class ExampleA extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      options: Array(props.columns)
        .fill('')
        .reduce((options, emptyString, index) => ({
          ...options,
          [`column${index + 1}`]: generateOptions(25),
        }), {}),
      selections: {},
      visible: false,
    };
  }

  showPicker = () => {
    this.setState({ visible: true });
  };

  hidePicker = () => {
    this.setState({ visible: false });
  };

  onConfirm = (selections: Selections) => {
    this.setState({
      visible: false,
      selections: Object.keys(selections)
        .reduce((newDefaults, column) => ({
          ...newDefaults,
          [column]: selections[column].label,
        }), {}),
    }, async () => {
      // Wait for the close animation time to avoid fade out glitches!
      await new Promise(resolve => setTimeout(resolve, ANIMATION_TIME));
      this.props.onConfirm(selections);
    });
  };

  render() {
    const { options, selections, visible } = this.state;

    return (
      <View style={{ width: '100%', alignItems: 'center' }}>
        <Button
          text="Example B (Prop Visibility)"
          onPress={this.showPicker}
          backgroundColor="#25885d"
          testID="EXAMPLE_B"
        />

        <SegmentedPicker
          visible={visible}
          onConfirm={this.onConfirm}
          onCancel={this.hidePicker}
          options={options}
          defaultSelections={selections}
        />
      </View>
    );
  }
}

export default ExampleA;
