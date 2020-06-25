/**
 * PickerViewManager.swift
 * React Native Segmented Picker
 * Created by Adam McArthur on 20/6/20.
 *
 * Interfaces React Native with the core `PickerView.swift` view logic.
 */

import Foundation

@objc(PickerViewManager)
class PickerViewManager: RCTViewManager {
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func view() -> UIView! {
    return PickerView()
  }

  /**
   * Programmatically select an index in the picker.
   * @param {NSNumber} node: Unique ID of the RTCView.
   * @param {NSNumber} index: List index of the picker item to select.
   * @param {String} columnKey: Unique key of the column to select.
   * @param {Bool} animated: Should the selection "snap" or animate smoothly into place?
   * @return {Void}
   */
  @objc func selectIndex(
    _ node: NSNumber,
    index: NSNumber,
    columnKey: String,
    animated: Bool
  ) -> Void {
    DispatchQueue.main.async {
      let picker = self.bridge.uiManager.view(
        forReactTag: node
      ) as! PickerView
      picker.selectIndex(index: index, columnKey: columnKey, animated: animated)
    }
  }

  /**
   * Allows the React Native client to request the current picker item selections through an emitted event.
   * @param {NSNumber} node: Unique ID of the RTCView.
   * @param {NSNumber} pid: A pre-generated Promise ID stored in the JavaScript Promise Factory.
   * @return {Void}
   */
  @objc func emitSelections(_ node: NSNumber, pid: NSNumber) -> Void {
    DispatchQueue.main.async {
      let picker = self.bridge.uiManager.view(
        forReactTag: node
      ) as! PickerView
      if picker.onEmitSelections != nil {
        picker.onEmitSelections!([
          "selections": picker.getCurrentSelectionValues(),
          "pid": pid
        ])
      }
    }
  }
}
