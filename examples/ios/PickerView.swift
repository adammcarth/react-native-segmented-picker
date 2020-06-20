//
//  PickerView.swift
//  React Native Segmented Picker
//
//  Created by Adam McArthur on 20/6/20.
//

import UIKit

class PickerView: UIView, UIPickerViewDelegate, UIPickerViewDataSource {
  var picker: UIPickerView = UIPickerView()
  var options = [String: [PickerItem]]()
  @objc(options) var reactOptionsProp: NSDictionary = NSDictionary() {
    didSet {
      self.parseReactOptionsProp()
    }
  }
  @objc var defaultSelections = [String: String]()
  @objc var onValueChange: RCTBubblingEventBlock?
  @objc var onConfirm: RCTBubblingEventBlock?

  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
    self.picker.dataSource = self
    self.picker.delegate = self
    self.addSubview(picker)
  }

  /**
   * Converts the React `options` prop to a typed Swift struct.
   * @return {Void}
   */
  func parseReactOptionsProp() -> Void {
    let columns = reactOptionsProp.allKeys
    for column in columns as! [String] {
      let items: NSArray = reactOptionsProp[column] as! NSArray
      for case let item as NSDictionary in items {
        _ = self.options.append(
          element: PickerItem(item: item),
          toValueOfKey: column
        )
      }
    }
  }

  /**
   * Determines the number of columns to display inside the picker.
   * @return {Int}
   */
  func numberOfComponents(in pickerView: UIPickerView) -> Int {
    return options.count
  }

  /**
   * Calculates the number of list items (aka "rows") for each picker column.
   * @return {Int}
   */
  func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
    let columnId = Array(options.keys)[component]
    return options[columnId]?.count ?? 0
  }

  /**
   * Returns the label text for each list item based on it's column and list index.
   * @return {String?}
   */
  func pickerView(
    _ pickerView: UIPickerView,
    titleForRow row: Int,
    forComponent component: Int
  ) -> String? {
    let columnId = Array(options.keys)[component]
    return options[columnId]?[row].label
  }

  /**
   * Emits an event to React Native whenever a selection change occurs.
   * @return {Void}
   */
  func pickerView(
    _ pickerView: UIPickerView,
    didSelectRow row: Int,
    inComponent component: Int
  ) -> Void {
    let columnId = Array(self.options.keys)[component]
    self.onValueChange!(["columnId": columnId, "selectionIndex": row])
  }

  /**
   * Returns a dictionary of the current selections, eg - {columnId: index, ...}
   * @return {NSMutableDictionary}
   */
  func getCurrentSelectionIndexes() -> NSMutableDictionary {
    let selectionIndexes = NSMutableDictionary()
    let columns = options.keys
    for (i, column) in columns.enumerated() {
      selectionIndexes.setValue(picker.selectedRow(inComponent: i), forKey: column)
    }
    return selectionIndexes
  }
}
