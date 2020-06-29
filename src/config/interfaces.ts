export type PickerOptions = Array<PickerColumn>;

export interface PickerColumn {
  key: string;
  items: Array<PickerItem>;
  flex?: number;
  testID?: string;
}

export interface PickerItem {
  label: string;
  value: string;
  key?: string;
  testID?: string;
}

export interface Selections {
  [column: string]: string;
}

export interface SelectionEvent {
  column: string;
  value: string;
}

export interface UIPickerValueChangeEvent {
  nativeEvent: {
    column: string;
    value: string;
  };
}

export interface UIPickerSelectionsEvent {
  nativeEvent: {
    selections: {
      [column: string]: string;
    };
    pid: number;
  };
}
