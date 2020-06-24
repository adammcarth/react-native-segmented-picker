import React, { Component } from 'react';
import { View } from 'react-native';
import SegmentedPicker, {
  PickerOptions,
  Selections,
} from 'react-native-segmented-picker';
import Button from '../Button';
import { generatePickerItems } from '../utils';

interface Props {
  columns: number;
  onConfirm: (selections: Selections) => void;
}

interface State {
  options: PickerOptions;
  selections: Selections;
}

class ExampleA extends Component<Props, State> {
  segmentedPicker: React.RefObject<SegmentedPicker> = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      options: Array(props.columns)
        .fill('')
        .reduce((options, emptyString, index) => ([
          ...options,
          {
            key: `column_${index + 1}`,
            testID: `column_${index + 1}`,
            items: generatePickerItems(`${index + 1}`, 25),
          },
        ]), []),
      selections: {},
    };
  }

  showPicker = () => {
    this.segmentedPicker.current.show();
  };

  onConfirm = (selections: Selections) => {
    this.setState({
      selections,
    }, () => {
      this.props.onConfirm(selections);
    });
  };

  render() {
    const { options, selections } = this.state;
    const { columns } = this.props;

    return (
      <View style={{ width: '100%', alignItems: 'center' }}>
        <Button
          text={`Example A (${columns} Col)`}
          onPress={this.showPicker}
          testID={`EXAMPLE_A_${columns}_COL`}
        />

        <SegmentedPicker
          ref={this.segmentedPicker}
          onConfirm={this.onConfirm}
          options={options}
          defaultSelections={selections}
        />
      </View>
    );
  }
}

export default ExampleA;
