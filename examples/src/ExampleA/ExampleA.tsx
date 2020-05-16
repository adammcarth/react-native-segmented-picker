import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import SegmentedPicker, {
  PickerOptions,
} from 'react-native-segmented-picker';
import Button from '../Button';
import { generateOptions } from '../utils';

interface Props {
  columns: number;
}

interface State {
  options: PickerOptions;
  selections: { [column: string]: string };
}

class ExampleA extends Component<Props, State> {
  segmentedPicker: React.RefObject<SegmentedPicker> = React.createRef();

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
    };
  }

  showPicker = () => {
    this.segmentedPicker.current.show();
  };

  onConfirm = (selections) => {
    this.setState({
      selections: Object.keys(selections)
        .reduce((newDefaults, column) => ({
          ...newDefaults,
          [column]: selections[column].label,
        }), {}),
    }, () => {
      setTimeout(() => {
        Alert.alert(
          'Selections:',
          Object.keys(selections)
            .map(column => (
              `${column}: '${selections[column].label}'`
            ))
            .join(', '),
        );
      }, 500);
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
