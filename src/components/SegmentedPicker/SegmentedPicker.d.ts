import * as React from 'react';

export interface SegmentedPickerOption {
  /** An optional provided key to use */
  key?: string | number;
  /** The Label Options to Show */
  label: string;
}

export interface SegmentedPickerProps {
  /**
   * Text displayed into the Confirm Toolbar.
   * 
   * ---
   * 
   * Default to
   * ```js
   * 'Done'
   * ```
   */
  confirmText?: string;

  /**
   * Color used to render the confirm text.
   * 
   * ---
   * 
   * Default to
   * ```js
   * `#0A84FF`
   * ```
   */
  confirmTextColor?: string;

  /**
   * Background color used to render the SegmentedPicker container
   * 
   * ---
   * 
   * Default to
   * ```js
   * `#FFFFFF`
   * ```
   */
  containerBackground?: string;

  /**
   * Default value automatically selected
   * after component has been rendered
   */
  defaultSelections?: {
    [key: string]: string
  };

  /**
   * Color used to render list item text
   * 
   * ---
   * 
   * Default to
   * ```js
   * `#282828`
   * ```
   */
  listItemTextColor?: string;

  /**
   * Function called when a user touches out of the modal
   * or presses the hardware back button on Android Device
   */
  onCancel?: (selections: { [key: string]: SegmentedPickerOption }) => void;

  /**
   * Function called when a user presses the confirm text button
   */
  onConfirm?: (selections: { [key: string]: SegmentedPickerOption }) => void;

  /**
   * Function called each time a picklist values is modified by user
   */
  onValueChange?: (columId: string, selected: SegmentedPickerOption) => void;

  /**
   * The options to use to populate
   * the Segmented Picker Component.
   * Each objects keys will create a new
   * column populated with data array
   */
  options: {
    [key: string]: SegmentedPickerOption[]
  };

  /**
   * Background color used to render the container
   * which overlays the current selected item
   * 
   * ---
   * 
   * Default to
   * ```js
   * `#F8F8F8F`
   * ```
   */
  selectionMarkerBackground?: string;

  /**
   * Border color used to render the container
   * which overlays the current selected item
   * 
   * ---
   * 
   * Default to
   * ```js
   * `#DCDCDC`
   * ```
   */
  selectionMarkerBorderColor?: string;

  /**
   * The color used to render the toolbar background
   * 
   * ---
   * 
   * Default to
   * ```js
   * `#FAFAF8`
   * ```
   */
  toolbarBackground?: string;

  /**
   * Color used to render toolbar border
   * 
   * ---
   * 
   * Default to
   * ```js
   * `#E7E7E7`
   * ```
   */
  toolbarBorderColor?: string;

  /**
   * The percentage size of the screen used
   * to render the picklist container.
   * 
   * ---
   * 
   * Default to
   * ```js
   * 45
   * ```
   */
  size?: number;

  /**
   * Use the `visible` option to manually control
   * the visibility of the component.
   */
  visible?: boolean;
}

declare class SegmentedPicker extends React.Component<SegmentedPickerProps, any> {

  /**
   * Returns the current selected items
   * as they appear in the UI.
   * 
   * This is the same method that's used
   * internally when the `onCancel` and `onConfirm` events are fired.
   */
  getCurrentSelections(): { [key: string]: SegmentedPickerOption }

  /**
   * Hide the Segmented Picker modal from the screen.
   * 
   * Generally should not be required, as this method is automatically
   * called by this library after events where visibility should be toggled off.
   */
  hide(): void;

  /**
   * Programmatically select an array index
   * from a list column while the component is displaying.
   * This method will give you better performance than `selectLabel`
   * if you already know the index of the item that you want to select.
   * 
   * @param index The option index
   * @param columnId The column id where's label is contained
   * @param animated Smooth scroll to item. Default to `true`
   * @param emitEvent Emit the `onValueChange` event. Default to `true`
   */
  selectIndex(index: number, columId: string, animated?: boolean, emitEvent?: boolean): void

  /**
   * Programmatically select a label from a list column while the component is displaying.
   * 
   * @param label The option label to Select
   * @param columnId The column id where's label is contained
   * @param animated Smooth scroll to item. Default to `true`
   * @param emitEvent Emit the `onValueChange` event. Default to `true`
   * @param fallbackToZero Select the first list item if not found. Default to `false`
   */
  selectLabel(label: string, columnId: string, animated?: boolean, emitEvent?: boolean, fallbackToZero?: boolean): void

  /**
   * Display the Segmented Picker modal over all other content on the screen.
   * 
   * This is the preferred method of showing a `<SegmentedPicker />`
   * so that you don't have to manually hide the component
   * after listening to the `onCancel` and onConfirm events.
   * 
   * Note that this method will have no effect if the visible prop is set.
   */
  show(): void;

}

export default SegmentedPicker;
