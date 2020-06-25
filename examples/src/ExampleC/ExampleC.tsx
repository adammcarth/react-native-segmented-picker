import React, { Component } from 'react';
import { View } from 'react-native';
import SegmentedPicker, {
  PickerOptions,
  Selections,
  ANIMATION_TIME,
} from 'react-native-segmented-picker';
import Button from '../Button';
import { generatePickerItems } from '../utils';

interface Props {
  onConfirm: (selections: Selections) => void;
}

interface State {
  options: PickerOptions;
  selections: Selections;
  visible: boolean;
}

class ExampleC extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      options: [
        {
          key: 'col_1',
          testID: 'col_1',
          items: generatePickerItems('col_1', 25),
        },
      ],
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
      selections,
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
          text="Example C (Native iOS)"
          onPress={this.showPicker}
          backgroundColor="#f0af0a"
          testID="EXAMPLE_C"
        />

        <SegmentedPicker
          native
          nativeTestID="example_native_picker"
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

export default ExampleC;
