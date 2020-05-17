import React from 'react';
import { View } from 'react-native';
import './src/config/YellowBox';
import ExampleA from './src/ExampleA';

const App = () => (
  <View
    style={{
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
    }}
  >
    <View style={{ width: '100%' }}>
      <ExampleA columns={1} />
      <ExampleA columns={2} />
      <ExampleA columns={3} />
    </View>
  </View>
);

export default App;
