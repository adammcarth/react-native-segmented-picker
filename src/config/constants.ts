/**
 * Time in milliseconds for the list to fade in and out when displayed.
 */
export const ANIMATION_TIME = 300;

/**
 * Fixed sizing for list items and other UI elements.
 */
export const GUTTER_WIDTH = 18;
export const GUTTER_HEIGHT = 5;
export const ITEM_HEIGHTS = { ios: 46, default: 50 };
export const TEXT_CORRECTION = 2;

/**
 * Constants used for automatically generated Test ID's (used for E2E testing).
 */
export const TEST_IDS = {
  PICKER: 'SEGMENTED_PICKER',
  CONFIRM_BUTTON: 'SEGMENTED_PICKER_CONFIRM',
  COLUMN: 'SEGMENTED_PICKER_COL_',
  CLOSE_AREA: 'SEGMENTED_PICKER_CLOSE_AREA',
};

/**
 * Measurement and internal lifecycle tracking states.
 */
export const TRACKING = {
  FLAT_LIST_REF: 'FLAT_LIST_REF_',
  LAST_SCROLL_OFFSET: 'LAST_SCROLL_OFFSET_',
  SCROLL_DIRECTION: 'SCROLL_DIRECTION_',
  IS_DRAGGING: 'IS_DRAGGING_',
  IS_MOMENTUM_SCROLLING: 'IS_MOMENTUM_SCROLLING_',
  IS_DIRTY: 'IS_DIRTY_',
};
