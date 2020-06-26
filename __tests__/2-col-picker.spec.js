import jestExpect from 'expect'; // eslint-disable-line import/no-extraneous-dependencies
import { getText } from 'detox-getprops';
import { TEST_IDS } from '../src/config/constants';
import { decodeJson, pause } from './utils';

const {
  PICKER,
  CONFIRM_BUTTON,
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
    const COL_1 = 'col_1';
    const COL_2 = 'col_2';
    await expect(element(by.id(OPEN_BUTTON))).toBeVisible();
    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(COL_1))).toBeVisible();
    await element(by.id(`${COL_1}_option_2`)).tap();
    await element(by.id(`${COL_2}_option_3`)).tap();
    await pause(1000);
    await element(by.id(CONFIRM_BUTTON)).tap();
    await expect(element(by.id(PICKER))).toBeNotVisible();
    await pause(500);
    const selections = decodeJson(await getText(element(by.id(SELECTIONS))));
    jestExpect(selections[COL_1]).toEqual('option_2');
    jestExpect(selections[COL_2]).toEqual('option_3');
    await element(by.id(OPEN_BUTTON)).tap();
    await expect(element(by.id(COL_1))).toBeVisible();
  });
});
