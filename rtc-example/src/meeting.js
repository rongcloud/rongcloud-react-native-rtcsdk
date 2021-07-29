
import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  View,
  TouchableOpacity,
  NativeEventEmitter,
} from 'react-native';

import {
  RRCToast,
  RRCLoading,
} from 'react-native-overlayer';

import {
  CheckBox
} from '@react-native-community/checkbox';

import {
  NavigationContainer
} from '@react-navigation/native';

import {
  RCReactNativeRtc,
  RCReactNativeRtcView,
} from 'rc-react-native-rtc'

class MeetingScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    RCReactNativeRtc.leaveRoom();
    RCReactNativeRtc.unInit();
  }

  render() {
    return (
      <View style={styles.column}>
      </View>
    );
  }
}

export default MeetingScreen;
