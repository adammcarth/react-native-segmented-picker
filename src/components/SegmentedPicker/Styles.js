import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components';
import * as Animatable from 'react-native-animatable';

export const GUTTER_WIDTH = 18;
export const GUTTER_HEIGHT = 5;
export const ITEM_HEIGHT = 40;
export const TEXT_CORRECTION = 2;

export const ModalContainer = styled(Animatable.View)`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  flex: 1;
  flex-direction: column;
`;

export const CloseableContainer = styled(View)`
  width: 100%;
`;

export const PickerContainer = styled(Animatable.View)`
  width: 100%;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
`;

export const ToolbarContainer = styled(View)`
  width: 100%;
  height: 42px;
  border-bottom-width: 1px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  align-self: flex-start;
`;

export const ToolbarConfirmContainer = styled(View)`
  height: 100%;
  padding-left: 30px;
  justify-content: center;
`;

export const ToolbarConfirmText = styled(Text)`
  font-weight: bold;
  font-size: 15px;
  padding: 0px ${GUTTER_WIDTH}px ${TEXT_CORRECTION}px 0;
`;

export const Pickers = styled(View)`
  flex: 1;
  align-self: stretch;
  flex-direction: row;
  padding: ${GUTTER_HEIGHT}px 0 ${GUTTER_HEIGHT}px ${GUTTER_WIDTH}px;
`;

export const PickerColumn = styled(View)`
  flex: 1;
  margin-right: 12px;
  position: relative;
`;

export const PickerList = styled(View)`
  width: 100%;
  height: auto;
`;

export const PickerItem = styled(View)`
  width: 100%;
  height: ${ITEM_HEIGHT}px;
  justify-content: center;
`;

export const PickerItemText = styled(Text)`
  font-size: 15px;
  padding: 5px 0 ${5 + TEXT_CORRECTION}px 0;
  text-align: center;
`;

export const SelectionMarkerContainer = styled(View)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

/* Eliminates border rendering inconsistencies between iOS & Android */
export const SelectionMarkerBorder = styled(View)`
  width: 100%;
  height: 1px;
`;

export const SelectionMarker = styled(View)`
  width: 100%;
  height: ${ITEM_HEIGHT - 2}px;
`;

export default {
  consts: {
    GUTTER_WIDTH,
    GUTTER_HEIGHT,
    ITEM_HEIGHT,
    TEXT_CORRECTION,
  },
  ModalContainer,
  CloseableContainer,
  PickerContainer,
  ToolbarContainer,
  ToolbarConfirmContainer,
  ToolbarConfirmText,
  Pickers,
  PickerColumn,
  PickerList,
  PickerItem,
  PickerItemText,
  SelectionMarkerContainer,
  SelectionMarkerBorder,
  SelectionMarker,
};
