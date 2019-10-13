# React Native Segmented Picker

[![CircleCI](https://circleci.com/gh/adammcarth/react-native-segmented-picker.svg?style=svg)](https://circleci.com/gh/adammcarth/react-native-segmented-picker)

A pure JavaScript implementation of the iOS style wheel spinner dropdown picker that is typically used for date and time selection.

- Supports one or many columns (list segments).
- Show any data in the picklists, not just dates and times.
- Customisable colors and sizing.
- Does not rely on native dependencies (`npm link` not required).
- Works with apps built on [Expo](https://expo.io).

## Installation

```bash
$ yarn add react-native-segmented-picker
# or
# $ npm install --save react-native-segmented-picker
```

## Usage

```jsx
import React, { Component } from 'react;
import SegmentedPicker from 'react-native-segmented-picker';

class Example extends Component {
  constructor(props) {
    super(props);
    this.segmentedPicker = React.createRef();
  }

  componentDidMount() {
    // Can alternatively be shown with the `visible` prop for redux etc.
    this.segmentedPicker.show();
  }

  onConfirm = (selections) => {
    console.info(selections);
    // => { column1: { label: 'Option 1' }, column2: { label: 'Option 3' } }
  }

  render() {
    return (
      <SegmentedPicker
        ref={this.segmentedPicker}
        onConfirm={this.onConfirm}
        options={{
          column1: [
            { label: 'Option 1' },
            { label: 'Option 2' },
          ],
          column2: [
            { label: 'Option 3' },
          ],
        }}
      />
    );
  }
}
```

Further examples can be found in [./examples/src](https://github.com/adammcarth/react-native-segmented-picker/tree/master/examples/src).

## Props, Events & Methods Reference

### Props

| Prop                         | Description                                                                    | Default     |
|------------------------------|--------------------------------------------------------------------------------|-------------|
| `options`                    | Data to be populated into the picklists. `{columnId: [{label: ''}, ...], ...}` |             |
| `visible`                    | Not used by default. Set to `true` or `false` to manually handle visibility.   | `null`      |
| `defaultSelections`          | Eg: `{columnId: 'label string to auto-select', ...}`                           | `{}`        |
| `confirmText`                | Text displayed in the top right hand corner.                                   | `'Done'`    |
| `size`                       | Fixed percentage of the screen to render the picklist container over.          | `40`        |
| `confirmTextColor`           | Color of the `confirmText` button.                                             | `'#0A84FF'` |
| `toolbarBackground`          | Background color of the top container where the `confirmText` is displayed.    | `'#FAFAF8'` |
| `toolbarBorderColor`         | Bottom border color of the `toolbarContainer`.                                 | `'#E7E7E7'` |
| `listItemTextColor`          | Color of the text for each item in the picklist.                               | `'#282828'` |
| `selectionMarkerBackground`  | Background color of the container which overlays the current selected item.    | `'#F8F8F8'` |
| `selectionMarkerBorderColor` | Border color (top and bottom) of the selection marker overlay.                 | `'#DCDCDC'` |
| `containerBackground`        | Background color of the inner SegmentedPicker container.                       | `'#FFFFFF'` |

### Event Props

| Event Prop                                 | When and how?                                                                                 |
|--------------------------------------------|-----------------------------------------------------------------------------------------------|
| `onValueChange={(columnId, value) => ...}` | Emitted each time a picklist value is modified by a user.                                     |
| `onCancel={(selections) => ...}`           | Emitted when a user touches out of the modal, or presses the hardware back button on Android. |
| `onConfirm={(selections) => ...}`          | Emitted when a user presses the confirm text button.                                          |

### Methods

Remember that you will need to [set a ref](https://reactjs.org/docs/refs-and-the-dom.html#creating-refs) for the `<SegmentedPicker />` component in order to use the methods outlined below.

#### ref.show();

Display the Segmented Picker modal over all other content on the screen. This is the preferred method of showing a `<SegmentedPicker />` so that you don't have to manually hide the component after listening to the `onCancel` and `onConfirm` events.

Note that this method will have no effect if the `visible` prop is set.

#### ref.hide();

Hide the Segmented Picker modal from the screen. Generally should not be required, as this method is automatically called by this library after events where visibility should be toggled off.

#### ref.selectLabel(label, columnId, animated=true, emitEvent=true, zeroFallback=false);

Programmatically select a label from a list column while the component is displaying.

- `{string} label`: Eg 'Option 1'
- `{string} columnId`: Eg 'column1'
- `{boolean=true} animated`: Scroll or snap to the item?
- `{boolean=true} emitEvent`: Specify whether to emit the `onValueChange` event.
- `{boolean=false} zeroFallback` Select the first list item if not found.

#### ref.selectIndex(index, columnId, animated=true, emitEvent=true);

Programmatically select an array index from a list column while the component is displaying. This method will give you better performance than the above if you already know the index of the item that you want to select.

- `{number} index`: Eg 0
- `{string} columnId`: Eg 'column1'
- `{boolean=true} animated`: Scroll or snap to the item?
- `{boolean=true} emitEvent`: Specify whether to emit the `onValueChange` event.

#### ref.getCurrentSelections();

Returns the current selected items as they appear in the UI. This is the same method that's used internally when the `onCancel` and `onConfirm` events are fired.

## Contributions

This is an open source project. Bug fixes, improvements and the addition of useful new features to this package are greatly appreciated.

1. Fork and clone the [repository from GitHub](https://github.com/adammcarth/react-native-segmented-picker).
2. Setup: `yarn install`.
3. Checkout a new branch, eg: `feature/my-thing` or `bugfix/terrible-thing`.
4. After making any changes, make sure that `yarn run test` still passes.
5. Ask yourself if there's a *new* unit test that you could write to capture your changes?
6. Submit a pull request to `master` outlining what your change is and how you tested it.

Made with love in Melbourne [Adam McArthur](https://github.com/adammcarth).
