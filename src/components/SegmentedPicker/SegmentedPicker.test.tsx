import React from 'react';
import { FlatList, Modal } from 'react-native';
import renderer from 'react-test-renderer';
import SegmentedPicker from './SegmentedPicker';
import { TEST_IDS, ANIMATION_TIME } from '../../config/constants';

beforeEach(() => {
  jest.useFakeTimers();
});

describe('SegmentedPicker', () => {
  it('Does not automatically display when first rendered.', () => {
    const testRenderer = renderer.create(
      <SegmentedPicker
        options={{ column1: [] }}
      />,
    );
    const testInstance = testRenderer.root;
    const outerModal = testInstance.findByType(Modal);
    jest.advanceTimersByTime(ANIMATION_TIME);
    expect(outerModal.props.visible).toEqual(false);
  });

  it('Toggles visibility via the `visible` prop.', () => {
    const testRenderer = renderer.create(
      <SegmentedPicker
        visible
        options={{ column1: [] }}
      />,
    );
    const testInstance = testRenderer.root;
    const outerModal = testInstance.findByType(Modal);
    jest.advanceTimersByTime(ANIMATION_TIME);
    expect(outerModal.props.visible).toEqual(true);
  });

  it('Toggles visibility via ref method.', () => {
    const ref: React.RefObject<SegmentedPicker> = React.createRef();
    const testRenderer = renderer.create(
      <SegmentedPicker
        options={{ column1: [] }}
        ref={ref}
      />,
    );
    const testInstance = testRenderer.root;
    const outerModal = testInstance.findByType(Modal);
    ref.current.show();
    jest.advanceTimersByTime(ANIMATION_TIME);
    expect(outerModal.props.visible).toEqual(true);
    ref.current.hide();
    jest.advanceTimersByTime(ANIMATION_TIME);
    expect(outerModal.props.visible).toEqual(false);
  });

  it('Renders one-column pickers.', () => {
    const testRenderer = renderer.create(
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
    const testInstance = testRenderer.root;
    const column1 = testInstance.findByProps({ testID: `${TEST_IDS.COLUMN}column1` });
    expect(column1.props.data.length).toEqual(4);
  });

  it('Renders multi-column pickers with default selections.', () => {
    const testRenderer = renderer.create(
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
    const testInstance = testRenderer.root;
    const column1 = testInstance.findByProps({ testID: `${TEST_IDS.COLUMN}column1` });
    const column2 = testInstance.findByProps({ testID: `${TEST_IDS.COLUMN}column2` });
    const column3 = testInstance.findByProps({ testID: `${TEST_IDS.COLUMN}column3` });
    const column4 = testInstance.findByProps({ testID: `${TEST_IDS.COLUMN}column4` });
    expect(column1.props.data.length).toEqual(4);
    expect(column2.props.data.length).toEqual(4);
    expect(column3.props.data.length).toEqual(2);
    expect(column4.props.data.length).toEqual(0);
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
    const {
      props: { data, keyExtractor: listItemKeyExtractor },
    } = testInstance.findByType(FlatList);
    expect(listItemKeyExtractor(data[0]))
      .toBe(`${TEST_IDS.COLUMN}${column1}_${listData[column1][0].label}`);
    expect(listItemKeyExtractor(data[1]))
      .toBe(`${TEST_IDS.COLUMN}${column1}_${listData[column1][1].key}`);
  });

  it('Can switch selected items by label name.', () => {
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
    jest.advanceTimersByTime(ANIMATION_TIME);
    ref.current.selectLabel('Adam', 'column1'); // <-- already selected
    expect(onChangeCallback).not.toBeCalled();
    ref.current.selectLabel('Harry', 'column1');
    expect(onChangeCallback).toBeCalledTimes(1);
    expect(onChangeCallback.mock.calls[0][0]).toBe('column1');
    expect(onChangeCallback.mock.calls[0][1].label).toBe('Harry');
  });

  it('Can switch selected items by list index.', () => {
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
    ref.current.selectIndex(0, 'column1'); // <-- already selected
    expect(onChangeCallback).not.toBeCalled();
    ref.current.selectIndex(3, 'column1');
    expect(onChangeCallback).toBeCalledTimes(1);
    expect(onChangeCallback.mock.calls[0][0]).toBe('column1');
    expect(onChangeCallback.mock.calls[0][1].label).toBe('Georgia');
  });
});
