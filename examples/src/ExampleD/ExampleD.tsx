import React, { Component } from 'react';
import { View } from 'react-native';
import SegmentedPicker, {
  PickerOptions,
  Selections,
  ANIMATION_TIME,
} from 'react-native-segmented-picker';
import Button from '../Button';

interface Props {
  onConfirm: (selections: Selections) => void;
}

interface State {
  options: PickerOptions;
  selections: Selections;
  visible: boolean;
}

class ExampleD extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      options: [
        {
          key: 'level',
          testID: 'level',
          flex: 3,
          items: [
            { label: 'Level 1', value: 'L1', testID: 'level_L1' },
            { label: 'Level 2', value: 'L2', testID: 'level_L2' },
            { label: 'Level 3', value: 'L3', testID: 'level_L3' },
            { label: 'Level 4', value: 'L4', testID: 'level_L4' },
            { label: 'Level 5', value: 'L5', testID: 'level_L5' },
          ],
        },
        {
          key: 'tower',
          testID: 'tower',
          flex: 1,
          items: [
            { label: 'T1', value: 'T1', testID: 'tower_T1' },
            { label: 'T2', value: 'T2', testID: 'tower_T2' },
            { label: 'T3', value: 'T3', testID: 'tower_T3' },
          ],
        },
        {
          key: 'section',
          testID: 'section',
          flex: 1,
          items: [
            { label: 'S1', value: 'S1', testID: 'section_S1' },
            { label: 'S2', value: 'S2', testID: 'section_S2' },
            { label: 'S3', value: 'S3', testID: 'section_S3' },
          ],
        },
        {
          key: 'room',
          testID: 'room',
          flex: 4,
          items: [
            { label: 'Red Room', value: 'red', testID: 'room_red' },
            { label: 'Green Room', value: 'green', testID: 'room_green' },
            { label: 'Orange Room', value: 'orange', testID: 'room_orange' },
            { label: 'Blue Room', value: 'blue', testID: 'room_blue' },
          ],
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
          text="Example D (Flex Width)"
          onPress={this.showPicker}
          backgroundColor="#890bbf"
          testID="EXAMPLE_D"
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

export default ExampleD;
