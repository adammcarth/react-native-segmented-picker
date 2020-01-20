import React, { Component } from 'react';
import {
  Platform,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import UI from './Styles';

class SegmentedPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      pickersHeight: 0,
      dirty: false,
    };
    this.animationTime = 300;
    this.selectionChanges = {};
    this.modalContainerRef = React.createRef();
    this.pickerContainerRef = React.createRef();

    if (!props.options) {
      throw new Error('<SegmentedPicker /> cannot render without the `options` prop.');
    }
  }

  componentDidUpdate(prevProps) {
    const { visible } = this.props;
    if (prevProps.visible !== visible && visible === false) {
      // Animate out before closing the picker.
      this.hide();
    }
  }

  /**
   * Make the picker visible on the screen.
   * External Usage: `ref.current.show()`
   * @return {void}
   */
  show = () => {
    this.setState({ visible: true });
  }

  /**
   * Hide the picker from the screen.
   * External Usage: `ref.current.hide()`
   * @return {Promise<void>}
   */
  hide = async () => {
    this.modalContainerRef.current.fadeOut(this.animationTime);
    await this.pickerContainerRef.current.fadeOut(this.animationTime);
    this.setState({ visible: false, dirty: false });
  }

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
  selectLabel = (label, column, animated = true, emitEvent = true, zeroFallback = false) => {
    const { options } = this.props;
    const index = this._findOptionIndex(label, column);
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
  selectIndex = (index, column, animated = true, emitEvent = true) => {
    const { options, onValueChange } = this.props;
    const list = this[`flatListRef_${column}`];
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
   * @return {object} {column1: {}, column2: {}, ...}
   */
  getCurrentSelections = () => {
    const { options } = this.props;
    return Object.keys(options).reduce((columns, column) => {
      const index = this._nearestOptionIndex(
        this[`lastScrollOffset_${column}`],
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
   * Determines if the segmented picker should be currently showing. The `visible` prop
   * is given priority over the internal state. If you choose to control the visibility
   * of this component using the `visible` prop, you will also have to ensure that your
   * external state updates based on the `onCancel` and `onConfirm` exit events. This
   * is only recommended if you have a very good reason to use redux (or similar) as
   * the method for controlling the visibility of this component. It is otherwise
   * suggested that you simply use the `show()` method to initially display the picker
   * and then allow the hide events to be automatically controlled.
   * @return {boolean}
   */
  _isVisible = () => {
    const { visible: visibleProp } = this.props;
    const { visible: visibleState } = this.state;
    return visibleProp === true || visibleState;
  }

  /**
   * @private
   * @param {string} label
   * @param {string} column
   * @return {number}
   */
  _findOptionIndex = (label, column) => {
    const { options } = this.props;
    return options[column].findIndex(option => (
      option.label === label
    ));
  }

  /**
   * @private
   * Focuses the default picklist selections.
   * @return {void}
   */
  _setDefaultSelections = () => {
    const { options, defaultSelections } = this.props;
    const { dirty } = this.state;
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
   * @param {object} event: Event details from React Native.
   * @param {string} column
   * @return {void}
   */
  _setFlatListRef = (ref, column) => {
    this[`flatListRef_${column}`] = ref;
    this._setDefaultSelections();
  };

  /**
   * @private
   * @return {void}
   */
  _measurePickersHeight = (event) => {
    const { height } = event.nativeEvent.layout;
    this.setState({ pickersHeight: height });
  };

  /**
   * @private
   * Calculates the padding top and bottom for the pickers so that the first and
   * last list items are centered in the marker when fully scrolled up or down.
   * @return {number}
   */
  _pickersVerticalPadding = () => {
    const { pickersHeight } = this.state;
    return (
      pickersHeight - UI.consts.ITEM_HEIGHT - (UI.consts.GUTTER_HEIGHT * 2)
    ) / 2;
  };

  /**
   * @private
   * Determines the index of the nearest option in the list based off the specified Y
   * scroll offset.
   * @param {number} offsetY: The scroll view content offset from react native (should
   * always be a positive integer).
   * @param {string} column
   * @return {void}
   */
  _nearestOptionIndex = (offsetY, column) => {
    const { options } = this.props;
    const scrollDirection = this[`scrollDirection_${column}`]; // 0 = Up, 1 = Down
    const rounding = (scrollDirection === 0) ? 'floor' : 'ceil';
    const adjustedOffsetY = (scrollDirection === 0) ? (
      (offsetY / UI.consts.ITEM_HEIGHT) + 0.35
    ) : (
      (offsetY / UI.consts.ITEM_HEIGHT) - 0.35
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
  }

  /**
   * @private
   * Calculates the current scroll direction based off the last and current Y offsets.
   * @param {object} event: Event details from React Native.
   * @param {string} column
   * @return {void}
   */
  _onScroll = (event, column) => {
    if (!event.nativeEvent) return;
    const { y } = event.nativeEvent.contentOffset;
    const lastScrollOffset = this[`lastScrollOffset_${column}`];
    if (lastScrollOffset < y) {
      this[`scrollDirection_${column}`] = 1; // Down
    } else {
      this[`scrollDirection_${column}`] = 0; // Up
    }
    this[`lastScrollOffset_${column}`] = y;
  };

  /**
   * @private
   * @param {string} column
   * @return {void}
   */
  _onScrollBeginDrag = (column) => {
    this[`isDragging_${column}`] = true;
    const { dirty } = this.state;
    if (!dirty) {
      this.setState({ dirty: true });
    }
  };

  /**
   * @private
   * @param {string} column
   * @return {void}
   */
  _onScrollEndDrag = (event, column) => {
    this[`isDragging_${column}`] = false;
    if (Platform.OS === 'ios' && !this[`isMomentumScrolling_${column}`]) {
      // Not required on Android because all scrolls exit as momentum scrolls,
      // so the below method has already been called prior to this event.
      // Timeout is to temporarily allow raising fingers.
      this._selectIndexFromScrollPosition(event, column, 280);
    }
  };

  /**
   * @private
   * @param {object} event: Event details from React Native.
   * @param {string} column
   * @return {void}
   */
  _onMomentumScrollBegin = (event, column) => {
    this[`isMomentumScrolling_${column}`] = true;
  };

  /**
   * @private
   * @param {object} event: Event details from React Native.
   * @param {string} column
   * @return {void}
   */
  _onMomentumScrollEnd = (event, column) => {
    this[`isMomentumScrolling_${column}`] = false;
    if (!this[`isDragging_${column}`]) {
      this._selectIndexFromScrollPosition(event, column);
    }
  };

  /**
   * @private
   * Scrolls to the nearest index based off a y offset from the FlatList.
   * @param {object} event: Event details from React Native.
   * @param {string} column
   * @param {number?} delay
   * @return {void}
   */
  _selectIndexFromScrollPosition = (event, column, delay = 0) => {
    if (!event.nativeEvent) return;
    const { y } = event.nativeEvent.contentOffset;
    const nearestOptionIndex = this._nearestOptionIndex(y, column);
    setTimeout(() => {
      if (!this[`isDragging_${column}`] && !this[`isMomentumScrolling_${column}`]) {
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
  _onCancel = () => {
    const { onCancel } = this.props;
    onCancel(this.getCurrentSelections());
    this.hide();
  };

  /**
   * @private
   * This method is called when the right action button (default: "Done") is tapped.
   * It calls the `onConfirm` method and hides the picker.
   * @return {void}
   */
  _onConfirm = () => {
    const { onConfirm } = this.props;
    onConfirm(this.getCurrentSelections());
    this.hide();
  };

  /**
   * @private
   * Used by the FlatList to render picklist items.
   * @return {React<Element>}
   */
  _renderPickerItem = ({ item: { label, column }, index }) => {
    const { listItemTextColor } = this.props;
    return (
      <UI.PickerItem>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this.selectIndex(index, column)}
        >
          <UI.PickerItemText style={{ color: listItemTextColor }}>
            {label}
          </UI.PickerItemText>
        </TouchableOpacity>
      </UI.PickerItem>
    );
  }

  render() {
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
        visible={this._isVisible()}
        animationType="none"
        transparent
        onRequestClose={this._onCancel}
      >
        <UI.ModalContainer
          useNativeDriver
          animation="fadeIn"
          easing="ease-out-cubic"
          duration={this.animationTime}
          ref={this.modalContainerRef}
        >
          <TouchableWithoutFeedback onPress={this._onCancel}>
            <UI.CloseableContainer style={{ height: `${(100 - size)}%` }} />
          </TouchableWithoutFeedback>

          <UI.PickerContainer
            useNativeDriver
            animation="slideInUp"
            easing="ease-in-out-cubic"
            duration={this.animationTime}
            ref={this.pickerContainerRef}
            style={{
              height: `${size}%`,
              backgroundColor: containerBackground,
            }}
          >
            <UI.ToolbarContainer
              style={{
                backgroundColor: toolbarBackground,
                borderBottomColor: toolbarBorderColor,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.4}
                onPress={this._onConfirm}
              >
                <UI.ToolbarConfirmContainer>
                  <UI.ToolbarConfirmText style={{ color: confirmTextColor }}>
                    {confirmText}
                  </UI.ToolbarConfirmText>
                </UI.ToolbarConfirmContainer>
              </TouchableOpacity>
            </UI.ToolbarContainer>

            <UI.Pickers onLayout={this._measurePickersHeight}>
              {Object.keys(options).map(column => (
                <UI.PickerColumn key={`column_${column}`}>
                  <UI.SelectionMarkerContainer>
                    <UI.SelectionMarkerBorder
                      style={{ backgroundColor: selectionMarkerBorderColor }}
                    />
                    <UI.SelectionMarker
                      style={{ backgroundColor: selectionMarkerBackground }}
                    />
                    <UI.SelectionMarkerBorder
                      style={{ backgroundColor: selectionMarkerBorderColor }}
                    />
                  </UI.SelectionMarkerContainer>

                  <UI.PickerList>
                    <FlatList
                      data={options[column].map(({ label, key }) => ({
                        label,
                        key,
                        column,
                      }))}
                      renderItem={this._renderPickerItem}
                      keyExtractor={item => `${column}_${item.key || item.label}`}
                      initialNumToRender={40}
                      getItemLayout={(data, index) => (
                        {
                          length: UI.consts.ITEM_HEIGHT,
                          offset: UI.consts.ITEM_HEIGHT * index,
                          index,
                        }
                      )}
                      contentContainerStyle={{
                        paddingTop: this._pickersVerticalPadding(),
                        paddingBottom: this._pickersVerticalPadding(),
                      }}
                      showsVerticalScrollIndicator={false}
                      ref={ref => this._setFlatListRef(ref, column)}
                      onScroll={event => this._onScroll(event, column)}
                      onScrollBeginDrag={() => this._onScrollBeginDrag(column)}
                      onScrollEndDrag={event => this._onScrollEndDrag(event, column)}
                      onMomentumScrollBegin={event => this._onMomentumScrollBegin(event, column)}
                      onMomentumScrollEnd={event => this._onMomentumScrollEnd(event, column)}
                      scrollEventThrottle={32}
                    />
                  </UI.PickerList>
                </UI.PickerColumn>
              ))}
            </UI.Pickers>
          </UI.PickerContainer>
        </UI.ModalContainer>
      </Modal>
    );
  }
}

SegmentedPicker.defaultProps = {
  visible: null,
  defaultSelections: {},
  size: 45,
  confirmText: 'Done',
  confirmTextColor: '#0A84FF',
  listItemTextColor: '#282828',
  toolbarBackground: '#FAFAF8',
  toolbarBorderColor: '#E7E7E7',
  selectionMarkerBackground: '#F8F8F8',
  selectionMarkerBorderColor: '#DCDCDC',
  containerBackground: '#FFFFFF',
  onValueChange: () => {},
  onCancel: () => {},
  onConfirm: () => {},
};

SegmentedPicker.propTypes = {
  // Core Props
  options: PropTypes.objectOf((
    propValue,
    key,
    componentName,
    location,
    propName,
  ) => {
    const column = propValue[key];
    const failedError = new Error(
      `Invalid prop \`${propName}\` supplied to \`${componentName}\`.`
      + ' Must be in the format: `{column1: [{label: \'\'}, ...], column2: [...]}`',
    );
    try {
      return !Array.isArray(column)
      || (column.length > 0 && column.filter(item => !item.label).length > 0) ? (
          failedError
        ) : null;
    } catch {
      return failedError;
    }
  }).isRequired,
  visible: PropTypes.bool,
  defaultSelections: PropTypes.objectOf((
    propValue,
    key,
    componentName,
    location,
    propName,
  ) => {
    const column = propValue[key];
    return (column && String(column) !== column) ? (
      new Error(
        `Invalid prop \`${propName}\` supplied to \`${componentName}\`.`
        + ' Must be in the format: `{column1: \'\', column2: \'\', ...}`',
      )
    ) : null;
  }),
  size: (props, propName, componentName) => {
    const size = props[propName];
    return !(size >= 0 && size <= 100) ? (
      new Error(
        `Invalid prop \`${propName}\` supplied to \`${componentName}\`.`
        + ' Value must be a number between 0-100 representing the screen height to take up.',
      )
    ) : null;
  },
  confirmText: PropTypes.string,
  // Styling
  confirmTextColor: PropTypes.string,
  listItemTextColor: PropTypes.string,
  toolbarBackground: PropTypes.string,
  toolbarBorderColor: PropTypes.string,
  selectionMarkerBackground: PropTypes.string,
  selectionMarkerBorderColor: PropTypes.string,
  containerBackground: PropTypes.string,
  // Events
  onValueChange: PropTypes.func,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default SegmentedPicker;
