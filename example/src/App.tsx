import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  RRCLoading,
} from 'react-native-overlayer';

const options = { loadingImage: null, text: 'Loading...' };
RRCLoading.setLoadingOptions(options);
RRCLoading.hide();

import ConnectScreen from './screen/Connect';

import MeetingScreen from './screen/Meeting';
import HostScreen from './screen/Host';
import SoundEffectScreen from './screen/SoundEffect'
import SoundMixingScreen from './screen/SoundMixing'
import LayoutScreen from './screen/Layout';
import MessageScreen from './screen/Message';
import CdnSettingScreen from './screen/CdnSetting';
import CustomLayoutScreen from './screen/CustomLayout';
import AudienceScreen from './screen/Audience';
import SubRoomScreen from './screen/SubRoom';
import { Logger } from '@rongcloud/react-native-rtc';


const Stack = createNativeStackNavigator();


class App extends React.Component {

  constructor(props: any) {
    super(props)
    Logger.enable = true
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Connect'>
          <Stack.Screen name='Connect' component={ConnectScreen} options={{ headerTitle: '测试专用DEMO' }} />
          <Stack.Screen name='Meeting' component={MeetingScreen} />
          <Stack.Screen name='Host' component={HostScreen} />
          <Stack.Screen name='Audience' component={AudienceScreen} />

          <Stack.Screen name='SoundEffect' component={SoundEffectScreen} />
          <Stack.Screen name='SoundMixing' component={SoundMixingScreen} />

          <Stack.Screen name='CdnSetting' component={CdnSettingScreen} />
          <Stack.Screen name='Layout' component={LayoutScreen} />
          <Stack.Screen name='Message' component={MessageScreen} />

          <Stack.Screen name='CustomLayout' component={CustomLayoutScreen} />

          <Stack.Screen name='SubRoom' component={SubRoomScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}


export default App;
