import React from 'react';
import { FlatList, Modal } from 'react-native';
import renderer from 'react-test-renderer';
import SegmentedPicker from './SegmentedPicker';
import { ANIMATION_TIME } from '../../config/constants';

beforeEach(() => {
  jest.useFakeTimers();
});

describe('SegmentedPicker', () => {
  it('Does not automatically display when first rendered.', () => {
    const testRenderer = renderer.create(
      <SegmentedPicker
        options={[]}
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
        options={[]}
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
        options={[]}
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
        options={[
          {
            key: 'col_1',
            testID: 'picker_col_1',
            items: [
              { label: 'Adam', value: 'adam' },
              { label: 'Harry', value: 'harry' },
              { label: 'Francesca', value: 'francesca' },
              { label: 'Georgia', value: 'georgia' },
            ],
          },
        ]}
      />,
    );
    const testInstance = testRenderer.root;
    const column1 = testInstance.findByProps({ testID: 'picker_col_1' });
    expect(column1.props.data.length).toEqual(4);
  });

  it('Renders multi-column pickers with default selections.', async () => {
    const ref: React.RefObject<SegmentedPicker> = React.createRef();
    const testRenderer = renderer.create(
      <SegmentedPicker
        ref={ref}
        visible
        options={[
          {
            key: 'col_1',
            testID: 'picker_col_1',
            items: [
              { label: 'Adam', value: 'adam' },
              { label: 'Harry', value: 'harry' },
              { label: 'Francesca', value: 'francesca' },
              { label: 'Georgia', value: 'georgia' },
            ],
          },
          {
            key: 'col_2',
            testID: 'picker_col_2',
            items: [
              { label: 'Frank', value: 'frank' },
              { label: 'Maddie', value: 'maddie' },
              { label: 'Veronica', value: 'veronica' },
              { label: 'Matthew', value: 'matthew' },
            ],
          },
          {
            key: 'col_3',
            testID: 'picker_col_3',
            items: [
              { label: 'Riley', value: 'riley' },
              { label: 'Hannah', value: 'hannah' },
            ],
          },
          {
            key: 'col_4',
            testID: 'picker_col_4',
            items: [],
          },
        ]}
        defaultSelections={{
          col_1: 'francesca',
          col_2: 'veronica',
          col_3: 'Missing labels should be ignored!',
          // col_4 intentionally omitted
        }}
      />,
    );
    const testInstance = testRenderer.root;
    const column1 = testInstance.findByProps({ testID: 'picker_col_1' });
    const column2 = testInstance.findByProps({ testID: 'picker_col_2' });
    const column3 = testInstance.findByProps({ testID: 'picker_col_3' });
    const column4 = testInstance.findByProps({ testID: 'picker_col_4' });
    expect(column1.props.data.length).toEqual(4);
    expect(column2.props.data.length).toEqual(4);
    expect(column3.props.data.length).toEqual(2);
    expect(column4.props.data.length).toEqual(0);
  });

  it('Sets the react "key" of list items correctly', () => {
    const COL_1 = 'col_1';
    const column = {
      key: COL_1,
      testID: `picker_${COL_1}`,
      items: [
        { label: 'Adam', value: 'adam' },
        { label: 'Francesca', value: 'francesca', key: 'fran' },
      ],
    };
    const testRenderer = renderer.create(
      <SegmentedPicker
        visible
        options={[column]}
      />,
    );
    const testInstance = testRenderer.root;
    const {
      props: { data, keyExtractor: listItemKeyExtractor },
    } = testInstance.findByType(FlatList);
    expect(listItemKeyExtractor(data[0]))
      .toBe(`${COL_1}_${column.items[0].label}`);
    expect(listItemKeyExtractor(data[1]))
      .toBe(`${COL_1}_${column.items[1].key}`);
  });

  it('Can switch selected items by label name.', () => {
    const ref: React.RefObject<SegmentedPicker> = React.createRef();
    const onChangeCallback = jest.fn();
    renderer.create(
      <SegmentedPicker
        ref={ref}
        visible
        options={[
          {
            key: 'col_1',
            testID: 'picker_col_1',
            items: [
              { label: 'Adam', value: 'adam' },
              { label: 'Harry', value: 'harry' },
              { label: 'Francesca', value: 'francesca' },
              { label: 'Georgia', value: 'georgia' },
            ],
          },
        ]}
        onValueChange={onChangeCallback}
      />,
    );
    jest.advanceTimersByTime(ANIMATION_TIME);
    ref.current.selectLabel('Adam', 'col_1'); // <-- already selected
    expect(onChangeCallback).not.toBeCalled();
    ref.current.selectLabel('Harry', 'col_1');
    expect(onChangeCallback).toBeCalledTimes(1);
    expect(onChangeCallback.mock.calls[0][0]).toStrictEqual({
      column: 'col_1',
      value: 'harry',
    });
  });

  it('Can switch selected items by value.', () => {
    const ref: React.RefObject<SegmentedPicker> = React.createRef();
    const onChangeCallback = jest.fn();
    renderer.create(
      <SegmentedPicker
        ref={ref}
        visible
        options={[
          {
            key: 'col_1',
            testID: 'picker_col_1',
            items: [
              { label: 'Adam', value: 'adam' },
              { label: 'Harry', value: 'harry' },
              { label: 'Francesca', value: 'francesca' },
              { label: 'Georgia', value: 'georgia' },
            ],
          },
        ]}
        onValueChange={onChangeCallback}
      />,
    );
    jest.advanceTimersByTime(ANIMATION_TIME);
    ref.current.selectValue('adam', 'col_1'); // <-- already selected
    expect(onChangeCallback).not.toBeCalled();
    ref.current.selectValue('francesca', 'col_1');
    expect(onChangeCallback).toBeCalledTimes(1);
    expect(onChangeCallback.mock.calls[0][0]).toStrictEqual({
      column: 'col_1',
      value: 'francesca',
    });
  });

  it('Can switch selected items by list index.', () => {
    const ref: React.RefObject<SegmentedPicker> = React.createRef();
    const onChangeCallback = jest.fn();
    renderer.create(
      <SegmentedPicker
        ref={ref}
        visible
        options={[
          {
            key: 'col_1',
            testID: 'picker_col_1',
            items: [
              { label: 'Adam', value: 'adam' },
              { label: 'Harry', value: 'harry' },
              { label: 'Francesca', value: 'francesca' },
              { label: 'Georgia', value: 'georgia' },
            ],
          },
        ]}
        onValueChange={onChangeCallback}
      />,
    );
    jest.advanceTimersByTime(ANIMATION_TIME);
    ref.current.selectIndex(0, 'col_1'); // <-- already selected
    expect(onChangeCallback).not.toBeCalled();
    ref.current.selectIndex(3, 'col_1');
    expect(onChangeCallback).toBeCalledTimes(1);
    expect(onChangeCallback.mock.calls[0][0]).toStrictEqual({
      column: 'col_1',
      value: 'georgia',
    });
  });
});
