import jestExpect from 'expect'; // eslint-disable-line import/no-extraneous-dependencies
import { getText } from 'detox-getprops';
import { TEST_IDS } from '../src/config/constants';
import { decodeJson, pause } from './utils';

const {
  PICKER,
  CONFIRM_BUTTON,
  COLUMN,
} = TEST_IDS;

const SELECTIONS = 'SEGMENTED_PICKER_SELECTIONS';

describe('2 Column <SegmentedPicker />', () => {
  beforeEach(async () => {
    if (process.env.E2E_PLATFORM === 'ios') {
      await device.reloadReactNative();
    } else {
      await device.launchApp({ delete: true });
    }
  });

  test('Sets the selection values for both columns when modified', async () => {
    const OPEN_BUTTON = 'EXAMPLE_A_2_COL';
    const COL_1 = `${COLUMN}column1`;
    const COL_2 = `${COLUMN}column2`;
    await expect(element(by.id(OPEN_BUTTON))).toBeVisible();
    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(COL_1))).toBeVisible();
    await element(by.id(`${COL_1}_Option 2`)).tap();
    await element(by.id(`${COL_2}_Option 3`)).tap();
    await pause(1000);
    await element(by.id(CONFIRM_BUTTON)).tap();
    await expect(element(by.id(PICKER))).toBeNotVisible();
    await pause(500);
    const selections = decodeJson(await getText(element(by.id(SELECTIONS))));
    jestExpect(selections.column1.label).toEqual('Option 2');
    jestExpect(selections.column2.label).toEqual('Option 3');
    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(COL_1))).toBeVisible();
  });
});
