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
  RRCLoading,
} from 'react-native-overlayer';

import {
  NavigationContainer
} from '@react-navigation/native';

import {
  createStackNavigator
} from '@react-navigation/stack';

import * as Constants from './src/constants'
import ConnectScreen from './src/connect';
import MeetingScreen from './src/meeting';
import HostScreen from './src/host';

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
          options={{
            headerTitle: '测试专用DEMO'
          }}
        />
        <Stack.Screen
          name={Constants.screens[0]}
          component={MeetingScreen}
          options={{
            headerBackTitle: null
          }}
        />
        <Stack.Screen
          name={Constants.screens[1]}
          component={HostScreen}
          options={{
            headerBackTitle: null
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
