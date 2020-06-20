//
//  PickerViewManager.swift
//  React Native Segmented Picker
//
//  Created by Adam McArthur on 20/6/20.
//

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
   * Allows the React Native client to manually trigger the `onConfirm` event. This should be executed to retreive
   * the current selections on the user's screen - such as when closing or confirming the picker modal.
   * @return {Void}
   */
  @objc func confirmSelections(_ node: NSNumber) -> Void {
    DispatchQueue.main.async {
      let picker = self.bridge.uiManager.view(
        forReactTag: node
      ) as! PickerView
      picker.onConfirm!([
        "selectionIndexes": picker.getCurrentSelectionIndexes()
      ])
    }
  }
}
