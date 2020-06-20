//
//  PickerViewManager.m
//  React Native Segmented Picker
//
//  Created by Adam McArthur on 20/6/20.
//

#import "React/RCTViewManager.h"

@interface RCT_EXTERN_REMAP_MODULE(UIPicker, PickerViewManager, RCTViewManager)

  RCT_EXPORT_VIEW_PROPERTY(options, NSDictionary)
  RCT_EXPORT_VIEW_PROPERTY(defaultSelections, NSDictionary)
  RCT_EXPORT_VIEW_PROPERTY(onValueChange, RCTBubblingEventBlock)
  RCT_EXPORT_VIEW_PROPERTY(onConfirm, RCTBubblingEventBlock)
  RCT_EXTERN_METHOD(confirmSelections: (nonnull NSNumber *)node)

@end
