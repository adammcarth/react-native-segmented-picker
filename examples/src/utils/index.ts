import { PickerItem } from 'react-native-segmented-picker';

export * from './showSelections';

export const generatePickerItems = (
  columnId: string,
  numItems: number,
  startNum: number = 1,
): Array<PickerItem> => {
  const options: Array<PickerItem> = [];
  for (let i = (startNum - 1); i < ((startNum - 1) + numItems); i += 1) {
    const label = `Option ${i + 1}`;
    const id = `option_${i + 1}`;
    options.push({
      label,
      value: id,
      key: id,
      testID: `${columnId}_${id}`,
    });
  }
  return options;
};
