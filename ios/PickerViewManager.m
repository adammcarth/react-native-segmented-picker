/**
 * PickerViewManager.m
 * React Native Segmented Picker
 * Created by Adam McArthur on 20/6/20.
 *
 * Exposes the custom view properties and methods to React Native.
 */

#import "React/RCTViewManager.h"

@interface RCT_EXTERN_REMAP_MODULE(UIPicker, PickerViewManager, RCTViewManager)

  RCT_EXPORT_VIEW_PROPERTY(nativeTestID, NSString)
  RCT_EXPORT_VIEW_PROPERTY(options, NSArray)
  RCT_EXPORT_VIEW_PROPERTY(defaultSelections, NSDictionary)
  RCT_EXPORT_VIEW_PROPERTY(theme, NSDictionary)
  RCT_EXPORT_VIEW_PROPERTY(onValueChange, RCTBubblingEventBlock)
  RCT_EXPORT_VIEW_PROPERTY(onEmitSelections, RCTBubblingEventBlock)
  RCT_EXTERN_METHOD(
    emitSelections: (nonnull NSNumber *)node
    pid:(nonnull NSNumber *)pid
  )
  RCT_EXTERN_METHOD(
    selectIndex: (nonnull NSNumber *)node
    index:(nonnull NSNumber *)index
    columnKey:(nonnull NSString *)columnKey
    animated:(nonnull BOOL *)animated
  )

@end
