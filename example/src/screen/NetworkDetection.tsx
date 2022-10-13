
import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as Util from '../util';

import { rtcEngine } from './Connect';
import { RCRTCIWNetworkProbeStats } from 'src/RCRTCDefines';
import {
  RRCLoading,
  RRCToast
} from 'react-native-overlayer';

interface IProps {
  
}

interface IStates {
  isNetworkProbe: boolean,
  upLinkStats?: RCRTCIWNetworkProbeStats,
  downLinkStats?: RCRTCIWNetworkProbeStats,
}

class NetworkDetectionScreen extends React.Component<IProps, IStates> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      isNetworkProbe: false
    };

   
  }

  componentDidMount() {}

  componentWillUnmount() {
    Util.unInit();
    rtcEngine?.setOnNetworkProbeUpLinkStatsListener();
    rtcEngine?.setOnNetworkProbeDownLinkStatsListener();
    rtcEngine?.setOnNetworkProbeFinishedListener();
    rtcEngine?.destroy();
  }

  addListener() {
  }

  executeNetwortProbe() {
    if (this.state.isNetworkProbe) {
      rtcEngine?.setOnNetworkProbeStoppedListener((code: number, errMsg: string) => {
        if (code == 0) {
          this.setState({isNetworkProbe: false, upLinkStats: undefined, downLinkStats: undefined}, () => {})
        } else {
          RRCToast.show(errMsg);
        }
      });
      rtcEngine?.stopNetworkProbe();
    } else {
      rtcEngine?.setOnNetworkProbeUpLinkStatsListener((stats: RCRTCIWNetworkProbeStats) => {
        RRCLoading.hide();
        console.log('setOnNetworkProbeUpLinkStatsListener', stats)
        this.setState({upLinkStats: stats}, () => {})
      })
      rtcEngine?.setOnNetworkProbeDownLinkStatsListener((stats: RCRTCIWNetworkProbeStats) => {
        RRCLoading.hide();
        console.log('setOnNetworkProbeDownLinkStatsListener', stats)
        this.setState({downLinkStats: stats}, () => {})
      })
      rtcEngine?.setOnNetworkProbeFinishedListener((code: number, errMsg: string) => {
        RRCLoading.hide();
        console.log('setOnNetworkProbeFinishedListener', code, errMsg)
        this.setState({isNetworkProbe: false, upLinkStats: undefined, downLinkStats: undefined}, () => {})
      })
      rtcEngine?.setOnNetworkProbeStartedListener((code: number, errMsg: string) => {
        if (code == 0) {
          this.setState({isNetworkProbe: true}, () => {})
        } else {
          RRCLoading.hide();
          RRCToast.show(errMsg);
        }
      });
      RRCLoading.show();
      rtcEngine?.startNetworkProbe();
    }
  }

  render() {
    let qualityLevelDesc = ['Excellent', 'Good', 'Pool', 'Bad', 'VeryBad', 'Down'];
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.btn} onPress={() => {this.executeNetwortProbe()}}>
        <Text style={styles.text}>{this.state.isNetworkProbe ? '停止探测' : '开启探测'}</Text>
        </TouchableOpacity>
        {/* 网络状态表格 */}
        <View style={{ marginLeft: 5, marginRight: 5, marginTop: 30 }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ ...styles.formBorder }}>
            </View>
            <View style={{ ...styles.formBorder, borderLeftWidth: 0 }}>
              <Text style={styles.formText}>{'质量'}</Text>
            </View>
            <View style={{ ...styles.formBorder, borderLeftWidth: 0 }}>
              <Text style={styles.formText}>{'往返'}</Text>
            </View>
            <View style={{ ...styles.formBorder, borderLeftWidth: 0, }}>
              <Text style={styles.formText}>{'丢包率'}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ ...styles.formBorder, borderTopWidth: 0 }}>
              <Text style={styles.formText}>上行</Text>
            </View>
            <View style={{ ...styles.formBorder, borderLeftWidth: 0, borderTopWidth: 0, }}>
              <Text style={styles.formText}>{this.state.upLinkStats ? qualityLevelDesc[this.state.upLinkStats.qualityLevel || 0] : '-'}</Text>
            </View>
            <View style={{ ...styles.formBorder, borderLeftWidth: 0, borderTopWidth: 0, }}>
              <Text style={styles.formText}>{this.state.upLinkStats ? (this.state.upLinkStats.rtt + 'ms'): '-'}</Text>
            </View>
            <View style={{ ...styles.formBorder, borderLeftWidth: 0, borderTopWidth: 0 }}>
              <Text style={styles.formText}>{this.state.upLinkStats ? this.state.upLinkStats.packetLostRate : '-'}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ ...styles.formBorder, borderTopWidth: 0 }}>
              <Text style={styles.formText}>下行</Text>
            </View>
            <View style={{ ...styles.formBorder, borderLeftWidth: 0, borderTopWidth: 0, }}>
              <Text style={styles.formText}>{this.state.downLinkStats ? qualityLevelDesc[this.state.downLinkStats.qualityLevel || 0] : '-'}</Text>
            </View>
            <View style={{ ...styles.formBorder, borderLeftWidth: 0, borderTopWidth: 0, }}>
              <Text style={styles.formText}>{this.state.downLinkStats ? (this.state.downLinkStats.rtt + 'ms'): '-'}</Text>
            </View>
            <View style={{ ...styles.formBorder, borderLeftWidth: 0, borderTopWidth: 0 }}>
              <Text style={styles.formText}>{this.state.downLinkStats ? this.state.downLinkStats.packetLostRate : '-'}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  btn: {
    marginTop: 50,
    borderWidth: 1,
    borderColor: '#000000',
    alignSelf: 'center',
    paddingHorizontal: 30,
    paddingVertical: 5
  },
  text: {
    textAlign: 'center'
  },
  formBorder: {
    borderWidth: 1,
    borderColor: 'lightblue',
    alignItems: 'center',
    height: 35,
    flex: 1,
    justifyContent: 'center'
  },

  formText: {
    fontSize: 12
  }
})

export default NetworkDetectionScreen;
