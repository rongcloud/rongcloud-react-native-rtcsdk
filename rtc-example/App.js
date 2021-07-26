/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type { Node } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
  RCReactNativeIm
} from 'rc-react-native-im';

import {
  RCReactNativeRtc,
  RCReactNativeRtcView,
} from 'rc-react-native-rtc'

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  RCReactNativeIm.disconnect();

  RCReactNativeIm.init('z3v5yqkbv8v30');

  const token1 = 'Y5w0rF/AzBlxIl9Y3g76L44CQnLiYgwfq7+si4yGEz7VKxkdiQPSQw==@emx6.cn.rongnav.com;emx6.cn.rongcfg.com';
  const token2 = 'Y5w0rF/AzBkfo1b6Ob6ftejuqf63nNFYq7+si4yGEz4UrVx7Gi7Bkw==@emx6.cn.rongnav.com;emx6.cn.rongcfg.com';

  RCReactNativeIm.connect(token1).then(function(event) {
    console.log(event);
    RCReactNativeRtc.init({});
  });

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <RCReactNativeRtcView style={{ width: '50%', height: 180, backgroundColor: 'blue' }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
