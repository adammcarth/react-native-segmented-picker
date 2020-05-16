export interface PickerItem {
  label: string;
  [x: string]: any;
}

export interface PickerOptions {
  [column: string]: Array<PickerItem>;
}

export interface Selections {
  [column: string]: PickerItem;
}
