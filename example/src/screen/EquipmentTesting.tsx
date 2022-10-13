import React from 'react';
import * as Util from '../util';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';

import {
  RCRTCEngine,
  RCRTCRemoteVideoStats,
} from '@rongcloud/react-native-rtc'
import { rtcEngine } from './Connect';
import {
  RRCToast
} from 'react-native-overlayer';

interface IProps {
  
}

interface IStates {
  value: string,
  testState: 'undetection' | 'detection' | 'play',
  currentTime: number
}

class EquipmentTestingScreen extends React.Component<IProps, IStates> {

  timer: any;

  constructor(props: IProps) {
    super(props);
    this.state = {
      value: '',
      testState: 'undetection',
      currentTime: 0
    };

   
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
    Util.unInit();
    rtcEngine?.setOnRemoteVideoStatsListener();
    rtcEngine?.destroy();
  }

  addListener() {
    rtcEngine?.setOnRemoteVideoStatsListener((roomId: string, userId: string, stats: RCRTCRemoteVideoStats) => {
      const user = Util.users.get(userId)
      if (user) {
        user.remoteVideoStats = stats;
        this.setState({ refresh: {} })
      }
    })
  }

  executeTest() {
    if (this.state.testState === 'undetection') {
      if (this.state.value?.length === 0) {
        RRCToast.show('请输入时间');
        return
      }
      if (Number(this.state.value) < 2 || Number(this.state.value) > 10) {
        RRCToast.show('时间范围为: 2s - 10s');
        return
      }
      let total: number = Number(this.state.value);
      rtcEngine?.startEchoTest(Number(this.state.value))
      this.setState({testState: 'detection', currentTime: total}, () => {
        this.timer = setInterval(() => {
          total = total - 1;
          if (total === 0) {
            this.timer && clearTimeout(this.timer);
            let playTime: number = 0;
            this.setState({testState: 'play', currentTime: playTime}, () => {
              this.timer = setInterval(() => {
                playTime = playTime + 1;
                if (playTime >  Number(this.state.value)) {
                  this.timer && clearTimeout(this.timer);
                  this.setState({testState: 'undetection', currentTime: 0})
                  rtcEngine?.stopEchoTest()
                } else {
                  this.setState({currentTime: playTime})
                }
              }, 1000);
            })
          } else {
            this.setState({currentTime: total}, () => {})
          }
        }, 1000);
      })
    } else {
      rtcEngine?.stopEchoTest()
      this.setState({testState: 'undetection', currentTime: 0})
      this.timer && clearTimeout(this.timer);
    }
  }

  render() {
    let tip = '';
    if (this.state.testState === 'detection') {
      tip = '请说一些话';
    } else if (this.state.testState == 'play') {
      tip = '现在应该能听到刚才的声音';
    }
    return (
      <View style={styles.container}>
        <View style={styles.inputView}>
          <Text style={[styles.text, {alignSelf: 'center'}]}>{'时间'}</Text>
          <TextInput
            placeholder={'请输入时间(范围:2s ~ 10s)'}
            style={styles.textInput}
            value={this.state.value}
            keyboardType={'number-pad'}
            onChangeText={(value: string) => {
              this.setState({value: value})
            }}
          />
        </View>
        <TouchableOpacity style={styles.btn} onPress={() => {this.executeTest()}}>
          <Text style={styles.text}>{this.state.testState === 'undetection' ? '开始检测' : '停止检测'}</Text>
        </TouchableOpacity>
        <Text style={[styles.text, {marginTop: 30}]}>{this.state.currentTime ? this.state.currentTime : ' '}</Text>
        {tip?.length > 0 &&
          <Text style={[styles.text, {marginTop: 30}]}>{tip}</Text>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#FFFFFF'
  },
  inputView: {
    flexDirection: 'row',
    alignSelf: 'center'
  },
  textInput: {
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 200
  },
  btn: {
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#000000',
    alignSelf: 'center',
    paddingHorizontal: 30,
    paddingVertical: 5
  },
  text: {
    textAlign: 'center'
  }
})

export default EquipmentTestingScreen;
