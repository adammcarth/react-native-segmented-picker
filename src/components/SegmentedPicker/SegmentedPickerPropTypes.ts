import PropTypes from 'prop-types';

export const defaultProps = {
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

export const propTypes = {
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
  size: (props: any, propName: 'size', componentName: string) => {
    const size = props[propName];
    if (size === undefined) return null;
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
