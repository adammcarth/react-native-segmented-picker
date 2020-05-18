import jestExpect from 'expect'; // eslint-disable-line import/no-extraneous-dependencies
import { getText } from 'detox-getprops';
import { TEST_IDS } from '../src/config/constants';
import { decodeJson, pause, scrollDistance } from './utils';

const {
  PICKER,
  CONFIRM_BUTTON,
  CLOSE_AREA,
  COLUMN,
} = TEST_IDS;

const SELECTIONS = 'SEGMENTED_PICKER_SELECTIONS';

describe('1 Column <SegmentedPicker />', () => {
  beforeEach(async () => {
    if (process.env.E2E_PLATFORM === 'ios') {
      await device.reloadReactNative();
    } else {
      await device.launchApp({ delete: true });
    }
  });

  test('Selections should remain blank after canceling the first time', async () => {
    const OPEN_BUTTON = 'EXAMPLE_A_1_COL';
    await expect(element(by.id(OPEN_BUTTON))).toBeVisible();
    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(CLOSE_AREA))).toBeVisible();
    await element(by.id(CLOSE_AREA)).tap();
    await expect(element(by.id(PICKER))).toBeNotVisible();
    await pause(500);
    const selections = decodeJson(await getText(element(by.id(SELECTIONS))));
    jestExpect(selections.column1).not.toBeDefined();
  });

  test('Updates the selection and sets a default value on re-open', async () => {
    const OPEN_BUTTON = 'EXAMPLE_A_1_COL';
    const COL_1 = `${COLUMN}column1`;
    let selections;
    await expect(element(by.id(OPEN_BUTTON))).toBeVisible();
    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(COL_1))).toBeVisible();
    await element(by.id(COL_1)).scroll(scrollDistance(1), 'down');
    await element(by.id(CONFIRM_BUTTON)).tap();
    await expect(element(by.id(PICKER))).toBeNotVisible();
    await pause(500);
    selections = decodeJson((await getText(element(by.id(SELECTIONS)))));
    jestExpect(selections.column1.label).toEqual('Option 2');

    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(COL_1))).toBeVisible();
    await element(by.id(COL_1)).scroll(scrollDistance(3), 'down');
    await element(by.id(CLOSE_AREA)).tap();
    await expect(element(by.id(PICKER))).toBeNotVisible();
    await pause(500);
    selections = decodeJson((await getText(element(by.id(SELECTIONS)))));
    jestExpect(selections.column1.label).toEqual('Option 2');

    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(COL_1))).toBeVisible();
    await element(by.id(COL_1)).scroll(scrollDistance(3), 'down');
    await element(by.id(CONFIRM_BUTTON)).tap();
    await expect(element(by.id(PICKER))).toBeNotVisible();
    await pause(500);
    selections = decodeJson((await getText(element(by.id(SELECTIONS)))));
    jestExpect(selections.column1.label).toEqual('Option 5');

    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(COL_1))).toBeVisible();
  });

  test('Tap a picker item (instead of scrolling) to set the value', async () => {
    const OPEN_BUTTON = 'EXAMPLE_A_1_COL';
    const COL_1 = `${COLUMN}column1`;
    await expect(element(by.id(OPEN_BUTTON))).toBeVisible();
    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(COL_1))).toBeVisible();
    await element(by.id(`${COL_1}_Option 3`)).tap();
    await pause(1000);
    await element(by.id(CONFIRM_BUTTON)).tap();
    await expect(element(by.id(PICKER))).toBeNotVisible();
    await pause(500);
    const selections = decodeJson(await getText(element(by.id(SELECTIONS))));
    jestExpect(selections.column1.label).toEqual('Option 3');

    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(COL_1))).toBeVisible();
  });
});
