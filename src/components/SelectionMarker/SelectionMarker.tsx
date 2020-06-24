import React, { ReactElement } from 'react';
import { View } from 'react-native';
import styles from './SelectionMarkerStyles';

interface Props {
  highlightAlpha: number;
  borderColor: string;
}

/**
 * Horizontal bar used to indicate the current picker selections.
 */
export default ({
  highlightAlpha,
  borderColor,
}: Props): ReactElement => (
  <View style={styles.selectionMarkerContainer}>
    <View
      style={[
        styles.selectionMarkerBorder,
        { backgroundColor: borderColor },
      ]}
    />
    <View
      style={[
        styles.selectionMarker,
        { backgroundColor: `rgba(0, 0, 0, ${highlightAlpha})` },
      ]}
    />
    <View
      style={[
        styles.selectionMarkerBorder,
        { backgroundColor: borderColor },
      ]}
    />
  </View>
);
