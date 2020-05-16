import React from 'react';
import { YellowBox, View } from 'react-native';
import ExampleA from './src/ExampleA';

YellowBox.ignoreWarnings([
  'Remote debugger is in a background tab',
  'componentWillReceiveProps',
]);

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
