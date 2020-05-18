import { ITEM_HEIGHTS } from '../../src/config/constants';

/**
 * Simple helper method which pauses the end-to-end test for a fixed time.
 * Usage: `await pause(3000);`
 * @param {number} milliseconds
 * @return {Promise<void>}
 */
export const pause = (milliseconds: number): Promise<void> => (
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  })
);

/**
 * Calculates the pixel distance to scroll between picker items (assuming that the current
 * position Y is 0). Note that the item height is different between Android & iOS.
 * @param {number} move: How many items would like to move from the current?
 * @return {number} Pixel distance required to move.
 */
export const scrollDistance = (move: number): number => {
  const ITEM_HEIGHT = process.env.E2E_PLATFORM === 'ios'
    ? ITEM_HEIGHTS.ios
    : ITEM_HEIGHTS.default;
  return move > 0
    ? (ITEM_HEIGHT * move) - (move / 0.25)
    : 0;
};

/**
 * Decodes JSON from UI elements of the app.
 * @param {string} str URI encoded JSON string
 * @return {any} Parsed JSON
 */
export const decodeJson = (str: string): any => JSON.parse(decodeURIComponent(str));
