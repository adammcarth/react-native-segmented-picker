import {
  View,
  ViewProps,
  ViewStyle,
  Text
} from 'react-native';

import { AnimatableComponent } from 'react-native-animatable';

import { StyledComponent } from 'styled-components';


/* --------
 * Constants
 * -------- */
export const GUTTER_WIDTH: number;

export const GUTTER_HEIGHT: number;

export const ITEM_HEIGHT: number;

export const TEXT_CORRECTION: number;


/* --------
 * Shared Types
 * -------- */
declare type StyledView<O = {}, A = never> = StyledComponent<typeof View, any, O, A>;

declare type StyledText<O = {}, A = never> = StyledComponent<typeof Text, any, O, A>;

declare type StyledAnimatableView<O = {}, A = never> = StyledComponent<AnimatableComponent<ViewProps, ViewStyle>, any, O, A>;


/* --------
 * Component Types
 * -------- */
export const ModalContainer: StyledAnimatableView;

export const CloseableContainer: StyledView;

export const PickerContainer: StyledAnimatableView;

export const ToolbarContainer: StyledView;

export const ToolbarConfirmContainer: StyledView;

export const ToolbarConfirmText: StyledText;

export const Pickers: StyledView;

export const PickerColumn: StyledView;

export const PickerList: StyledView;

export const PickerItem: StyledView;

export const PickerItemText: StyledText;

export const SelectionMarkerContainer: StyledView;

export const SelectionMarkerBorder: StyledView;

export const SelectionMarker: StylesDefaultExports;


/* --------
 * Default Exports
 * -------- */
declare interface ConstantsDefaultExports {
  GUTTER_WIDTH: number;
  GUTTER_HEIGHT: number;
  ITEM_HEIGHT: number;
  TEXT_CORRECTION: number;
}

declare interface StylesDefaultExports {
  const: ConstantsDefaultExports,
  ModalContainer: StyledAnimatableView;
  CloseableContainer: StyledView;
  PickerContainer: StyledAnimatableView;
  ToolbarContainer: StyledView;
  ToolbarConfirmContainer: StyledView;
  ToolbarConfirmText: StyledText;
  Pickers: StyledView;
  PickerColumn: StyledView;
  PickerList: StyledView;
  PickerItem: StyledView;
  PickerItemText: StyledText;
  SelectionMarkerContainer: StyledView;
  SelectionMarkerBorder: StyledView;
  SelectionMarker: StyledView;
}

declare const defaultExports: StylesDefaultExports;

export default defaultExports;