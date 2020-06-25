import jestExpect from 'expect'; // eslint-disable-line import/no-extraneous-dependencies
import { getText } from 'detox-getprops';
import { TEST_IDS } from '../src/config/constants';
import { decodeJson, pause } from './utils';

const {
  PICKER,
  CONFIRM_BUTTON,
  CLOSE_AREA,
} = TEST_IDS;

const SELECTIONS = 'SEGMENTED_PICKER_SELECTIONS';

describe('Native iOS UIPickerView', () => {
  beforeEach(async () => {
    if (process.env.E2E_PLATFORM === 'ios') {
      await device.reloadReactNative();
    } else {
      await device.launchApp({ delete: true });
    }
  });

  test('Falls back to JavaScript when running on Android', async (done) => {
    if (process.env.E2E_PLATFORM === 'ios') {
      console.info('Skipping (Android only).');
      return done();
    }

    const OPEN_BUTTON = 'EXAMPLE_C';
    await expect(element(by.id(OPEN_BUTTON))).toBeVisible();
    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(PICKER))).toBeVisible();
    return done();
  });

  test('Selections should remain blank after canceling the first time', async (done) => {
    if (process.env.E2E_PLATFORM !== 'ios') {
      console.info('Skipping (iOS only).');
      return done();
    }

    const OPEN_BUTTON = 'EXAMPLE_C';
    await expect(element(by.id(OPEN_BUTTON))).toBeVisible();
    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(CLOSE_AREA))).toBeVisible();
    await element(by.id(CLOSE_AREA)).tap();
    await expect(element(by.id(PICKER))).toBeNotVisible();
    await pause(500);
    const selections = decodeJson(await getText(element(by.id(SELECTIONS))));
    jestExpect(selections.col_1).not.toBeDefined();
    return done();
  });

  test('Updates the selection and sets a default value on re-open', async (done) => {
    if (process.env.E2E_PLATFORM !== 'ios') {
      console.info('Skipping (iOS only).');
      return done();
    }

    const OPEN_BUTTON = 'EXAMPLE_C';
    const NATIVE_PICKER = 'example_native_picker';
    const COL_1 = 'col_1';
    let selections;
    await expect(element(by.id(OPEN_BUTTON))).toBeVisible();
    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(NATIVE_PICKER))).toBeVisible();
    await element(by.id(NATIVE_PICKER)).setColumnToValue(0, 'Option 2');
    await element(by.id(CONFIRM_BUTTON)).tap();
    await expect(element(by.id(PICKER))).toBeNotVisible();
    await pause(500);
    selections = decodeJson((await getText(element(by.id(SELECTIONS)))));
    jestExpect(selections[COL_1]).toEqual('option_2');

    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(NATIVE_PICKER))).toBeVisible();
    await element(by.id(NATIVE_PICKER)).setColumnToValue(0, 'Option 5');
    await element(by.id(CLOSE_AREA)).tap();
    await expect(element(by.id(PICKER))).toBeNotVisible();
    await pause(500);
    selections = decodeJson((await getText(element(by.id(SELECTIONS)))));
    jestExpect(selections[COL_1]).toEqual('option_2');

    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(NATIVE_PICKER))).toBeVisible();
    await element(by.id(NATIVE_PICKER)).setColumnToValue(0, 'Option 5');
    await element(by.id(CONFIRM_BUTTON)).tap();
    await expect(element(by.id(PICKER))).toBeNotVisible();
    await pause(500);
    selections = decodeJson((await getText(element(by.id(SELECTIONS)))));
    jestExpect(selections[COL_1]).toEqual('option_5');

    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(NATIVE_PICKER))).toBeVisible();
    return done();
  });
});
