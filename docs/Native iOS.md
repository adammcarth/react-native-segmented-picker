# Native iOS Picker

Starting from `v2.0.0`, there is an opt-in extension available for iOS which bridges this library with [UIPickerView](https://developer.apple.com/documentation/uikit/uipickerview) instead of using the default JavaScript implementation. This feature is _not_ compatible with Expo.

While enabling the extension is not mandatory, the advantages include:

- Improved list rendering performance.
- A more realistic "slot machine" animation.
- Haptic touch feedback (vibration) as users scroll through the list.

## Installation

1. Add the following to your `ios/Podfile`:

```diff
  target 'YourApp' do
    ...

+   pod 'RNSegmentedPicker', :podspec => '../node_modules/react-native-segmented-picker/RNSegmentedPicker.podspec'

    use_native_modules!
  end
```

2. Run `pod install` inside your project's `ios` directory.
3. Run `npm install react-native-swift` in your project root.
4. Run `react-native swiftify` in your project root to enable Swift compilation for third party libraries.
5. Re-build your app from Xcode.

## Usage

Simply add the `native` prop to any Segmented Picker component in your app.

```diff
  <SegmentedPicker
+   native
    options={[...]}
  />
```

This will enable the native view for iOS devices, while Android will continue to use the regular JavaScript implementation.

## Why is this not the default?

One of the core goals for this library is to make the iOS wheel picker accessible to all different kinds of React Native projects, regardless of the platform or underlying framework. While React Native 0.60+ made some fantastic improvements on automating the installation of native modules, this is still not an option for many projects (especially when using platforms like [Expo](https://expo.io)).

As such, it seems fitting to show confidence in the JavaScript implementation delivering a great experience for most use cases - leaving the native extension as an "optional extra" for more advanced projects.
