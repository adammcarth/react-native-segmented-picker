import { Alert } from 'react-native';
import { Selections } from 'react-native-segmented-picker';

export const showSelections = (selections: Selections) => {
  Alert.alert(
    'Selections:',
    Object.keys(selections)
      .map(column => (
        `${column}: '${selections[column]}'`
      ))
      .join(', '),
  );
};
