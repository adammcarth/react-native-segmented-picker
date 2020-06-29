interface PromiseExecutor {
  resolve: any;
  reject: any;
}

/**
 * This class is used to store promises against an incrementing integer so that the
 * promise can be resolved from outside the context of the original block.
 *
 * An example of this is when React needs to request asynchronous data from a Native
 * UI Component. Communication to UI components across the React Native bridge is
 * limited to 1-way, so the value must be emitted afterwards using an event which is
 * not immediately available to the original JavaScript method. So to get around this
 * limitation, we empower the React event subscription to resolve the promise.
 */
export default class PromiseFactory {
  private promises: Map<Number, PromiseExecutor> = new Map();
  private nextPromiseId: number = 0;

  /**
   * Add a promise to the internal store and receive it's unique `id`.
   * @param {PromiseExecutor} e
   * @return {number} Unique `id` for the added promise.
   */
  add = (e: PromiseExecutor): number => {
    const id = Number(this.nextPromiseId);
    this.promises.set(id, e);
    this.nextPromiseId += 1;
    return id;
  };

  /**
   * Get a promise by it's `id`.
   * @param {number} id
   * @return {PromiseExecutor | undefined}
   */
  get = (id: number): PromiseExecutor | undefined => this.promises.get(id);

  /**
   * Completely deletes a promise from the factory using it's unique `id`.
   * @param {number} id
   * @return {boolean}
   */
  delete = (id: number): boolean => this.promises.delete(id);
}
