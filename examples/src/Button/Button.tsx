import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

interface Props {
  text: string;
  onPress: () => void;
  backgroundColor: string;
  testID?: string;
}

const Button = ({
  text,
  onPress,
  backgroundColor,
  testID,
}: Props) => (
  <View style={{ marginBottom: 30, width: '70%', height: 50 }}>
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      style={{ width: '100%' }}
      testID={testID}
    >
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor,
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
  backgroundColor: '#256188',
};

export default Button;
