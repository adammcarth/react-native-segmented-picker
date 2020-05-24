# Examples

This folder contains a barebones React Native project with some examples of the segmented picker in action. Code examples are located in the `src` folder.

- `src/ExampleA`: Very simple example of the component being used with 1, 2 and 3 columns.
- `src/ExampleB`: Example of using the `visible` prop to control picker visibility.
- `src/ExampleC`: TO DO! An example of changing list items based on selections.

## Installation & Setup

You can run this example project on your local machine to view the demos.

1. Install packages: `yarn`
2. Install or update cocoapods: `gem install cocoapods`
3. `cd ./ios && pod install && cd ../`
4. Setup a fake `node_module` with the below command:

```bash
# CWD: /react-native-segmented-picker

$ make install
```

### Run instructions for iOS:
- `react-native run-ios`
...OR...
- Open `./ios/SegmentedPickerDemo.xcworkspace` in Xcode or run `xed -b ios`
- Hit the Run button

### Run instructions for Android:
- Have an Android emulator running (quickest way to get started), or a device connected.
- `react-native run-android`
