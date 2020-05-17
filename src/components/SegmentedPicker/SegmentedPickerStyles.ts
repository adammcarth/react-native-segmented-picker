import { StyleSheet, Platform } from 'react-native';
import {
  GUTTER_WIDTH,
  GUTTER_HEIGHT,
  ITEM_HEIGHTS,
  TEXT_CORRECTION,
} from '../../config/constants';

const ITEM_HEIGHT = Platform.select(ITEM_HEIGHTS);

export default StyleSheet.create({
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flex: 1,
    flexDirection: 'column',
  },

  closeableContainer: {
    width: '100%',
  },

  pickerContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  toolbarContainer: {
    width: '100%',
    height: 42,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },

  toolbarConfirmContainer: {
    height: '100%',
    paddingLeft: 30,
    justifyContent: 'center',
  },

  toolbarConfirmText: {
    fontWeight: 'bold',
    fontSize: 15,
    paddingTop: 0,
    paddingRight: GUTTER_WIDTH,
    paddingBottom: TEXT_CORRECTION,
    paddingLeft: 0,
  },

  pickers: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingTop: GUTTER_HEIGHT,
    paddingRight: 0,
    paddingBottom: GUTTER_HEIGHT,
    paddingLeft: GUTTER_WIDTH,
  },

  pickerColumn: {
    flex: 1,
    marginRight: 12,
    position: 'relative',
  },

  pickerList: {
    width: '100%',
    height: 'auto',
  },

  pickerItem: {
    width: '100%',
    height: ITEM_HEIGHT,
    justifyContent: 'center',
  },

  pickerItemText: {
    fontSize: 15,
    paddingTop: 5,
    paddingRight: 0,
    paddingBottom: TEXT_CORRECTION + 5,
    paddingLeft: 0,
    textAlign: 'center',
  },

  selectionMarkerContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Eliminates border rendering inconsistencies between iOS & Android
  selectionMarkerBorder: {
    width: '100%',
    height: 1,
  },

  selectionMarker: {
    width: '100%',
    height: ITEM_HEIGHT - 2,
  },
});
