export type StoreItem = any;

export interface Store {
  [key: string]: any;
}

/**
 * This class is utilised by the main Segmented Picker component as a fast synchronous
 * cache alternative to the regular React component state mechanism.
 */
export default class Cache {
  store: Store;

  constructor(initialState: Store = {}) {
    this.store = {
      ...initialState,
    };
  }

  /**
   * Returns the entire store value without any modification.
   * @return {Store}
   */
  get current(): Store {
    return this.store;
  }

  /**
   * Attempts to safely fetch the cached value for the specified key.
   * @param {string} key
   * @return {StoreItem | null}
   */
  get = (key: string): StoreItem | null => {
    if (key in this.store) {
      return this.store[key];
    }
    return null;
  };

  /**
   * Creates (or replaces) a value in the cache for the specified key.
   * @param {string} key
   * @param {StoreItem} value
   * @return {void}
   */
  set = (key: string, value: StoreItem): void => {
    this.store[key] = value;
  };

  /**
   * Completely resets the cache to a blank state.
   * @return {void}
   */
  purge = (): void => {
    this.store = {};
  };
}
