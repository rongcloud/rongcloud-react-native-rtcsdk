import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './src/home';
import Room from './src/room';
import JoinRoom from './src/joinroom';

const Stack = createStackNavigator();

const AppKey = "n19jmcy59ocx9";
const AppSecret = "hccSLZPPmu";

class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home} 
            options={{ title: '融云 CallLib RN 示例' }}
            initialParams={{ 
              AppKey,
              AppSecret
            }}/>
          <Stack.Screen
            name="JoinRoom"
            component={JoinRoom}
            options={{
              headerShown: false,
              gestureEnabled: false
            }}/>
          <Stack.Screen
            name="Room"
            component={Room}
            options={{
              headerShown: false,
              gestureEnabled: false
            }}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;