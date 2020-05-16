import { Platform } from 'react-native';

/**
 * Time in milliseconds for the list to fade in and out when displayed.
 */
export const ANIMATION_TIME = 300;

/**
 * Fixed sizing for list items and other UI elements.
 */
export const GUTTER_WIDTH = 18;
export const GUTTER_HEIGHT = 5;
export const ITEM_HEIGHT = Platform.select({ ios: 46, default: 50 });
export const TEXT_CORRECTION = 2;

/**
 * Measurement and internal lifecycle tracking states.
 */
export const FLAT_LIST_REF = 'FLAT_LIST_REF_';
export const LAST_SCROLL_OFFSET = 'LAST_SCROLL_OFFSET_';
export const SCROLL_DIRECTION = 'SCROLL_DIRECTION_';
export const IS_DRAGGING = 'IS_DRAGGING_';
export const IS_MOMENTUM_SCROLLING = 'IS_MOMENTUM_SCROLLING_';
export const IS_DIRTY = 'IS_DIRTY_';
