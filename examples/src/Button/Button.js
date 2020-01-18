import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

const Button = ({
  text,
  onPress,
}) => (
  <View style={{ marginBottom: 30, width: '70%', height: 50 }}>
    <TouchableOpacity onPress={onPress} activeOpacity={0.5} style={{ width: '100%' }}>
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#256188',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: '#FFFFFF',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  </View>
);

Button.defaultProps = {
  text: '',
  onPress: () => {},
};

Button.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func,
};

export default Button;
