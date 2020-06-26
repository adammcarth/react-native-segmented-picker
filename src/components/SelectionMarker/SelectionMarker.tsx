import React, { ReactElement } from 'react';
import { View } from 'react-native';
import styles from './SelectionMarkerStyles';

interface Props {
  backgroundColor: string;
  borderColor: string;
}

/**
 * Horizontal bar used to indicate the current picker selections.
 */
export default ({
  backgroundColor,
  borderColor,
}: Props): ReactElement => (
  <View style={styles.selectionMarkerContainer}>
    <View
      style={[
        styles.selectionMarkerBorder,
        { backgroundColor: borderColor },
      ]}
    />
    <View style={[styles.selectionMarker, { backgroundColor }]} />
    <View
      style={[
        styles.selectionMarkerBorder,
        { backgroundColor: borderColor },
      ]}
    />
  </View>
);
