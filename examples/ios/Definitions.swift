//
//  Definitions.swift
//  React Native Segmented Picker
//
//  Created by Adam McArthur on 20/6/20.
//

import Foundation
import UIKit

struct PickerColumn: CustomStringConvertible {
  let key: String
  var items: [PickerItem]
  let flex: Int
  let testID: String?
  init(column: NSDictionary) {
    self.key = column["key"] as? String ?? ""
    self.items = []
    let itemsInput: NSArray = column["items"] as! NSArray
    for case let item as NSDictionary in itemsInput {
      self.items += [PickerItem(item: item)]
    }
    self.flex = column["flex"] as? Int ?? 1
    self.testID = column["testID"] as? String
  }
  var description: String {
    return "Column ID: \(self.key)"
  }
}

struct PickerItem: CustomStringConvertible {
  let label, value: String
  let key, testID: String?
  init(item: NSDictionary) {
    self.label = item["label"] as? String ?? ""
    self.value = item["value"] as? String ?? ""
    self.key = item["key"] as? String
    self.testID = item["testID"] as? String
  }
  var description: String {
    return self.label
  }
}

struct PickerTheme: CustomStringConvertible {
  let itemHeight: CGFloat
  let selectionMarkerBorderColor, pickerItemTextColor: String
  let selectionHighlightAlpha: CGFloat
  init(theme: NSDictionary?) {
    let itemHeightNumber = theme?["itemHeight"] as? NSNumber ?? 46
    self.itemHeight = CGFloat(truncating: itemHeightNumber)
    self.selectionMarkerBorderColor = (
      theme?["selectionMarkerBorderColor"] as? String ?? "#C9C9C9"
    )
    self.pickerItemTextColor = (
      theme?["pickerItemTextColor"] as? String ?? "#282828"
    )
    self.selectionHighlightAlpha = theme?["selectionHighlightAlpha"] as? CGFloat ?? 0.03
  }
  var description: String {
    return "PickerTheme"
  }
}

extension Dictionary where Value: RangeReplaceableCollection {
  public mutating func append(
    element: Value.Iterator.Element,
    toValueOfKey key: Key
  ) -> Value? {
    var value: Value = self[key] ?? Value()
    value.append(element)
    self[key] = value
    return value
  }
}

extension UIColor {
  convenience init(hexString: String, alpha: CGFloat = 1.0) {
    let hexString: String = hexString.trimmingCharacters(
      in: CharacterSet.whitespacesAndNewlines
    )
    let scanner = Scanner(string: hexString)
    if (hexString.hasPrefix("#")) {
      scanner.scanLocation = 1
    }
    var color: UInt32 = 0
    scanner.scanHexInt32(&color)
    let mask = 0x000000FF
    let r = Int(color >> 16) & mask
    let g = Int(color >> 8) & mask
    let b = Int(color) & mask
    let red = CGFloat(r) / 255.0
    let green = CGFloat(g) / 255.0
    let blue = CGFloat(b) / 255.0
    self.init(red: red, green: green, blue: blue, alpha: alpha)
  }
}
