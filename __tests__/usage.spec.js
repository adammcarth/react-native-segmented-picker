describe('<SegmentedPicker />', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  test('Scroll through a 1 column example and check emitted selections', async () => {
    await expect(element(by.id('EXAMPLE_A_1_COL'))).toBeVisible();
  });
});
