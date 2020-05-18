import { Alert } from 'react-native';
import { Selections } from 'react-native-segmented-picker';

export const showSelections = (selections: Selections) => {
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
};
