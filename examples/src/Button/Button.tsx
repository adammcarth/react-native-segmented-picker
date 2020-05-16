import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

interface Props {
  text: string;
  onPress: () => void;
}

const Button = ({
  text,
  onPress,
}: Props) => (
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

export default Button;
