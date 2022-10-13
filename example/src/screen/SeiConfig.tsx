import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
  ScrollView,
} from 'react-native';

import { rtcEngine } from './Connect';
import {
  RRCToast,
  RRCLoading
} from 'react-native-overlayer';

interface IProps {
  
}

interface IStates {
  enableSei: boolean;
  seiContent: string;
  seiNum: string;
  anchorReceivedSei: string;
}

class SeiConfigScreen extends React.Component<IProps, IStates> {

  timer: any;

  constructor(props: IProps) {
    super(props);
    this.state = {
      enableSei: false,
      seiContent: '',
      seiNum: '',
      anchorReceivedSei: ''
    };
  }

  componentDidMount() {
    this.addListener();
    RRCLoading.hide();
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }
  
  addListener () {
    // 开启 SEI 功能结果回调
    rtcEngine?.setOnSeiEnabledListener((enable: boolean, code: number, errMsg: string) => {
      RRCLoading.hide();
      if (code == 0) {
        this.setState({enableSei: enable})
      } else {
        RRCToast.show(errMsg)
      }
    })

    // 主播收到 SEI 信息回调
    rtcEngine?.setOnSeiReceivedListener((roomId: string, userId: string, sei: string) => {
      this.setState({anchorReceivedSei: 'roomId:' + roomId + '\n' + 'userId:' + userId + '\n' + 'sei:' + sei})
    })
  }

  sendSei() {
    if (this.state.seiContent?.length === 0) {
      RRCToast.show('请输入发送 sei 的内容')
      return
    }
    if (this.state.seiNum?.length === 0) {
      RRCToast.show('请输入发送 sei 的次数')
      return
    }
    RRCToast.show('正在发送');
    let total: number = Number(this.state.seiNum);
    this.timer = setInterval(() => {
      total = total - 1;
      if (total === 0) {
        this.timer && clearTimeout(this.timer);
        RRCLoading.hide();
        RRCToast.show('发送完成')
      }
      rtcEngine?.sendSei(this.state.seiContent);
    }, 2000);
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.lineView}>
          <Text style={[styles.text, {width: 100, alignSelf: 'center', textAlign: 'left'}]}>{'开启 SEI 功能'}</Text>
          <Switch
            value={this.state.enableSei}
            onValueChange={() => {
              RRCLoading.show();
              rtcEngine?.enableSei(!this.state.enableSei);
            }}
          />
        </View>
        <View style={styles.lineView}>
          <Text style={[styles.text, {width: 100, alignSelf: 'center', textAlign: 'left'}]}>{'发送的内容'}</Text>
          <TextInput
            placeholder={'请输入发送 sei 的内容'}
            style={styles.textInput}
            value={this.state.seiContent}
            onChangeText={(value: string) => {
              this.setState({seiContent: value})
            }}
          />
        </View>
        <View style={styles.lineView}>
          <Text style={[styles.text, {width: 100, alignSelf: 'center', textAlign: 'left'}]}>{'发送的次数'}</Text>
          <TextInput
            placeholder={'请输入发送 sei 的次数 (2s 发一次)'}
            style={styles.textInput}
            value={this.state.seiNum}
            keyboardType={'number-pad'}
            onChangeText={(value: string) => {
              this.setState({seiNum: value})
            }}
          />
        </View>
        <TouchableOpacity style={styles.btn} onPress={() => {this.sendSei()}}>
          <Text style={styles.text}>{'发送'}</Text>
        </TouchableOpacity>
        {this.state.anchorReceivedSei?.length > 0 &&
          <View style={[styles.tipView, {marginTop: 36}]}>
            <Text style={styles.tipTitle}>{'主播收到 SEI 信息回调'}</Text>
            <Text style={styles.tipDesc}>{this.state.anchorReceivedSei}</Text>
          </View>
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF'
  },
  lineView: {
    flexDirection: 'row',
    paddingVertical: 8
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 2,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  btn: {
    height: 40,
    marginTop: 18,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#000000',
    paddingHorizontal: 30,
    paddingVertical: 5,
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center'
  },
  tipView: {
    paddingVertical: 8,
  },
  tipTitle: {
    lineHeight: 30,
    fontSize: 16,
    fontWeight: '600'
  },
  tipDesc: {
    marginTop: 8,
    textAlignVertical: 'center',
    lineHeight: 20,
    fontSize: 14,
    fontWeight: '400'
  }
})

export default SeiConfigScreen;
