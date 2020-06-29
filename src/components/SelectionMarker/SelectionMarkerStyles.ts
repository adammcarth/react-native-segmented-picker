import { StyleSheet, Platform } from 'react-native';
import { ITEM_HEIGHTS, GUTTER_WIDTH } from '../../config/constants';

const ITEM_HEIGHT = Platform.select(ITEM_HEIGHTS);

export default StyleSheet.create({
  selectionMarkerContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: GUTTER_WIDTH,
    paddingRight: GUTTER_WIDTH,
  },

  // Eliminates border rendering inconsistencies between iOS & Android
  selectionMarkerBorder: {
    width: '100%',
    height: Platform.select({ ios: 0.6, android: 0.7 }),
  },

  selectionMarker: {
    width: '100%',
    height: ITEM_HEIGHT,
  },
});
