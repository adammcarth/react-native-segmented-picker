import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import SegmentedPicker from 'react-native-segmented-picker';
import PropTypes from 'prop-types';
import Button from '../Button';
import { generateOptions } from '../utils';

class ExampleA extends Component {
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
    this.segmentedPicker = React.createRef();
  }

  showPicker = () => {
    this.segmentedPicker.show();
  }

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
  }

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
          ref={(ref) => { this.segmentedPicker = ref; }}
          onConfirm={this.onConfirm}
          options={options}
          defaultSelections={selections}
        />
      </View>
    );
  }
}

ExampleA.propTypes = {
  columns: PropTypes.number.isRequired,
};

export default ExampleA;
