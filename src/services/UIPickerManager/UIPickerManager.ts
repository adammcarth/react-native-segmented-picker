import React from 'react';
import { UIManager, findNodeHandle } from 'react-native';
import PromiseFactory from '../PromiseFactory';
import { UIPickerSelectionsEvent } from '../../config/interfaces';

interface Selections {
  [column: string]: string;
}

/**
 * Methods to control and observe the native iOS `UIPickerView`.
 */
export default class UIPickerManager {
  private ref: React.RefObject<any> = React.createRef();
  private promiseFactory: PromiseFactory = new PromiseFactory();

  get reactRef(): React.RefObject<any> {
    return this.ref;
  }

  /**
   * Programmatically select an index in the picker.
   * @param {number} index: List index of the picker item to select.
   * @param {string} columnKey: Unique key of the column to select.
   * @param {boolean = true} animated: Should the selection "snap" or animate smoothly into place?
   * @return {void}
   */
  selectIndex = (index: number, column: string, animated: boolean = true): void => {
    if (this.ref.current) {
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this.ref.current),
        (UIManager as any).UIPicker.Commands.selectIndex,
        [index, column, animated],
      );
    }
  };

  /**
   * Returns the current picker item selections as the appear on the user's screen.
   * @return {Promise<Selections>}
   */
  getCurrentSelections = (): Promise<Selections> => {
    if (!this.ref.current) {
      return Promise.resolve({});
    }
    const promise: Promise<Selections> = new Promise((resolve, reject) => {
      const pid = this.promiseFactory.add({ resolve, reject });
      UIManager.dispatchViewManagerCommand(
        findNodeHandle(this.ref.current),
        (UIManager as any).UIPicker.Commands.emitSelections,
        [pid],
      );
    });
    return promise;
  };

  /**
   * Ingests emitted selections from the native module and resolves the original promise
   * from `getCurrentSelections` using it's stored resolver in the Promise Factory.
   * @param {UIPickerSelectionsEvent}
   * @return {void}
   */
  ingestSelections = (
    { nativeEvent: { selections, pid } }: UIPickerSelectionsEvent,
  ): void => {
    const promise = this.promiseFactory.get(pid);
    if (promise) {
      promise.resolve(selections);
      this.promiseFactory.delete(pid);
    }
  };
}
