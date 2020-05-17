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
