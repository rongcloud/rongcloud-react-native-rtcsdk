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
import { logger } from '@rongcloud/react-native-rtc';
import EquipmentTestingScreen from './screen/EquipmentTesting';
import NetworkDetectionScreen from './screen/NetworkDetection';
import SetWatermarkScreen from './screen/SetWatermark';
import SeiConfigScreen from './screen/SeiConfig';

const Stack = createNativeStackNavigator();


class App extends React.Component {

  constructor(props: any) {
    super(props)
    logger.enable = true
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
          <Stack.Screen name='EquipmentTesting' component={EquipmentTestingScreen} options={{title: '麦克风&扬声器检测'}} />
          <Stack.Screen name='NetworkDetection' component={NetworkDetectionScreen} options={{title: '网络探测'}} />
          <Stack.Screen name='SetWatermark' component={SetWatermarkScreen} options={{title: '设置水印'}} />
          <Stack.Screen name='SeiConfig' component={SeiConfigScreen} options={{title: 'SEI功能配置'}} />

        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}


export default App;
