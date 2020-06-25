/**
 * PickerView.swift
 * React Native Segmented Picker
 * Created by Adam McArthur on 20/6/20.
 *
 * Core logic for the visual customisation, data source and lifecycle events of the
 * iOS UIPickerView component. This view is created by `PickerViewManager.swift`.
 */

import UIKit

class PickerView: UIView, UIPickerViewDelegate, UIPickerViewDataSource {
  let picker: UIPickerView = UIPickerView()
  var options = [PickerColumn]()
  var defaultSelectionsApplied: Bool = false
  var theme: PickerTheme = PickerTheme(theme: nil)

  // React Props
  @objc(nativeTestID) var nativeTestIDProp = NSString()
  @objc(options) var optionsProp: [NSDictionary] = [] {
    didSet {
      parseOptionsProp()
    }
  }
  @objc(defaultSelections) var defaultSelectionsProp = [String: String]() {
    didSet {
      applyDefaultSelections()
    }
  }
  @objc(theme) var themeProp = NSDictionary() {
    didSet {
      theme = PickerTheme(theme: themeProp)
    }
  }
  @objc var onValueChange: RCTBubblingEventBlock?
  @objc var onEmitSelections: RCTBubblingEventBlock?

  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
    picker.dataSource = self
    picker.delegate = self
    self.addSubview(picker)
  }

  /**
   * Setup the picker frame when the view appears on the screen.
   */
  override func willMove(toWindow newWindow: UIWindow?) -> Void {
    super.willMove(toWindow: newWindow)
    // AKA: View Did Appear
    if newWindow != nil {
      picker.frame = self.frame
      picker.accessibilityIdentifier = nativeTestIDProp as String

      let selectionHighlighter = UIView(frame: CGRect(
        x: 0,
        y: 0,
        width: picker.frame.size.width,
        height: theme.itemHeight
      ))
      selectionHighlighter.backgroundColor = UIColor(
        hexString: theme.selectionBackgroundColor
      )
      selectionHighlighter.center = CGPoint(
        x: picker.frame.size.width / 2,
        y: picker.frame.size.height / 2
      )
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) {
        self.picker.subviews[0].subviews[0].insertSubview(
          selectionHighlighter,
          aboveSubview: self.picker.subviews[0].subviews[0].subviews[0]
        )
      }
    }
  }

  /**
   * Converts the React `options` prop to a typed Swift struct and enforces specific ordering. Also
   * ensures that the previous selections remain selected (where possible) between list data updates
   * that come from React.
   * @return {Void}
   */
  func parseOptionsProp() -> Void {
    let previousSelections = getCurrentSelectionIndexes()
    options.removeAll()
    for column in optionsProp {
      options += [PickerColumn(column: column)]
    }
    if defaultSelectionsApplied == true {
      for (i, option) in options.enumerated() {
        let prevSelection = previousSelections.value(forKey: option.key) as? Int ?? 0
        if options[i].items.indices.contains(prevSelection) {
          picker.selectRow(prevSelection, inComponent: i, animated: false)
        }
      }
    }
  }

  /**
   * Sets the current picker selections when the `defaultSelections` prop is specified.
   * This method is only executed once when the component first mounts.
   * @return {Void}
   */
  func applyDefaultSelections() -> Void {
    // Conservatively delays this logic by 50ms so that we don't try and set
    // the default selections before they have been set.
    // @fixme Is there a safer way to achieve this? Seems 8/10 awful.
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) {
      if self.defaultSelectionsApplied == false {
        _ = self.defaultSelectionsProp.map { (columnKey, itemValue) in
          let columnIndex = self.findColumnIndex(columnKey: columnKey)
          let itemIndex = self.findItemIndex(
            columnIndex: columnIndex,
            itemValue: itemValue
          )
          self.picker.selectRow(itemIndex, inComponent: columnIndex, animated: false)
        }
        self.defaultSelectionsApplied = true
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
  func pickerView(
  _ pickerView: UIPickerView,
    numberOfRowsInComponent component: Int
  ) -> Int {
    return options[component].items.count
  }

  /**
   * Returns the label text for each list item based on it's column and list index.
   * @return {String?}
   */
  func pickerView(
    _ pickerView: UIPickerView,
    viewForRow row: Int,
    forComponent component: Int,
    reusing view: UIView?
  ) -> UIView {
    pickerView.subviews[1].backgroundColor = UIColor(
      hexString: theme.selectionMarkerBorderColor
    )
    pickerView.subviews[2].backgroundColor = UIColor(
      hexString: theme.selectionMarkerBorderColor
    )
    let itemDimensions = pickerView.rowSize(forComponent: component)
    let width = itemDimensions.width
    let height = itemDimensions.height
    let frame = CGRect(x: 0, y: 0, width: width, height: height)
    let label = UILabel(frame: frame)
    label.text = options[component].items[row].label
    label.accessibilityIdentifier = options[component].items[row].testID
    label.font = label.font.withSize(15.5)
    label.textColor = UIColor(hexString: theme.pickerItemTextColor)
    label.textAlignment = .center
    return label
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
    let columnKey = options[component].key
    let columnValue = options[component].items[row].value
    onValueChange?(["column": columnKey, "value": columnValue])
  }

  /**
   * Calculates the width (in points) for each column in the picker based on the `flex` property specified
   * in the column configuration. This integer is used in conjunction with the other columns to calculate a
   * base unit width, which is then applied against the original "flex" ratio.
   * @return {CGFloat}
   */
  func pickerView(
  _ pickerView: UIPickerView,
    widthForComponent component: Int
  ) -> CGFloat {
    let containerWidth = pickerView.frame.size.width
    let totalFlex: Int = options.reduce(0, { sum, column in
      sum + column.flex
    })
    let flexUnitWidth = containerWidth / CGFloat(totalFlex)
    return flexUnitWidth * CGFloat(options[component].flex)
  }

  /**
   * Returns the fixed height for each picker item (as specified from React).
   * @return {CGFloat}
   */
  func pickerView(
    _ pickerView: UIPickerView,
    rowHeightForComponent component: Int
  ) -> CGFloat {
    return theme.itemHeight - 1.0
  }

  /**
   * Wraps the functionality of the UIPickerView's `selectRow` method as an exposed method
   * for the React Component to call.
   * @param {NSNumber} index: List index of the picker item to select.
   * @param {String} columnKey: Unique key of the column to select.
   * @param {Bool} animated: Should the selection "snap" or animate smoothly into place?
   * @return {Void}
   */
  func selectIndex(index: NSNumber, columnKey: String, animated: Bool) -> Void {
    let columnIndex = findColumnIndex(columnKey: columnKey)
    picker.selectRow(index.intValue, inComponent: columnIndex, animated: animated)
  }

  /**
   * Returns a dictionary of the current selection indexes, eg - {"columnKey": index, ...}
   * @return {NSMutableDictionary}
   */
  func getCurrentSelectionIndexes() -> NSMutableDictionary {
    let selectionIndexes = NSMutableDictionary()
    for (i, column) in options.enumerated() {
      selectionIndexes.setValue(picker.selectedRow(inComponent: i), forKey: column.key)
    }
    return selectionIndexes
  }

  /**
   * Returns a dictionary of the current selection values, eg - {"columnKey": "value", ...}
   * @return {NSMutableDictionary}
   */
  func getCurrentSelectionValues() -> NSMutableDictionary {
    let selectionIndexes = NSMutableDictionary()
    for (i, column) in options.enumerated() {
      let itemIndex = picker.selectedRow(inComponent: i)
      selectionIndexes.setValue(options[i].items[itemIndex].value, forKey: column.key)
    }
    return selectionIndexes
  }

  /**
   * Used to extract the array index for a column based on it's `key`.
   * @param {String} columnKey: A user defined `key` for the column.
   * @return {Int}
   */
  func findColumnIndex(columnKey: String) -> Int {
    return self.options.firstIndex(where: {
      $0.key == columnKey
    }) ?? 0
  }

  /**
   * Used to extract the array index for a picker item based on it's `value`.
   * @param {Int} columnIndex
   * @param {String} itemValue: A user defined `value` of the picker item.
   * @return {Int}
   */
  func findItemIndex(columnIndex: Int, itemValue: String) -> Int {
    return self.options[columnIndex].items.firstIndex(where: {
      $0.value == itemValue
    }) ?? 0
  }
}
