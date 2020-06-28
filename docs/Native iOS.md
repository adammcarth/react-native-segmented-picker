# Native iOS Picker

Starting from `v2.0.0` and higher, there is an opt-in extension available for iOS which bridges this library with [UIPickerView](https://developer.apple.com/documentation/uikit/uipickerview) instead of using the default JavaScript implementation. This feature is _not_ compatible with Expo.

While enabling the extension is not mandatory, the advantages include:

- Improved list rendering performance.
- A more realistic "slot machine" animation.
- Haptic touch feedback (vibration) as users scroll through the list.

### Installation

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

### Usage

Simply add the `native` flag to any Segmented Picker component in your app.

```jsx
<SegmentedPicker native options={[...]} />
```

You will notice that Android devices continue to use the regular JavaScript implementation (since this feature is for iOS only).
