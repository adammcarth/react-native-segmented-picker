import { TEST_IDS } from '../src/config/constants';

const { PICKER, CONFIRM_BUTTON, CLOSE_AREA } = TEST_IDS;

describe('<SegmentedPicker /> Visibility Control', () => {
  beforeEach(async () => {
    if (process.env.E2E_PLATFORM === 'ios') {
      await device.reloadReactNative();
    } else {
      await device.launchApp({ delete: true });
    }
  });

  test('The picklist should open when toggled via `ref.show()` method', async () => {
    const OPEN_BUTTON = 'EXAMPLE_A_1_COL';
    await expect(element(by.id(OPEN_BUTTON))).toBeVisible();
    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(PICKER))).toBeVisible();
  });

  test('The picklist should hide when toggled via `ref.hide()` method', async () => {
    const OPEN_BUTTON = 'EXAMPLE_A_1_COL';
    await expect(element(by.id(OPEN_BUTTON))).toBeVisible();
    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(CLOSE_AREA))).toBeVisible();
    await element(by.id(CLOSE_AREA)).tap();
    await expect(element(by.id(PICKER))).toBeNotVisible();
    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(CONFIRM_BUTTON))).toBeVisible();
    await element(by.id(CONFIRM_BUTTON)).tap();
    await expect(element(by.id(PICKER))).toBeNotVisible();
  });

  test('The picklist should open when toggled via `visible` prop', async () => {
    const OPEN_BUTTON = 'EXAMPLE_B';
    await expect(element(by.id(OPEN_BUTTON))).toBeVisible();
    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(PICKER))).toBeVisible();
  });

  test('The picklist should hide when toggled via `visible` prop', async () => {
    const OPEN_BUTTON = 'EXAMPLE_B';
    await expect(element(by.id(OPEN_BUTTON))).toBeVisible();
    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(CLOSE_AREA))).toBeVisible();
    await element(by.id(CLOSE_AREA)).tap();
    await expect(element(by.id(PICKER))).toBeNotVisible();
    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(CONFIRM_BUTTON))).toBeVisible();
    await element(by.id(CONFIRM_BUTTON)).tap();
    await expect(element(by.id(PICKER))).toBeNotVisible();
  });
});
