import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import SegmentedPicker from './index';

/**
 * Main tests are located in `src`. This test simply captures that the module
 * has been imported and exported correctly.
 */
describe('SegmentedPicker Package Entrypoint', () => {
  it('Imports the module without crashing.', () => {
    jest.useFakeTimers();
    renderer.create(
      <SegmentedPicker
        options={{ column1: [] }}
      />,
    );
  });
});
