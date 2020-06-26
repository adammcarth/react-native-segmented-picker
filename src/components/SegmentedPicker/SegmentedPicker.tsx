import React, { Component, ReactElement } from 'react';
import {
  Platform,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  View,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { defaultProps, propTypes } from './SegmentedPickerPropTypes';
import styles from './SegmentedPickerStyles';
import Toolbar from '../Toolbar';
import SelectionMarker from '../SelectionMarker';
import UIPicker from '../UIPicker';
import Cache from '../../services/Cache';
import UIPickerManager from '../../services/UIPickerManager';
import {
  PickerColumn,
  PickerItem,
  PickerOptions,
  Selections,
  SelectionEvent,
  UIPickerValueChangeEvent,
} from '../../config/interfaces';
import {
  ANIMATION_TIME,
  GUTTER_HEIGHT,
  ITEM_HEIGHTS,
  TEST_IDS,
  TRACKING,
} from '../../config/constants';

const ITEM_HEIGHT = Platform.select(ITEM_HEIGHTS);

const {
  FLAT_LIST_REF,
  LAST_SCROLL_OFFSET,
  SCROLL_DIRECTION,
  IS_DRAGGING,
  IS_MOMENTUM_SCROLLING,
  IS_DIRTY,
} = TRACKING;

export interface Props {
  native: boolean;
  options: PickerOptions;
  visible: boolean;
  defaultSelections: Selections;
  size: number;
  confirmText: string;
  nativeTestID: string;
  // Styling
  confirmTextColor: string;
  pickerItemTextColor: string;
  toolbarBackgroundColor: string;
  toolbarBorderColor: string;
  selectionBackgroundColor: string;
  selectionBorderColor: string;
  backgroundColor: string;
  // Events
  onValueChange: (event: SelectionEvent) => void;
  onCancel: (event: Selections) => void,
  onConfirm: (event: Selections) => void,
}

interface State {
  visible: boolean;
  pickersHeight: number;
}

interface RenderablePickerItem extends PickerItem {
  key: string;
  column: string;
}

export default class SegmentedPicker extends Component<Props, State> {
  static propTypes = propTypes;
  static defaultProps = defaultProps as Partial<Props>;

  /**
   * @static
   * Decorates the `options` prop with necessary defaults for missing values.
   * @param options {PickerOptions}
   * @return {PickerOptions}
   */
  static ApplyPickerOptionDefaults = (options: PickerOptions): PickerOptions => (
    options.map(column => ({
      ...column,
      flex: column.flex || 1,
    }))
  );

  cache: Cache = new Cache(); // Used as an internal synchronous state (fast)
  uiPickerManager: UIPickerManager = new UIPickerManager();
  selectionChanges: Selections = {};
  modalContainerRef: React.RefObject<any> = React.createRef();
  pickerContainerRef: React.RefObject<any> = React.createRef();

  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false,
      pickersHeight: 0,
    };
    if (!props.options) {
      throw new Error('<SegmentedPicker /> cannot render without the `options` prop.');
    }
  }

  /**
   * Used in rare circumstances where this component is mounted with the `visible`
   * prop set to true. We must animate the picker in immediately.
   */
  componentDidMount(): void {
    if (this.props.visible === true) {
      this.show();
    }
  }

  /**
   * Animates in-and-out when toggling picker visibility with the `visible` prop.
   */
  componentDidUpdate(prevProps: Props): void {
    const { visible: visibleProp } = this.props;
    const { visible: visibleState } = this.state;
    if (visibleProp === true && prevProps.visible !== true && visibleState !== true) {
      this.show();
    }
    if (visibleProp === false && prevProps.visible === true) {
      this.hide();
    }
  }

  /**
   * Make the picker visible on the screen.
   * External Usage: `ref.current.show()`
   * @return {Promise<void>}
   */
  show = (): Promise<void> => {
    this.setState({ visible: true });
    return new Promise(resolve => setTimeout(resolve, ANIMATION_TIME));
  };

  /**
   * Hide the picker from the screen.
   * External Usage: `ref.current.hide()`
   * @return {Promise<void>}
   */
  hide = async (): Promise<void> => (
    new Promise(async (resolve) => {
      if (Platform.OS === 'ios') {
        this.setState({ visible: false }, async () => {
          await new Promise(done => setTimeout(done, ANIMATION_TIME));
          this.cache.purge();
          resolve();
        });
      } else {
        await this.modalContainerRef.current?.fadeOut(ANIMATION_TIME);
        this.setState({ visible: false }, () => {
          this.cache.purge();
          resolve();
        });
      }
    })
  );

  /**
   * Selects a specific picker item `label` in the picklist and focuses it.
   * External Usage: `ref.current.selectLabel()`
   * @param {string} label
   * @param {string} column
   * @param {boolean = true} animated
   * @param {boolean = true} emitEvent: Specify whether to call the `onValueChange` event.
   * @param {boolean = false} zeroFallback: Select the first list item if not found.
   * @return {void}
   */
  selectLabel = (
    label: string,
    column: string,
    animated: boolean = true,
    emitEvent: boolean = true,
    zeroFallback: boolean = false,
  ): void => {
    const index = this.findItemIndexByLabel(label, column);
    if (index !== -1) {
      this.selectIndex(index, column, animated, emitEvent);
    } else if (this.columnItems(column).length > 0 && zeroFallback) {
      this.selectIndex(0, column, animated, emitEvent);
    }
  };

  /**
   * Selects a specific picker item `value` in the picklist and focuses it.
   * External Usage: `ref.current.selectValue()`
   * @param {string} value
   * @param {string} column
   * @param {boolean = true} animated
   * @param {boolean = true} emitEvent: Specify whether to call the `onValueChange` event.
   * @param {boolean = false} zeroFallback: Select the first list item if not found.
   * @return {void}
   */
  selectValue = (
    value: string,
    column: string,
    animated: boolean = true,
    emitEvent: boolean = true,
    zeroFallback: boolean = false,
  ): void => {
    const index = this.findItemIndexByValue(value, column);
    if (index !== -1) {
      this.selectIndex(index, column, animated, emitEvent);
    } else if (this.columnItems(column).length > 0 && zeroFallback) {
      this.selectIndex(0, column, animated, emitEvent);
    }
  };

  /**
   * Selects a specific label in the picklist and focuses it using it's list index.
   * External Usage: `ref.current.selectLabel()`
   * @param {number} index
   * @param {string} column
   * @param {boolean = true} animated
   * @param {boolean = true} emitEvent: Specify whether to call the `onValueChange` event.
   * @return {void}
   */
  selectIndex = (
    index: number,
    column: string,
    animated: boolean = true,
    emitEvent: boolean = true,
  ): void => {
    if (this.isNative()) {
      this.uiPickerManager.selectIndex(index, column, animated);
      return;
    }
    const { onValueChange } = this.props;
    const list = this.cache.get(`${FLAT_LIST_REF}${column}`);
    if (!list) {
      return;
    }
    list.scrollToIndex({
      index,
      animated,
    });
    const items = this.columnItems(column);
    if (!this.selectionChanges[column]
      || (this.selectionChanges[column]
        && this.selectionChanges[column] !== items[index].value)
    ) {
      this.selectionChanges = {
        ...this.selectionChanges,
        [column]: items[index].value,
      };
      if (emitEvent) {
        onValueChange({ column, value: items[index].value });
      }
    }
  };

  /**
   * Returns the current picklist selections as they appear on the UI.
   * External Usage: `await ref.current.getCurrentSelections()`
   * @return {Promise<Selections>} {column1: 'value', column2: 'value', ...}
   */
  getCurrentSelections = async (): Promise<Selections> => {
    if (this.isNative()) {
      const nativeSelections = await this.uiPickerManager.getCurrentSelections();
      return nativeSelections;
    }
    const { options } = this.props;
    return Promise.resolve(
      options.reduce((columns, column) => {
        const lastOffset = this.cache.get(`${LAST_SCROLL_OFFSET}${column.key}`);
        const index = this.nearestOptionIndex(
          lastOffset || 0,
          column.key,
        );
        const items = this.columnItems(column.key);
        return {
          ...columns,
          [column.key]: items[index]?.value,
        };
      }, {}),
    );
  };

  /**
   * @private
   * Should the picker be powered by a native module, or with plain JavaScript?
   * Currently only available as an opt-in option for iOS devices.
   * @return {boolean}
   */
  private isNative = (): boolean => (
    this.props.native && Platform.OS === 'ios'
  );

  /**
   * Filters the `options` prop for a specific column `key`.
   * @param {string} key
   * @return {PickerColumn}
   */
  private getColumn = (key: string): PickerColumn => (
    this.props.options.filter(c => c.key === key)[0]
  );

  /**
   * Returns the picker list items for a specific column `key`.
   * @param {string} key
   * @return {Array<PickerItem>}
   */
  private columnItems = (key: string): Array<PickerItem> => this.getColumn(key)?.items || [];

  /**
   * @private
   * @param {string} label
   * @param {string} column
   * @return {number}
   */
  private findItemIndexByLabel = (label: string, column: string): number => {
    const items = this.columnItems(column);
    return items.findIndex(item => (
      item.label === label
    ));
  };

  /**
   * @private
   * @param {string} value
   * @param {string} column
   * @return {number}
   */
  private findItemIndexByValue = (value: string, column: string): number => {
    const items = this.columnItems(column);
    return items.findIndex(item => (
      item.value === value
    ));
  };

  /**
   * @private
   * Focuses the default picklist selections.
   * @return {void}
   */
  private setDefaultSelections = (): void => {
    const { options, defaultSelections } = this.props;
    const dirty = this.cache.get(IS_DIRTY);
    if (!dirty) {
      // User defined default selections
      Object.keys(defaultSelections)
        .forEach(column => (
          this.selectValue(
            defaultSelections[column],
            column,
            false,
            false,
            true,
          )
        ));
      // Set all other selections to index 0
      options
        .filter(column => (
          !Object.keys(defaultSelections).includes(column.key)
          && this.columnItems(column.key).length > 0
        ))
        .forEach(column => (
          this.selectIndex(0, column.key, false, false)
        ));
    }
  };

  /**
   * @private
   * @param {string} column
   * @param {object} ref: The column's rendered FlatList component.
   * @return {void}
   */
  private setFlatListRef = (column: string, ref: FlatList<any> | null): void => {
    if (ref) {
      this.cache.set(`${FLAT_LIST_REF}${column}`, ref);
      this.setDefaultSelections();
    }
  };

  /**
   * @private
   * @return {void}
   */
  private measurePickersHeight = (event: any): void => {
    const { height } = event.nativeEvent.layout;
    this.setState({ pickersHeight: height });
  };

  /**
   * @private
   * Calculates the padding top and bottom for the pickers so that the first and
   * last list items are centered in the marker when fully scrolled up or down.
   * @return {number}
   */
  private pickersVerticalPadding = (): number => {
    const { pickersHeight } = this.state;
    return (pickersHeight - ITEM_HEIGHT - (GUTTER_HEIGHT * 2)) / 2;
  };

  /**
   * @private
   * Determines the index of the nearest option in the list based off the specified Y
   * scroll offset.
   * @param {number} offsetY: The scroll view content offset from react native (should
   * always be a positive integer).
   * @param {string} column
   * @return {number}
   */
  private nearestOptionIndex = (offsetY: number, column: string): number => {
    const scrollDirection = this.cache.get(`${SCROLL_DIRECTION}${column}`) || 1;
    const rounding = (scrollDirection === 0) ? 'floor' : 'ceil';
    const adjustedOffsetY = (scrollDirection === 0) ? (
      (offsetY / ITEM_HEIGHT) + 0.35
    ) : (
      (offsetY / ITEM_HEIGHT) - 0.35
    );
    let nearestArrayMember = Math[rounding](adjustedOffsetY) || 0;
    // Safety checks making sure we don't return an out of range index
    const columnSize = this.columnItems(column).length;
    if (Math.sign(nearestArrayMember) === -1) {
      nearestArrayMember = 0;
    } else if (nearestArrayMember > columnSize - 1) {
      nearestArrayMember = columnSize - 1;
    }
    return nearestArrayMember;
  };

  /**
   * @private
   * Calculates the current scroll direction based off the last and current Y offsets.
   * @param {NativeSyntheticEvent<NativeScrollEvent>} event: Event details from React Native.
   * @param {string} column
   * @return {void}
   */
  private onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>, column: string): void => {
    if (!event.nativeEvent) return;
    const { y } = event.nativeEvent.contentOffset;
    const lastScrollOffset = this.cache.get(`${LAST_SCROLL_OFFSET}${column}`);
    if (lastScrollOffset !== null && lastScrollOffset < y) {
      this.cache.set(`${SCROLL_DIRECTION}${column}`, 1); // Down
    } else {
      this.cache.set(`${SCROLL_DIRECTION}${column}`, 0); // Up
    }
    this.cache.set(`${LAST_SCROLL_OFFSET}${column}`, y);
  };

  /**
   * @private
   * @param {string} column
   * @return {void}
   */
  private onScrollBeginDrag = (column: string): void => {
    this.cache.set(`${IS_DRAGGING}${column}`, true);
    const dirty = this.cache.get(IS_DIRTY);
    if (!dirty) {
      this.cache.set(IS_DIRTY, true);
    }
  };

  /**
   * @private
   * @param {NativeSyntheticEvent<NativeScrollEvent>} event: Event details from React Native.
   * @param {string} column
   * @return {void}
   */
  private onScrollEndDrag = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    column: string,
  ): void => {
    this.cache.set(`${IS_DRAGGING}${column}`, false);
    if (Platform.OS === 'ios' && !this.cache.get(`${IS_MOMENTUM_SCROLLING}${column}`)) {
      // Not required on Android because all scrolls exit as momentum scrolls,
      // so the below method has already been called prior to this event.
      // Timeout is to temporarily allow raising fingers.
      this.selectIndexFromScrollPosition(event, column, 280);
    }
  };

  /**
   * @private
   * @param {object} event: Event details from React Native.
   * @param {string} column
   * @return {void}
   */
  private onMomentumScrollBegin = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    column: string,
  ): void => {
    this.cache.set(`${IS_MOMENTUM_SCROLLING}${column}`, true);
  };

  /**
   * @private
   * @param {NativeSyntheticEvent<NativeScrollEvent>} event: Event details from React Native.
   * @param {string} column
   * @return {void}
   */
  private onMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    column: string,
  ): void => {
    this.cache.set(`${IS_MOMENTUM_SCROLLING}${column}`, false);
    if (Platform.OS === 'ios') {
      event.persist();
      this.selectIndexFromScrollPosition(event, column, 50);
    } else {
      this.selectIndexFromScrollPosition(event, column);
    }
  };

  /**
   * @private
   * Scrolls to the nearest index based off a y offset from the FlatList.
   * @param {NativeSyntheticEvent<NativeScrollEvent>} event: Event details from React Native.
   * @param {string} column
   * @param {number?} delay
   * @return {void}
   */
  private selectIndexFromScrollPosition = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    column: string,
    delay: number = 0,
  ): void => {
    if (!event.nativeEvent) return;
    const { y } = event.nativeEvent.contentOffset;
    const nearestOptionIndex = this.nearestOptionIndex(y, column);
    setTimeout(() => {
      const isDragging = this.cache.get(`${IS_DRAGGING}${column}`);
      const isMomentumScrolling = this.cache.get(`${IS_MOMENTUM_SCROLLING}${column}`);
      if (!isDragging && !isMomentumScrolling) {
        this.selectIndex(nearestOptionIndex, column);
      }
    }, delay);
  };

  /**
   * @private
   * This method is called when the picker is closed unexpectedly without pressing the
   * "Done" button in the top right hand corner.
   * @return {Promise<void>}
   */
  private onCancel = async (): Promise<void> => {
    const selections = { ...(await this.getCurrentSelections()) };
    if (this.props.visible !== true) {
      await this.hide();
    }
    this.props.onCancel(selections);
  };

  /**
   * @private
   * This method is called when the right action button (default: "Done") is tapped.
   * It calls the `onConfirm` method and hides the picker.
   * @return {Promise<void>}
   */
  private onConfirm = async (): Promise<void> => {
    const selections = { ...(await this.getCurrentSelections()) };
    if (this.props.visible !== true) {
      await this.hide();
    }
    this.props.onConfirm(selections);
  };

  /**
   * @private
   * Used by the FlatList to render picklist items.
   * @return {ReactElement}
   */
  private renderPickerItem = ({
    item: {
      label,
      column,
      key,
      testID,
    },
    index,
  }: {
    item: RenderablePickerItem;
    index: number;
  }): ReactElement => {
    const { pickerItemTextColor } = this.props;
    return (
      <View style={styles.pickerItem}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this.selectIndex(index, column)}
          testID={testID || key}
        >
          <Text
            numberOfLines={1}
            style={[styles.pickerItemText, { color: pickerItemTextColor }]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * @private
   * Forwards value changes onto the client from the Native iOS UIPicker when it is in use
   * over the default JavaScript picker implementation.
   * @param {UIPickerValueChangeEvent}
   * @return {void}
   */
  private uiPickerValueChange = (
    { nativeEvent: { column, value } }: UIPickerValueChangeEvent,
  ): void => {
    const { onValueChange } = this.props;
    onValueChange({ column, value });
  };

  render() {
    const { visible } = this.state;
    const {
      nativeTestID,
      options,
      defaultSelections,
      size,
      confirmText,
      confirmTextColor,
      pickerItemTextColor,
      toolbarBackgroundColor,
      toolbarBorderColor,
      selectionBackgroundColor,
      selectionBorderColor,
      backgroundColor,
    } = this.props;

    return (
      <Modal
        visible={visible}
        animationType={Platform.select({
          ios: 'fade',
          default: 'none',
        })}
        transparent
        onRequestClose={this.onCancel}
      >
        <Animatable.View
          useNativeDriver
          animation="fadeIn"
          easing="ease-out-cubic"
          duration={ANIMATION_TIME}
          ref={this.modalContainerRef}
          style={styles.modalContainer}
          testID={TEST_IDS.PICKER}
        >
          <TouchableWithoutFeedback onPress={this.onCancel} testID={TEST_IDS.CLOSE_AREA}>
            <View style={[styles.closeableContainer, { height: `${(100 - (size * 100))}%` }]} />
          </TouchableWithoutFeedback>

          <Animatable.View
            useNativeDriver
            animation={{
              from: { opacity: 0, translateY: 250 },
              to: { opacity: 1, translateY: 0 },
            }}
            easing="ease-out-quint"
            delay={100}
            duration={ANIMATION_TIME}
            ref={this.pickerContainerRef}
            style={[styles.pickerContainer, { height: `${size * 100}%`, backgroundColor }]}
          >
            <Toolbar
              confirmText={confirmText}
              confirmTextColor={confirmTextColor}
              toolbarBackground={toolbarBackgroundColor}
              toolbarBorderColor={toolbarBorderColor}
              onConfirm={this.onConfirm}
            />

            <View style={styles.selectableArea}>
              {/* Native iOS Picker is enabled */}
              {this.isNative() && (
                <View style={styles.nativePickerContainer}>
                  <UIPicker
                    ref={this.uiPickerManager.reactRef}
                    nativeTestID={nativeTestID}
                    style={styles.nativePicker}
                    options={SegmentedPicker.ApplyPickerOptionDefaults(options)}
                    defaultSelections={defaultSelections}
                    onValueChange={this.uiPickerValueChange}
                    onEmitSelections={this.uiPickerManager.ingestSelections}
                    theme={{
                      itemHeight: ITEM_HEIGHT,
                      selectionBackgroundColor,
                      selectionBorderColor,
                      pickerItemTextColor,
                    }}
                  />
                </View>
              )}

              {/* Plain JavaScript implementation (default) */}
              {!this.isNative() && (
                <>
                  <SelectionMarker
                    backgroundColor={selectionBackgroundColor}
                    borderColor={selectionBorderColor}
                  />
                  <View style={styles.pickerColumns} onLayout={this.measurePickersHeight}>
                    {SegmentedPicker.ApplyPickerOptionDefaults(options).map((
                      { key: column, testID: columnTestID, flex },
                    ) => (
                      <View style={[styles.pickerColumn, { flex }]} key={`${column}`}>
                        <View style={styles.pickerList}>
                          <FlatList
                            data={this.columnItems(column).map(({
                              label,
                              value,
                              key,
                              testID,
                            }) => ({
                              label,
                              value,
                              column,
                              testID,
                              key: `${column}_${key || label}`,
                            }))}
                            renderItem={this.renderPickerItem}
                            keyExtractor={item => item.key}
                            initialNumToRender={40}
                            getItemLayout={(data, index) => (
                              {
                                length: ITEM_HEIGHT,
                                offset: ITEM_HEIGHT * index,
                                index,
                              }
                            )}
                            contentContainerStyle={{
                              paddingTop: this.pickersVerticalPadding(),
                              paddingBottom: this.pickersVerticalPadding(),
                            }}
                            showsVerticalScrollIndicator={false}
                            ref={ref => this.setFlatListRef(column, ref)}
                            onScroll={event => this.onScroll(event, column)}
                            onScrollBeginDrag={() => this.onScrollBeginDrag(column)}
                            onScrollEndDrag={event => this.onScrollEndDrag(event, column)}
                            onMomentumScrollBegin={event => (
                              this.onMomentumScrollBegin(event, column)
                            )}
                            onMomentumScrollEnd={event => (
                              this.onMomentumScrollEnd(event, column)
                            )}
                            scrollEventThrottle={32}
                            decelerationRate={Platform.select({
                              ios: 1,
                              android: 0.985,
                            })}
                            testID={`${columnTestID}`}
                          />
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </View>
          </Animatable.View>
        </Animatable.View>
      </Modal>
    );
  }
}
