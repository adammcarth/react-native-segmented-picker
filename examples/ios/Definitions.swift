//
//  Definitions.swift
//  React Native Segmented Picker
//
//  Created by Adam McArthur on 20/6/20.
//

struct PickerItem: CustomStringConvertible {
  let label: String
  let key, testID: String?
  init(item: NSDictionary) {
    self.label = item["label"] as? String ?? ""
    self.key = item["key"] as? String
    self.testID = item["testID"] as? String
  }
  var description: String {
    return "Label: \(label)"
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
