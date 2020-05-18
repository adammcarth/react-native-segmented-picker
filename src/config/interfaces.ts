export interface PickerItem {
  label: string;
  key?: string;
  testID?: string;
  [x: string]: any;
}

export interface PickerOptions {
  [column: string]: Array<PickerItem>;
}

export interface Selections {
  [column: string]: PickerItem;
}
