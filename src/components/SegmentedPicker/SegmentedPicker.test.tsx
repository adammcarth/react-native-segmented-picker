import React from 'react';
import { FlatList } from 'react-native';
import renderer from 'react-test-renderer';
import SegmentedPicker from './SegmentedPicker';
import { TEST_IDS } from '../../config/constants';

beforeEach(() => {
  jest.useFakeTimers();
});

describe('SegmentedPicker', () => {
  it('Renders without crashing.', () => {
    renderer.create(
      <SegmentedPicker
        visible
        options={{ column1: [] }}
      />,
    );
  });

  it('Toggles visibility via ref method.', () => {
    const ref: React.RefObject<SegmentedPicker> = React.createRef();
    renderer.create(
      <SegmentedPicker
        options={{ column1: [] }}
        ref={ref}
      />,
    );
    setTimeout(() => {
      ref.current.show();
      setTimeout(() => {
        ref.current.hide();
      }, 300);
    }, 300);
    jest.advanceTimersByTime(600);
  });

  it('Renders one-column pickers.', () => {
    renderer.create(
      <SegmentedPicker
        visible
        options={{
          column1: [
            { label: 'Adam' },
            { label: 'Harry' },
            { label: 'Francesca' },
            { label: 'Georgia' },
          ],
        }}
      />,
    );
  });

  it('Renders multi-column pickers with default selections.', () => {
    renderer.create(
      <SegmentedPicker
        visible
        options={{
          column1: [
            { label: 'Adam' },
            { label: 'Harry' },
            { label: 'Francesca' },
            { label: 'Georgia' },
          ],
          column2: [
            { label: 'Frank' },
            { label: 'Maddie' },
            { label: 'Veronica' },
            { label: 'Matthew' },
          ],
          column3: [
            { label: 'Riley' },
            { label: 'Hannah' },
          ],
          column4: [],
        }}
        defaultSelections={{
          column1: 'Francesca',
          column2: 'Veronica',
          column3: 'Missing labels should be ignored!',
          // column4 intentionally omitted
        }}
      />,
    );
  });

  it('Sets the react "key" of list items correctly', () => {
    const column1 = 'column1';
    const listData = {
      [column1]: [
        { label: 'Adam' },
        { label: 'Francesca', key: 'fran' },
      ],
    };
    const testRenderer = renderer.create(
      <SegmentedPicker
        visible
        options={listData}
      />,
    );
    const testInstance = testRenderer.root;
    jest.advanceTimersByTime(1000);
    const {
      props: { data, keyExtractor: listItemKeyExtractor },
    } = testInstance.findByType(FlatList);
    expect(listItemKeyExtractor(data[0]))
      .toBe(`${TEST_IDS.COLUMN}${column1}_${listData[column1][0].label}`);
    expect(listItemKeyExtractor(data[1]))
      .toBe(`${TEST_IDS.COLUMN}${column1}_${listData[column1][1].key}`);
  });

  it('Can be shown and hidden programmatically.', () => {
    const ref: React.RefObject<SegmentedPicker> = React.createRef();
    renderer.create(
      <SegmentedPicker
        ref={ref}
        options={{
          column1: [
            { label: 'Adam' },
            { label: 'Harry' },
            { label: 'Francesca' },
            { label: 'Georgia' },
          ],
        }}
      />,
    );
    ref.current.show();
    jest.advanceTimersByTime(1000);
    ref.current.hide();
    jest.advanceTimersByTime(1000);
  });

  it('Can switch selected items by label name.', () => {
    const ref: React.RefObject<SegmentedPicker> = React.createRef();
    renderer.create(
      <SegmentedPicker
        ref={ref}
        visible
        options={{
          column1: [
            { label: 'Adam' },
            { label: 'Harry' },
            { label: 'Francesca' },
            { label: 'Georgia' },
          ],
        }}
      />,
    );
    ref.current.selectLabel('Francesca', 'column1');
  });

  it('Can switch selected items by list index.', () => {
    const ref: React.RefObject<SegmentedPicker> = React.createRef();
    renderer.create(
      <SegmentedPicker
        ref={ref}
        visible
        options={{
          column1: [
            { label: 'Adam' },
            { label: 'Harry' },
            { label: 'Francesca' },
            { label: 'Georgia' },
          ],
        }}
      />,
    );
    ref.current.selectIndex(3, 'column1');
  });

  it('Omits expected onValueChange events.', () => {
    const ref: React.RefObject<SegmentedPicker> = React.createRef();
    const onChangeCallback = jest.fn();
    renderer.create(
      <SegmentedPicker
        ref={ref}
        visible
        options={{
          column1: [
            { label: 'Adam' },
            { label: 'Harry' },
            { label: 'Francesca' },
            { label: 'Georgia' },
          ],
        }}
        onValueChange={onChangeCallback}
      />,
    );
    ref.current.selectLabel('Adam', 'column1');
    expect(onChangeCallback).not.toBeCalled();
    ref.current.selectLabel('Harry', 'column1');
    expect(onChangeCallback).toBeCalled();
    expect(onChangeCallback.mock.calls[0][0]).toBe('column1');
    expect(onChangeCallback.mock.calls[0][1].label).toBe('Harry');
    ref.current.selectIndex(0, 'column1');
    expect(onChangeCallback).toBeCalledTimes(2);
    expect(onChangeCallback.mock.calls[1][0]).toBe('column1');
    expect(onChangeCallback.mock.calls[1][1].label).toBe('Adam');
  });
});
