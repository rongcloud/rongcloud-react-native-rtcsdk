/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';

import React from 'react';

import type {
  Node
} from 'react';

import {
  RRCToast,
  RRCLoading,
} from 'react-native-overlayer';

import {
  NavigationContainer
} from '@react-navigation/native';

import {
  createStackNavigator
} from '@react-navigation/stack';

import ConnectScreen from './src/connect';
import MeetingScreen from './src/meeting';

const options = { loadingImage: null, text: 'Loading...' };
RRCLoading.setLoadingOptions(options);
RRCLoading.hide();

const Stack = createStackNavigator();

const App: () => Node = () => {
  const isDarkMode = false;

  const backgroundStyle = {
    backgroundColor: 'white',
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Connect'>
        <Stack.Screen
          name='Connect'
          component={ConnectScreen}
          options={{ title: '测试专用DEMO' }}
        />
        <Stack.Screen
          name='Meeting'
          component={MeetingScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
