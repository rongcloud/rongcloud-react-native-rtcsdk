import React from 'react';

import * as Util from '../util';
import * as Constants from '../constants'
import Picker from '../component/Picker';
import Radio from '../component/Radio';
import CheckBox from '../component/CheckBox';
import {
  Text,
  View,
  TouchableOpacity,
  findNodeHandle,
  Image,
  StyleSheet,
  Button,
  NativeModules,
  ScrollView,
} from 'react-native';

import {
  RRCToast,
  RRCLoading,
} from 'react-native-overlayer';
import {
  RCReactNativeRtcView,
  RCRTCMediaType,
  RCRTCCamera,
  RCRTCNetworkType,
  RCRTCNetworkStats,
  RCRTCLocalAudioStats,
  RCRTCLocalVideoStats,
  RCRTCViewFitType,
  RCRTCRemoteAudioStats,
  RCRTCRemoteVideoStats,
  RCRTCVideoConfig,
  RCRTCVideoFps,
  RCRTCVideoResolution
} from '@rongcloud/react-native-rtc'
import { rtcEngine } from './Connect';


const { Beauty } = NativeModules;

import type { NativeStackScreenProps } from '@react-navigation/native-stack';



interface MeetingScreenProps extends NativeStackScreenProps<any> {

}


interface MeetingScreenStates {
  refresh: object,
  microphone: boolean,
  camera: boolean,
  audio: boolean,
  video: boolean,
  speaker: boolean,
  front: boolean,
  mirror: boolean,
  fitType: RCRTCViewFitType,
  videoConfig: RCRTCVideoConfig,
  tinyVideoConfig: RCRTCVideoConfig,
  networkStats: RCRTCNetworkStats,
  localAudioStats: RCRTCLocalAudioStats | null,
  localVideoStats: RCRTCLocalVideoStats | null,
  localTinyVideoStats: RCRTCLocalVideoStats | null,
}


const defaultVideoConfig = {
  minBitrate: 500,
  maxBitrate: 2200,
  fps: RCRTCVideoFps.FPS_24,
  resolution: RCRTCVideoResolution.Resolution_720x1280,
}

const defaultTinyVideoConfig = {
  minBitrate: 100,
  maxBitrate: 500,
  resolution: RCRTCVideoResolution.Resolution_240x320,
}

const defaultNetworkStats = {
  type: RCRTCNetworkType.Unknown,
  ip: '',
  sendBitrate: 0,
  receiveBitrate: 0,
  rtt: 0
}

class MeetingScreen extends React.Component<MeetingScreenProps, MeetingScreenStates> {
  localtag: number | null;
  isBeautyOpen: boolean
  constructor(props: MeetingScreenProps) {
    super(props);
    this.state = {
      refresh: {},
      microphone: false,
      camera: false,
      audio: false,
      video: false,
      speaker: false,
      front: true,
      mirror: true,
      fitType: RCRTCViewFitType.Center,
      videoConfig: defaultVideoConfig,
      tinyVideoConfig: defaultTinyVideoConfig,
      networkStats: defaultNetworkStats,
      localAudioStats: null,
      localVideoStats: null,
      localTinyVideoStats: null
    };


    this.localtag = null;
    this.isBeautyOpen = false
    rtcEngine?.setVideoConfig(defaultVideoConfig, false);
    rtcEngine?.setVideoConfig(defaultTinyVideoConfig, true);
    rtcEngine?.enableMicrophone(this.state.microphone);
    rtcEngine?.enableSpeaker(this.state.speaker)
    rtcEngine?.setOnEnableCameraListener((enable: boolean, code: number, message: string) => {
      if (code != 0)
        RRCToast.show((enable ? 'Stop' : 'Start') + ' Camera Error: ' + code + ', message: ' + message);
      else {
        if (enable) {
          if (this.localtag)
            rtcEngine?.setLocalView(this.localtag);
        } else {
          rtcEngine?.removeLocalView();
        }
        this.setState({ camera: enable });
      }
      RRCLoading.hide();
    })


    rtcEngine?.setOnPublishedListener((type: RCRTCMediaType, code: number, message: string) => {
      if (code != 0) RRCToast.show('Publish Error: ' + code + ', message: ' + message);
      else {
        let state: any = {};
        switch (type) {
          case RCRTCMediaType.Audio:
            state.audio = code == 0;
            break;
          case RCRTCMediaType.Video:
            state.video = code == 0;
            break;
          default:
            state.audio = code == 0;
            state.video = code == 0;
            break;
        }
        this.setState(state);
        this.setOptions()
      }
      RRCLoading.hide();
    })


    rtcEngine?.setOnUnpublishedListener((type: RCRTCMediaType, code: number, message: string) => {
      if (code != 0)
        RRCToast.show('Publish  Error: ' + code + ', message: ' + message);
      else {
        let state: any = {};
        switch (type) {
          case RCRTCMediaType.Audio:
            state.audio = code != 0;
            break;
          case 1:
            state.video = code != 0;
            break;
          default:
            state.audio = code != 0;
            state.video = code != 0;
            break;
        }
        this.setState(state);
        this.setOptions()
      }
      RRCLoading.hide();
    })


    rtcEngine?.setOnSwitchCameraListener((camera: RCRTCCamera, code: number, message: string) => {
      if (code != 0)
        RRCToast.show('Switch Camera Error: ' + code + ', message: ' + message);
      else
        this.setState({ front: camera == 1 });
      RRCLoading.hide();
    })


    rtcEngine?.setOnSubscribedListener((id: string, type: RCRTCMediaType, code: number, message: string) => {
      if (code != 0)
        RRCToast.show('Subscribe ' + id + ' ' + ' Error: ' + code + ', message: ' + message);
      else {
        let user = Util.users.get(id);
        if (type != RCRTCMediaType.Audio)
          rtcEngine?.setRemoteView(id, user!.viewTag!);
        if (user) {
          switch (type) {
            case 0:
              user.audioSubscribed = true;
              break;
            case 1:
              user.videoSubscribed = true;
              break;
            default:
              user.audioSubscribed = true;
              user.videoSubscribed = true;
              break;
          }
        }
        this.setState({ refresh: {} });
      }
      RRCLoading.hide();
    })


    rtcEngine?.setOnUnsubscribedListener((id: string, type: RCRTCMediaType, code: number, message: string) => {
      if (code != 0)
        RRCToast.show('Unsubscribe ' + id + ' ' + ' Error: ' + code + ', message: ' + message);
      else {
        if (type != RCRTCMediaType.Audio)
          rtcEngine?.removeRemoteView(id);
        let user = Util.users.get(id);
        if (user) {
          switch (type) {
            case 0:
              user.audioSubscribed = false;
              break;
            case 1:
              user.videoSubscribed = false;
              break;
            default:
              user.audioSubscribed = false;
              user.videoSubscribed = false;
              break;
          }
        }
        this.setState({ refresh: {} });
      }
      RRCLoading.hide();
    })
    rtcEngine?.setOnNetworkStatsListener((stats: RCRTCNetworkStats) => {
      this.setState({ networkStats: stats })
    })

    rtcEngine?.setOnLocalAudioStatsListener((stats: RCRTCLocalAudioStats) => {
      this.setState({ localAudioStats: stats })
    })

    rtcEngine?.setOnLocalVideoStatsListener((stats: RCRTCLocalVideoStats) => {
      if (stats.tiny)
        this.setState({ localTinyVideoStats: stats })
      else
        this.setState({ localVideoStats: stats })
    })

    rtcEngine?.setOnRemoteAudioStatsListener((roomId: string, userId: string, stats: RCRTCRemoteAudioStats) => {
      const user = Util.users.get(userId)
      if (user) {
        user.remoteAudioStats = stats;
        this.setState({ refresh: {} })
      }
    })

    rtcEngine?.setOnRemoteVideoStatsListener((roomId: string, userId: string, stats: RCRTCRemoteVideoStats) => {
      const user = Util.users.get(userId)
      if (user) {
        user.remoteVideoStats = stats;
        this.setState({ refresh: {} })
      }
    })

    Util.setOnRefreshListener(
      () => {
        this.setState({ refresh: {} });
      }
    );
  }

  async enableMicrophone() {
    RRCLoading.show();
    let code = await rtcEngine?.enableMicrophone(!this.state.microphone);
    if (code != 0) {
      RRCToast.show((this.state.microphone ? 'Stop' : 'Start') + ' Microphone Error: ' + code);
    } else {
      this.setState({ microphone: !this.state.microphone });
    }
    RRCLoading.hide();
  }

  async enableCamera() {
    RRCLoading.show();
    let code = await rtcEngine?.enableCamera(!this.state.camera, this.state.front ? 1 : 2);
    if (code != 0) {
      RRCToast.show((this.state.camera ? 'Stop' : 'Start') + ' Camera Error: ' + code);
      RRCLoading.hide();
    }
  }

  async publishAudio(audio: boolean) {
    RRCLoading.show();
    if (!audio) {
      let code = await rtcEngine?.publish(RCRTCMediaType.Audio);
      if (code != 0) {
        this.setState({ audio: false })
        RRCToast.show('Publish Audio Error: ' + code);
        RRCLoading.hide();
      }
    } else {
      let code = await rtcEngine?.unpublish(RCRTCMediaType.Audio);
      if (code != 0) {
        this.setState({ audio: true })
        RRCToast.show('Unpublish Audio Error: ' + code);
        RRCLoading.hide();
      }
    }
  }


  async publishVideo(video: boolean) {
    RRCLoading.show();
    if (!video) {
      let code = await rtcEngine?.publish(RCRTCMediaType.Video);
      if (code != 0) {
        this.setState({ video: false })
        RRCToast.show('Publish Video Error: ' + code);
        RRCLoading.hide();
      }
    } else {
      let code = await rtcEngine?.unpublish(RCRTCMediaType.Video);
      if (code != 0) {
        this.setState({ video: true })
        RRCToast.show('Unpublish Video Error: ' + code);
        RRCLoading.hide();
      }
    }
  }

  async switchCamera() {
    RRCLoading.show();
    let code = await rtcEngine?.switchCamera();
    if (code != 0) {
      RRCToast.show('Switch Camera Error: ' + code);
      RRCLoading.hide();
    }
  }

  async enableSpeaker() {
    RRCLoading.show();
    let code = await rtcEngine?.enableSpeaker(!this.state.speaker);
    if (code != 0) {
      RRCToast.show((this.state.speaker ? 'Stop' : 'Start') + ' Speaker Error: ' + code);
    } else {
      this.setState({ speaker: !this.state.speaker });
    }
    RRCLoading.hide();
  }

  async audioSubscribe(item: Util.User) {
    RRCLoading.show();

    let code = await rtcEngine?.subscribe(item.id, RCRTCMediaType.Audio, false);
    if (code != 0) {
      RRCToast.show('Subscribe Audio Error: ' + code);
      RRCLoading.hide();
    }
  }

  async audioUnSubscribe(item: Util.User) {
    RRCLoading.show();
    let code = await rtcEngine?.unsubscribe(item.id, RCRTCMediaType.Audio);
    if (code != 0) {
      RRCToast.show('Unsubscribe Audio Error: ' + code);
      RRCLoading.hide();
    }
  }


  async videoSubscribe(item: Util.User) {
    RRCLoading.show();
    let code = await rtcEngine?.subscribe(item.id, RCRTCMediaType.Video, item.subscribeTiny);
    if (code != 0) {
      RRCToast.show('Subscribe Video Error: ' + code);
      RRCLoading.hide();
    }
  }

  async videoUnSubscribe(item: Util.User) {
    RRCLoading.show();
    let code = await rtcEngine?.unsubscribe(item.id, RCRTCMediaType.Video);
    if (code != 0) {
      RRCToast.show('Unsubscribe Video Error: ' + code);
      RRCLoading.hide();
    }
  }

  getNetworkType(type: RCRTCNetworkType) {
    switch (type) {
      case RCRTCNetworkType.Mobile:
        return '4G'

      case RCRTCNetworkType.WiFi:
        return 'WiFi'

      default:
        return 'Unknown'
    }
  }

  componentWillUnmount() {
    if (this.isBeautyOpen) {
      Beauty.closeBeauty().then((value: number) => {})
    }
    Util.unInit();
    rtcEngine?.leaveRoom();
    rtcEngine?.setOnNetworkStatsListener()
    rtcEngine?.setOnLocalAudioStatsListener()
    rtcEngine?.setOnLocalVideoStatsListener()
    rtcEngine?.setOnRemoteAudioStatsListener()
    rtcEngine?.setOnRemoteVideoStatsListener()
    rtcEngine?.destroy();
  }


  setOptions() {
    this.props.navigation.setOptions({
      headerTitle: '会议号:' + this.props.route.params!.roomId,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            disabled={!this.state.video}
            style={{ backgroundColor: !this.state.video ? 'grey' : undefined }}
            onPress={() => {
              if (!this.isBeautyOpen)
                this.openBeauty()
              else
                this.closeBeauty()
            }}>
            <Image source={{ uri: 'beauty' }} style={{ width: 25, height: 25 }}></Image>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!this.state.audio}
            style={{ marginLeft: 10, backgroundColor: !this.state.audio ? 'grey' : undefined }}
            onPress={() => {
              this.props.navigation.navigate('SoundEffect', {})
            }}>
            <Image source={{ uri: 'music' }} style={{ width: 25, height: 25 }}></Image>

          </TouchableOpacity>

          <TouchableOpacity
            disabled={!this.state.audio}
            style={{ marginLeft: 10, backgroundColor: !this.state.audio ? 'grey' : undefined }}
            onPress={() => { this.props.navigation.navigate('SoundMixing', {}) }}>
            <Image source={{ uri: 'audio_mix' }} style={{ width: 25, height: 25 }}></Image>
          </TouchableOpacity>
        </View>
      ),
    });
  }

  componentDidMount() {
    this.setOptions();
  }
  openBeauty() {
    Beauty.openBeauty().then((value: number) => {
      if (value === 0) {
        this.isBeautyOpen = true
        RRCToast.show('美颜已打开')
      }
    })
  }

  closeBeauty() {
    Beauty.closeBeauty().then((value: number) => {
      if (value === 0) {
        this.isBeautyOpen = false
        RRCToast.show('美颜已关闭')
      }
    })
  }

  renderItem() {
    return Array.from(Util.users.values()).map((item, index) => {
      return (
        <View key={index} style={{ flexDirection: 'row', marginTop: 5 }}>
          <View style={{ width: '50%', height: 180, backgroundColor: 'black', overflow: 'hidden' }}>
            <RCReactNativeRtcView
              fitType={item.fitType}
              style={{ width: '100%', height: 180 }}
              ref={(ref) => {
                let id = item.id;
                let current = findNodeHandle(ref);
                let user = Util.users.get(id);
                if (current && user)
                  user.viewTag = current
              }}
              mirror={false}
            />
            <View style={{ position: 'absolute', width: '100%', height: 180 }}>
              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={{ color: 'red', }}>{item.id}</Text>
                <Picker
                  textStyle={{ color: 'red', textDecorationLine: 'underline' }}
                  items={Constants.viewFitType}
                  value={this.state.fitType}
                  onValueChange={(value) => {
                    item.fitType = value;
                    this.setState({ refresh: {} })
                  }}
                /></View>
              {
                item.videoPublished &&
                <Radio
                  style={{ alignSelf: 'center', marginBottom: 5 }}
                  textStyle={{ color: 'red' }}
                  items={[
                    { label: '订阅大流', value: 0 },
                    { label: '订阅小流', value: 1 },
                  ]}
                  value={item.subscribeTiny?1:0}
                  onSelect={(value: number) => {
                    item.subscribeTiny = (value === 1)
                    //如果已经订阅，重新订阅
                    if (item.videoSubscribed)
                      this.videoSubscribe(item)
                    this.setState({ refresh: {} })
                  }}
                />
              }
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <CheckBox
                disabled={!item.audioPublished}
                text={'订阅音频'}
                onValueChange={() => {
                  item.audioSubscribed ? this.audioUnSubscribe(item) : this.audioSubscribe(item)
                }}
                value={item.audioSubscribed} />
              <CheckBox
                disabled={!item.videoPublished}
                text={'订阅视频'}
                onValueChange={() => {
                  item.videoSubscribed ? this.videoUnSubscribe(item) : this.videoSubscribe(item)
                }}
                value={item.videoSubscribed} />
            </View>
            {/* 订阅表格 */}

            {
              item.remoteVideoStats && item.videoSubscribed &&
              <View style={{ marginTop: 5, padding: 5 }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ ...styles.formBorder, height: 20 }}>
                    <Text style={styles.formText}>视频码率:</Text>
                  </View>
                  <View style={{ ...styles.formBorder, height: 20, borderLeftWidth: 0 }}>
                    <Text style={styles.formText}>{item.remoteVideoStats!.bitrate}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ ...styles.formBorder, height: 20, borderTopWidth: 0 }}>
                    <Text style={styles.formText}>视频帧率:</Text>
                  </View>
                  <View style={{ ...styles.formBorder, height: 20, borderLeftWidth: 0, borderTopWidth: 0, }}>
                    <Text style={styles.formText}>{item.remoteVideoStats!.fps}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ ...styles.formBorder, height: 20, borderTopWidth: 0, }}>
                    <Text style={styles.formText}>视频分辨率:</Text>
                  </View>
                  <View style={{ ...styles.formBorder, height: 20, borderLeftWidth: 0, borderTopWidth: 0, }}>
                    <Text style={styles.formText}>{item.remoteVideoStats!.width}*{item.remoteVideoStats!.height}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ ...styles.formBorder, height: 20, borderTopWidth: 0, }}>
                    <Text style={styles.formText}>视频丢包率:</Text>
                  </View>
                  <View style={{ ...styles.formBorder, height: 20, borderLeftWidth: 0, borderTopWidth: 0, }}>
                    <Text style={styles.formText}>{item.remoteVideoStats!.packageLostRate}</Text>
                  </View>
                </View>
              </View>
            }

            {
              item.remoteAudioStats && item.audioSubscribed &&
              <View style={{ marginTop: 5, padding: 5 }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ ...styles.formBorder, height: 20, }}>
                    <Text style={styles.formText}>音频码率:</Text>
                  </View>
                  <View style={{ ...styles.formBorder, height: 20, borderLeftWidth: 0, }}>
                    <Text style={styles.formText}>{item.remoteAudioStats!.bitrate}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ ...styles.formBorder, height: 20, borderTopWidth: 0, }}>
                    <Text style={styles.formText}>视频丢包率:</Text>
                  </View>
                  <View style={{ ...styles.formBorder, height: 20, borderLeftWidth: 0, borderTopWidth: 0, }}>
                    <Text style={styles.formText}>{item.remoteAudioStats!.packageLostRate}</Text>
                  </View>
                </View>
              </View>
            }

          </View>
        </View>
      )
    })
  }

  render() {
    return (
      <ScrollView style={{ flex: 1 }} >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: '50%', height: 180, backgroundColor: 'black', overflow: 'hidden' }}>
            <RCReactNativeRtcView
              fitType={this.state.fitType}
              style={{ width: '100%', height: 180 }}
              ref={ref => this.localtag = findNodeHandle(ref)}
              mirror={this.state.mirror}
            />
            <View style={{ position: 'absolute', paddingLeft: 10, width: '100%', height: 180 }}>
              <Text style={{ color: 'red', }}>{this.props.route.params!.userId}</Text>
              <Picker
                textStyle={{ color: 'red', textDecorationLine: 'underline' }}
                items={Constants.viewFitType}
                value={this.state.fitType}
                onValueChange={(value) => {
                  this.setState({ fitType: value })
                }}
              />
            </View>
          </View>
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <CheckBox
                text={'采集音频'}
                onValueChange={() => { this.enableMicrophone() }}
                value={this.state.microphone} />
              <CheckBox
                style={{ marginLeft: 5 }}
                text={'采集视频'}
                onValueChange={() => { this.enableCamera() }}
                value={this.state.camera} />
            </View>
            <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'center' }}>
              <CheckBox
                text={'发布音频'}
                onValueChange={() => { this.publishAudio(this.state.audio) }}
                value={this.state.audio} />
              <CheckBox
                style={{ marginLeft: 5 }}
                text={'发布视频'}
                onValueChange={() => { this.publishVideo(this.state.video) }}
                value={this.state.video} />
            </View>
            <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'center' }}>
              <CheckBox
                text={'前置摄像'}
                onValueChange={() => { this.switchCamera() }}
                value={this.state.front} />

              <CheckBox
                style={{ marginLeft: 5 }}
                text={'本地镜像'}
                onValueChange={() => { this.setState({ mirror: !this.state.mirror }) }}
                value={this.state.mirror} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
              <Button title={this.state.speaker ? '扬声器' : '听筒'}
                onPress={() => { this.enableSpeaker() }} />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 5 }}>
              <Picker
                items={Constants.fps}
                value={this.state.videoConfig.fps}
                onValueChange={(value) => {
                  let videoConfig: RCRTCVideoConfig = {...this.state.videoConfig};
                  videoConfig.fps = value
                  this.setState({ videoConfig: videoConfig })
                  rtcEngine?.setVideoConfig(videoConfig, false);
                }}
              />

              <Picker
                style={{ marginLeft: 10 }}
                items={Constants.resolution}
                value={this.state.videoConfig.resolution}
                onValueChange={(value) => {
                  let videoConfig: RCRTCVideoConfig = {...this.state.videoConfig};
                  videoConfig.resolution = value
                  this.setState({ videoConfig: videoConfig })
                  rtcEngine?.setVideoConfig(videoConfig, false);
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 5 }}>
              <Text style={{ fontSize: 15 }}>码率下限:</Text>
              <Picker
                items={Constants.minVideoKbps}
                value={this.state.videoConfig.minBitrate}
                onValueChange={(value) => {
                  let videoConfig: RCRTCVideoConfig = {...this.state.videoConfig};
                  videoConfig.minBitrate = value
                  this.setState({ videoConfig: videoConfig })
                  rtcEngine?.setVideoConfig(videoConfig, false);
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 5 }}>
              <Text style={{ fontSize: 15 }}>码率上限:</Text>
              <Picker
                items={Constants.maxVideoKbps}
                value={this.state.videoConfig.maxBitrate}
                onValueChange={(value) => {
                  let videoConfig: RCRTCVideoConfig = {...this.state.videoConfig};
                  videoConfig.maxBitrate = value
                  this.setState({ videoConfig: videoConfig })
                  rtcEngine?.setVideoConfig(videoConfig, false);
                }}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row', margin: 5, padding: 5, borderWidth: 1, borderColor: 'lightblue', alignItems: 'center'
          }}>
          <Text style={{ fontSize: 15 }}>小流设置</Text>
          <View style={{ alignItems: 'center', marginLeft: 5 }}>
            <Picker
              items={Constants.resolution}
              value={this.state.tinyVideoConfig.resolution}
              onValueChange={(value) => {
                let videoConfig: RCRTCVideoConfig = {...this.state.tinyVideoConfig};
                videoConfig.resolution = value
                this.setState({ tinyVideoConfig: videoConfig })
                rtcEngine?.setVideoConfig(videoConfig, true);
              }}
            />

            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Text style={{ fontSize: 15 }}>下限:</Text>
              <Picker
                items={Constants.tinyMinVideoKbps}
                value={this.state.tinyVideoConfig.minBitrate}
                onValueChange={(value) => {
                  let videoConfig: RCRTCVideoConfig = {...this.state.tinyVideoConfig};
                  videoConfig.minBitrate = value
                  this.setState({ tinyVideoConfig: videoConfig })
                  rtcEngine?.setVideoConfig(videoConfig, true);
                }}
              />

              <Text style={{ fontSize: 15, marginLeft: 10 }}>上限:</Text>
              <Picker
                items={Constants.tinyMaxVideoKbps}
                value={this.state.tinyVideoConfig.maxBitrate}
                onValueChange={(value) => {
                  let videoConfig: RCRTCVideoConfig = {...this.state.tinyVideoConfig};
                  videoConfig.maxBitrate = value
                  this.setState({ tinyVideoConfig: videoConfig })
                  rtcEngine?.setVideoConfig(videoConfig, true);
                }}
              />
            </View>
          </View>
        </View>

        {/* 网络状态表格 */}
        <View style={{ marginLeft: 5, marginRight: 5 }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ ...styles.formBorder }}>
              <Text style={styles.formText}>网络类型:</Text>
              <Text style={styles.formText}>{this.getNetworkType(this.state.networkStats.type)}</Text>
            </View>
            <View style={{ ...styles.formBorder, alignItems: 'flex-start', borderLeftWidth: 0 }}>
              <Text style={styles.formText}>IP:{this.state.networkStats.ip}</Text>
            </View>
            <View style={{ ...styles.formBorder, borderLeftWidth: 0 }} />
            <View style={{ ...styles.formBorder, borderLeftWidth: 0, }} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ ...styles.formBorder, borderTopWidth: 0 }}>
              <Text style={styles.formText}>上行</Text>
              <Text style={styles.formText}>{this.state.networkStats.sendBitrate}</Text>
            </View>
            <View style={{ ...styles.formBorder, borderLeftWidth: 0, borderTopWidth: 0, }}>
              <Text style={styles.formText}>下行</Text>
              <Text style={styles.formText}>{this.state.networkStats.receiveBitrate}</Text>
            </View>
            <View style={{ ...styles.formBorder, borderLeftWidth: 0, borderTopWidth: 0, }}>
              <Text style={styles.formText}>往返</Text>
              <Text style={styles.formText}>{this.state.networkStats.rtt}</Text>
            </View>
            <View style={{ ...styles.formBorder, borderLeftWidth: 0, borderTopWidth: 0 }} />
          </View>
          {
            this.state.localAudioStats && this.state.audio &&
            <View style={{ flexDirection: 'row' }}>
              <View style={{ ...styles.formBorder, borderTopWidth: 0 }}>
                <Text style={styles.formText}>音频</Text>
                <Text style={styles.formText}>{this.state.localAudioStats.bitrate}</Text>
              </View>
              <View style={{ ...styles.formBorder, borderLeftWidth: 0, borderTopWidth: 0 }} />
              <View style={{ ...styles.formBorder, borderLeftWidth: 0, borderTopWidth: 0 }} />
              <View style={{ ...styles.formBorder, borderLeftWidth: 0, borderTopWidth: 0 }}>
                <Text style={styles.formText}>丢包率</Text>
                <Text style={styles.formText}>{this.state.localAudioStats.packageLostRate}</Text>
              </View>
            </View>
          }
          {
            this.state.localVideoStats && this.state.video &&
            <View style={{ flexDirection: 'row' }}>
              <View style={{ ...styles.formBorder, borderTopWidth: 0 }}>
                <Text style={styles.formText}>大流</Text>
                <Text style={styles.formText}>{this.state.localVideoStats.bitrate}</Text>
              </View>
              <View style={{ ...styles.formBorder, borderLeftWidth: 0, borderTopWidth: 0 }}>
                <Text style={styles.formText}>分辨率</Text>
                <Text style={styles.formText}>{this.state.localVideoStats.width}*{this.state.localVideoStats.height}</Text>
              </View>
              <View style={{ ...styles.formBorder, borderLeftWidth: 0, borderTopWidth: 0 }}>
                <Text style={styles.formText}>fps</Text>
                <Text style={styles.formText}>{this.state.localVideoStats.fps}</Text>
              </View>
              <View style={{ ...styles.formBorder, borderLeftWidth: 0, borderTopWidth: 0 }}>
                <Text style={styles.formText}>丢包率</Text>
                <Text style={styles.formText}>{this.state.localVideoStats.packageLostRate}</Text>
              </View>
            </View>
          }
          {
            this.state.localTinyVideoStats && this.state.video &&
            <View style={{ flexDirection: 'row' }}>
              <View style={{ ...styles.formBorder, borderTopWidth: 0 }}>
                <Text style={styles.formText}>小流</Text>
                <Text style={styles.formText}>{this.state.localTinyVideoStats.bitrate}</Text>
              </View>
              <View style={{ ...styles.formBorder, borderLeftWidth: 0, borderTopWidth: 0 }}>
                <Text style={styles.formText}>分辨率</Text>
                <Text style={styles.formText}>{this.state.localTinyVideoStats.width}*{this.state.localTinyVideoStats.height}</Text>
              </View>
              <View style={{ ...styles.formBorder, borderLeftWidth: 0, borderTopWidth: 0 }}>
                <Text style={styles.formText}>fps</Text>
                <Text style={styles.formText}>{this.state.localTinyVideoStats.fps}</Text>
              </View>
              <View style={{ ...styles.formBorder, borderLeftWidth: 0, borderTopWidth: 0 }}>
                <Text style={styles.formText}>丢包率</Text>
                <Text style={styles.formText}>{this.state.localTinyVideoStats.packageLostRate}</Text>
              </View>
            </View>
          }
        </View>

        {
          this.renderItem()
        }

      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
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

export default MeetingScreen;
