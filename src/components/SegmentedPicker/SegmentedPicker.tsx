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
import Cache from '../../services/Cache';
import { PickerItem, PickerOptions, Selections } from '../../config/interfaces';
import {
  ANIMATION_TIME,
  GUTTER_HEIGHT,
  ITEM_HEIGHT,
  FLAT_LIST_REF,
  LAST_SCROLL_OFFSET,
  SCROLL_DIRECTION,
  IS_DRAGGING,
  IS_MOMENTUM_SCROLLING,
  IS_DIRTY,
} from '../../config/constants';

export interface Props {
  options: PickerOptions;
  visible: boolean | null;
  defaultSelections: {
    [column: string]: string;
  };
  size: number;
  confirmText: string;
  // Styling
  confirmTextColor: string;
  listItemTextColor: string;
  toolbarBackground: string;
  toolbarBorderColor: string;
  selectionMarkerBackground: string;
  selectionMarkerBorderColor: string;
  containerBackground: string;
  // Events
  onValueChange: (column: string, value: PickerItem) => void;
  onCancel: (currentSelections: Selections) => void,
  onConfirm: (currentSelections: Selections) => void,
}

interface State {
  visible: boolean;
  pickersHeight: number;
}

export default class SegmentedPicker extends Component<Props, State> {
  static propTypes = propTypes;
  static defaultProps = defaultProps as Partial<Props>;

  cache: Cache = new Cache(); // Used as an internal synchronous state (fast)
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
   * @return {void}
   */
  show = (): void => {
    this.setState({ visible: true });
  };

  /**
   * Hide the picker from the screen.
   * External Usage: `ref.current.hide()`
   * @return {Promise<void>}
   */
  hide = async (): Promise<void> => {
    if (Platform.OS === 'ios') {
      this.setState({ visible: false });
    } else {
      this.modalContainerRef.current.fadeOut(ANIMATION_TIME);
      await this.pickerContainerRef.current.fadeOut(ANIMATION_TIME);
      this.setState({ visible: false });
      this.cache.set(IS_DIRTY, false);
    }
  };

  /**
   * Selects a specific label in the picklist and focuses it.
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
    const { options } = this.props;
    const index = this.findOptionIndex(label, column);
    if (index !== -1) {
      this.selectIndex(index, column, animated, emitEvent);
    } else if (options[column].length > 0 && zeroFallback) {
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
    const { options, onValueChange } = this.props;
    const list = this.cache.get(`${FLAT_LIST_REF}${column}`);
    if (!list) {
      return;
    }
    list.scrollToIndex({
      index,
      animated,
    });
    if (!this.selectionChanges[column]
      || (this.selectionChanges[column]
        && this.selectionChanges[column].label !== options[column][index].label)
    ) {
      this.selectionChanges = {
        ...this.selectionChanges,
        [column]: options[column][index],
      };
      if (emitEvent) {
        onValueChange(column, options[column][index]);
      }
    }
  };

  /**
   * Returns the current picklist selections as they appear on the UI.
   * External Usage: `ref.current.getCurrentSelections()`
   * @return {Selections} {column1: {}, column2: {}, ...}
   */
  getCurrentSelections = (): Selections => {
    const { options } = this.props;
    return Object.keys(options).reduce((columns, column) => {
      const lastOffset = this.cache.get(`${LAST_SCROLL_OFFSET}${column}`);
      const index = this.nearestOptionIndex(
        lastOffset || 0,
        column,
      );
      return {
        ...columns,
        [column]: options[column][index],
      };
    }, {});
  };

  /**
   * @private
   * @param {string} label
   * @param {string} column
   * @return {number}
   */
  private findOptionIndex = (label: string, column: string): number => {
    const { options } = this.props;
    return options[column].findIndex(option => (
      option.label === label
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
          this.selectLabel(
            defaultSelections[column],
            column,
            false,
            false,
            true,
          )
        ));
      // Set all other selections to index 0
      Object.keys(options)
        .filter(column => (
          !Object.keys(defaultSelections).includes(column)
          && options[column].length > 0
        ))
        .forEach(column => (
          this.selectIndex(0, column, false, false)
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
    const { options } = this.props;
    const scrollDirection = this.cache.get(`${SCROLL_DIRECTION}${column}`) || 1;
    const rounding = (scrollDirection === 0) ? 'floor' : 'ceil';
    const adjustedOffsetY = (scrollDirection === 0) ? (
      (offsetY / ITEM_HEIGHT) + 0.35
    ) : (
      (offsetY / ITEM_HEIGHT) - 0.35
    );
    let nearestArrayMember = Math[rounding](adjustedOffsetY) || 0;
    // Safety checks making sure we don't return an out of range index
    const columnSize = Object.keys(options[column]).length;
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
    if (!this.cache.get(`${IS_DRAGGING}${column}`)) {
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
   * @return {void}
   */
  private onCancel = (): void => {
    this.props.onCancel(this.getCurrentSelections());
    this.hide();
  };

  /**
   * @private
   * This method is called when the right action button (default: "Done") is tapped.
   * It calls the `onConfirm` method and hides the picker.
   * @return {void}
   */
  private onConfirm = (): void => {
    this.props.onConfirm(this.getCurrentSelections());
    this.hide();
  };

  /**
   * @private
   * Used by the FlatList to render picklist items.
   * @return {ReactElement}
   */
  private renderPickerItem = (
    { item: { label, column }, index }: { item: { label: string, column: string }, index: number },
  ): ReactElement => {
    const { listItemTextColor } = this.props;
    return (
      <View style={styles.pickerItem}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this.selectIndex(index, column)}
        >
          <Text style={[styles.pickerItemText, { color: listItemTextColor }]}>
            {label}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { visible } = this.state;
    const {
      options,
      size,
      confirmText,
      confirmTextColor,
      toolbarBackground,
      toolbarBorderColor,
      selectionMarkerBackground,
      selectionMarkerBorderColor,
      containerBackground,
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
        >
          <TouchableWithoutFeedback onPress={this.onCancel}>
            <View style={[styles.closeableContainer, { height: `${(100 - size)}%` }]} />
          </TouchableWithoutFeedback>

          <Animatable.View
            useNativeDriver
            animation="slideInUp"
            easing="ease-in-out-cubic"
            duration={ANIMATION_TIME}
            ref={this.pickerContainerRef}
            style={[
              styles.pickerContainer,
              {
                height: `${size}%`,
                backgroundColor: containerBackground,
              },
            ]}
          >
            <View
              style={[
                styles.toolbarContainer,
                {
                  backgroundColor: toolbarBackground,
                  borderBottomColor: toolbarBorderColor,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.4}
                onPress={this.onConfirm}
              >
                <View style={styles.toolbarConfirmContainer}>
                  <Text style={[styles.toolbarConfirmText, { color: confirmTextColor }]}>
                    {confirmText}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.pickers} onLayout={this.measurePickersHeight}>
              {Object.keys(options).map(column => (
                <View style={styles.pickerColumn} key={`column_${column}`}>
                  <View style={styles.selectionMarkerContainer}>
                    <View
                      style={[
                        styles.selectionMarkerBorder,
                        { backgroundColor: selectionMarkerBorderColor },
                      ]}
                    />
                    <View
                      style={[
                        styles.selectionMarker,
                        { backgroundColor: selectionMarkerBackground },
                      ]}
                    />
                    <View
                      style={[
                        styles.selectionMarkerBorder,
                        { backgroundColor: selectionMarkerBorderColor },
                      ]}
                    />
                  </View>

                  <View style={styles.pickerList}>
                    <FlatList
                      data={options[column].map(({ label, key }) => ({
                        label,
                        key,
                        column,
                      }))}
                      renderItem={this.renderPickerItem}
                      keyExtractor={item => `${column}_${item.key || item.label}`}
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
                      onMomentumScrollBegin={event => this.onMomentumScrollBegin(event, column)}
                      onMomentumScrollEnd={event => this.onMomentumScrollEnd(event, column)}
                      scrollEventThrottle={32}
                    />
                  </View>
                </View>
              ))}
            </View>
          </Animatable.View>
        </Animatable.View>
      </Modal>
    );
  }
}
