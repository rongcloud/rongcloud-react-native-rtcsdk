import React from 'react';
import * as Util from '../util';
import {
  View,
  TouchableOpacity,
  findNodeHandle,
  Button,
  Image,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import {
  RRCToast,
  RRCLoading,
} from 'react-native-overlayer';
import {
  RCReactNativeRtcView,
  RCRTCMediaType,
  RCRTCRole,
  RCRTCRemoteAudioStats,
  RCRTCRemoteVideoStats,
  RCRTCViewFitType,
  RCRTCVideoConfig,
  RCRTCVideoFps,
  RCRTCVideoResolution,
} from '@rongcloud/react-native-rtc'

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import CheckBox from '../component/CheckBox';
import Radio from '../component/Radio';
import Picker from '../component/Picker';
import * as Constants from '../constants'
import { rtcEngine } from './Connect';

interface AudienceScreenProps extends NativeStackScreenProps<any> {

}

interface AudienceScreenStates {
  media: RCRTCMediaType,
  tiny: boolean,
  speaker: boolean,
  silenceAudio: boolean
  silenceVideo: boolean,
  videoStats: RCRTCRemoteVideoStats | null,
  audioStats: RCRTCRemoteAudioStats | null,
  fitType: RCRTCViewFitType,
  cdnFitType: RCRTCViewFitType,
  isSubscribeMix: boolean,
  isSubscribeCdn: boolean,
  videoConfig: RCRTCVideoConfig,
  audienceReceivedSei: string;
  muteCdn: boolean;
}

const defaultVideoConfig = {
  minBitrate: 500,
  maxBitrate: 2200,
  fps: RCRTCVideoFps.FPS_24,
  resolution: RCRTCVideoResolution.Resolution_720x1280,
}

class AudienceScreen extends React.Component<AudienceScreenProps, AudienceScreenStates> {
  mixLocaltag: number | null;
  rcLocaltag: number | null;
  constructor(props: AudienceScreenProps) {
    super(props);

    this.state = {
      media: RCRTCMediaType.AudioVideo,
      tiny: false,
      speaker: false,
      silenceAudio: false,
      silenceVideo: false,
      videoStats: null,
      audioStats: null,
      fitType: RCRTCViewFitType.Center,
      cdnFitType: RCRTCViewFitType.Center,
      isSubscribeMix: false,
      isSubscribeCdn: false,
      videoConfig: defaultVideoConfig,
      audienceReceivedSei: '',
      muteCdn: false
    };

    this.mixLocaltag = null;
    this.rcLocaltag = null;

    // 合流
    rtcEngine?.enableSpeaker(this.state.speaker)
    rtcEngine?.setOnLiveMixSubscribedListener((type: RCRTCMediaType, code: number, message: string) => {
      if (code != 0) {
        RRCToast.show('Subscribe Live Mix Error: ' + code + ', message: ' + message);
      } else {
        if (type != RCRTCMediaType.Audio)
        rtcEngine?.setLiveMixView(this.mixLocaltag!);
        this.setState({ isSubscribeMix: true });
      }
      RRCLoading.hide();
    })
    rtcEngine?.setOnLiveMixUnsubscribedListener((type: RCRTCMediaType, code: number, message: string) => {
      if (code != 0) {
        RRCToast.show('Unsubscribe Live Mix Error: ' + code + ', message: ' + message);
      } else {
        if (type != RCRTCMediaType.Audio)
        rtcEngine?.removeLiveMixView();
        this.setState({ isSubscribeMix: false });
      }
      RRCLoading.hide();
    })
    rtcEngine?.setOnLiveMixAudioStatsListener((stats: RCRTCRemoteAudioStats) => {
      this.setState({ audioStats: stats })
    })
    rtcEngine?.setOnLiveMixVideoStatsListener((stats: RCRTCRemoteVideoStats) => {
      this.setState({ videoStats: stats })
    })

    // 融云 CDN 流
    rtcEngine?.setOnLiveMixInnerCdnStreamSubscribedListener((code: number, message: string) => {
      if (code != 0) {
        RRCToast.show('Subscribe Live Mix Inner Cdn Error: ' + code + ', message: ' + message);
      } else {
        this.setState({ isSubscribeCdn: true});
      }
      RRCLoading.hide();
    })
    rtcEngine?.setOnLiveMixInnerCdnStreamUnsubscribedListener((code: number, message: string) => {
      if (code != 0) {
        RRCToast.show('Unsubscribe Live Mix Inner Cdn Error: ' + code + ', message: ' + message);
      } else {
        rtcEngine?.removeLiveMixInnerCdnStreamView();
        this.setState({ isSubscribeCdn: false });
      }
      RRCLoading.hide();
    })

    // 观众收到合流 SEI 信息回调
    rtcEngine?.setOnLiveMixSeiReceivedListener((sei: string) => {
      this.setState({audienceReceivedSei: 'sei:' + sei})
      console.log('setOnLiveMixSeiReceivedListener', sei);
    })
  }

  setOptions() {
    this.props.navigation.setOptions({
      headerTitle: '观看直播:' + this.props.route.params!.roomId,
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ paddingVertical: 10, justifyContent: 'center' }}
            onPress={() => {
              rtcEngine?.setOnLiveRoleSwitchedListener((current: RCRTCRole, code: number, message: string) => {
                if (code != 0) {
                  RRCToast.show('切换为主播失败, code:', code, 'message:', message);
                } else {
                  if (this.props.route.params!.switchRoleCallback) {
                    this.props.route.params!.switchRoleCallback(RCRTCRole.LiveBroadcaster);
                  }
                  this.props.navigation.goBack()
                }
              })
              rtcEngine?.switchLiveRole(RCRTCRole.LiveBroadcaster);
            }}>
            <Text style={{alignSelf: 'center'}}>{'切换主播'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => {
              this.props.navigation.navigate('Message', {
                userId: this.props.route.params!.userId,
                roomId: this.props.route.params!.roomId,
                role: RCRTCRole.LiveAudience
              })
            }}>
            <Image source={{ uri: 'rong_icon_message' }} style={{ width: 20, height: 20 }}></Image>
          </TouchableOpacity>
        </View>
      ),
    });
  }

  componentDidMount() {
    this.setOptions();
  }


  componentWillUnmount() {
    Util.unInit();

    rtcEngine?.leaveRoom();
    rtcEngine?.destroy();

    rtcEngine?.setOnRemoteAudioStatsListener()
    rtcEngine?.setOnRemoteVideoStatsListener()
  }


  async subscribeLiveMix() {
    RRCLoading.show();
    let code = await rtcEngine?.subscribeLiveMix(this.state.media, this.state.tiny);
    if (code != 0) {
      RRCToast.show('Subscribe Live Mix Error: ' + code);
      RRCLoading.hide();
    }
  }

  async unsubscribeLiveMix() {
    RRCLoading.show();
    let code = await rtcEngine?.unsubscribeLiveMix(RCRTCMediaType.AudioVideo);
    if (code != 0) {
      RRCToast.show('Unsubscribe Live Mix Error: ' + code);
    }
    RRCLoading.hide();
  }

  async subscribeLiveMixInnerCdnStream() {
    RRCLoading.show();
    let code = await rtcEngine?.subscribeLiveMixInnerCdnStream();
    if (code != 0) {
      RRCToast.show('Subscribe Live Mix Error: ' + code);
      RRCLoading.hide();
    }
    rtcEngine?.setLiveMixInnerCdnStreamView(this.rcLocaltag!);
  }

  async unsubscribeLiveMixInnerCdnStream() {
    RRCLoading.show();
    let code = await rtcEngine?.unsubscribeLiveMixInnerCdnStream();
    if (code != 0) {
      RRCToast.show('Unsubscribe Live Mix Error: ' + code);
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

  render() {
    return (
      <ScrollView>
        <View style={styles.commonStreamView}>
          <View style={styles.commonStreamLeftView}>
            <RCReactNativeRtcView
              fitType={this.state.fitType}
              style={{ flex: 1 }}
              ref={ref => {
                this.mixLocaltag = findNodeHandle(ref);
              }}
              mirror={false}
            />
            <Picker
              style={{ position: 'absolute', right: 5, top: 5 }}
              textStyle={{ color: 'red', textDecorationLine: 'underline' }}
              items={Constants.viewFitType}
              value={this.state.fitType}
              onValueChange={(value) => {
                this.setState({ fitType: value })
              }}
            />
          </View>
          <View style={styles.commonStreamRightView}>
            <Text style={[styles.commonText, { textAlign: 'center', marginTop: 16, fontSize: 18, fontWeight: '600' }]}>{'合流'}</Text>
            <Radio
              style={{ marginTop: 10 }}
              items={[
                { label: '音频', value: RCRTCMediaType.Audio },
                { label: '视频', value: RCRTCMediaType.Video },
                { label: '音视频', value: RCRTCMediaType.AudioVideo },
              ]}
              value={this.state.media}
              onSelect={(value) => this.setState({ media: value })}
            />
            <View style={{ flexDirection: 'row', alignSelf: 'center', padding: 16 }}>
              {this.state.media != RCRTCMediaType.Audio &&
                <CheckBox
                  style={{ alignSelf: 'center', height: 30, flex: 1 }}
                  text={'订阅小流'}
                  onValueChange={() => { this.setState({ tiny: !this.state.tiny }) }}
                  value={this.state.tiny} />
              }
              <TouchableOpacity
                style={{ height: 30, justifyContent: 'center', flex: 1, borderWidth: 0.5, borderColor: 'black', borderRadius: 5 }}
                onPress={() => {
                  if (this.state.isSubscribeMix === false) {
                    this.subscribeLiveMix()
                  } else {
                    this.unsubscribeLiveMix()
                  }
                }}
              >
                <Text style={[styles.commonText, { textAlign: 'center' }]}>{this.state.isSubscribeMix === true ? '取消订阅' : '订阅'}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
              <CheckBox
                text={'静音音频'}
                onValueChange={() => {
                  const silenceAudio = !this.state.silenceAudio
                  this.setState({ silenceAudio: silenceAudio })
                  rtcEngine?.muteLiveMixStream(RCRTCMediaType.Audio, silenceAudio)
                }}
                value={this.state.silenceAudio} />
              <CheckBox
                style={{ marginLeft: 6 }}
                text={'静音视频'}
                onValueChange={() => {
                  const silenceVideo = !this.state.silenceVideo
                  this.setState({ silenceVideo: silenceVideo })
                  rtcEngine?.muteLiveMixStream(RCRTCMediaType.Video, silenceVideo)
                }}
                value={this.state.silenceVideo} />
            </View>
            <View style={{ flex: 1 }}></View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity
                style={{  paddingVertical: 6, borderWidth: 0.5, borderColor: 'black', borderRadius: 5, marginBottom: 8, marginTop: 16, flex: 1, marginLeft: 16, marginRight: 8 }}
                onPress={() => {
                  this.enableSpeaker()
                }}
              >
                <Text style={{alignSelf: 'center'}}>{this.state.speaker ? '切换听筒' : '切换扬声器'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{  paddingVertical: 6, borderWidth: 0.5, borderColor: 'black', borderRadius: 5, marginBottom: 8, marginTop: 16, flex: 1, marginRight: 16, marginLeft: 8 }}
                onPress={() => {
                  rtcEngine?.removeLiveMixView();
                  this.setState({ isSubscribeMix: false });
                  RRCToast.show('重置成功')
                }}
              >
                <Text style={{alignSelf: 'center'}}>{'重置视图'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={[styles.commonStreamView, { marginTop: 10 }]}>
          <View style={styles.commonStreamLeftView}>
            <RCReactNativeRtcView
              fitType={this.state.cdnFitType}
              style={{ flex: 1 }}
              ref={ref => {
                this.rcLocaltag = findNodeHandle(ref);
              }}
              mirror={false}
            />
            <Picker
              style={{ position: 'absolute', right: 5, top: 5 }}
              textStyle={{ color: 'red', textDecorationLine: 'underline' }}
              items={Constants.viewFitType}
              value={this.state.cdnFitType}
              onValueChange={(value) => {
                this.setState({ cdnFitType: value })
              }}
            />
          </View>
          <View style={styles.commonStreamRightView}>
            <Text style={[styles.commonText, { textAlign: 'center', marginTop: 16, fontSize: 18, fontWeight: '600' }]}>{'融云CDN流'}</Text>
            <TouchableOpacity
              style={{ height: 30, justifyContent: 'center', borderWidth: 0.5, borderColor: 'black', borderRadius: 5, marginHorizontal: 30, marginTop: 16 }}
              onPress={() => {
                if (this.state.isSubscribeCdn === false) {
                  this.subscribeLiveMixInnerCdnStream()
                } else {
                  this.unsubscribeLiveMixInnerCdnStream()
                }
              }}
            >
              <Text style={[styles.commonText, { textAlign: 'center' }]}>{this.state.isSubscribeCdn === true ? '取消订阅' : '订阅'}</Text>
            </TouchableOpacity>
            <CheckBox
              style={{ marginTop: 16, marginLeft: 16 }}
              text={'静音视频'}
              onValueChange={() => {
                rtcEngine?.muteLiveMixInnerCdnStream(!this.state.muteCdn)
                this.setState({ muteCdn: !this.state.muteCdn })
              }}
              value={this.state.muteCdn} 
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 }}>
              <Picker
                style={{ alignSelf: 'flex-end', marginTop: 5 }}
                textStyle={{ color: '#000000' }}
                items={Constants.fps}
                value={this.state.videoConfig.fps}
                onValueChange={(value) => {
                  let videoConfig = { ...this.state.videoConfig };
                  videoConfig.fps = value
                  rtcEngine?.setOnLocalLiveMixInnerCdnVideoFpsSetListener(() => {
                    this.setState({ videoConfig: videoConfig })
                  });
                  rtcEngine?.setLocalLiveMixInnerCdnVideoFps(videoConfig.fps);
                }}
              />
              <Picker
                style={{ alignSelf: 'flex-end', marginTop: 5 }}
                textStyle={{ color: '#000000' }}
                items={Constants.resolution}
                value={this.state.videoConfig.resolution}
                onValueChange={(value) => {
                  let videoConfig = { ...this.state.videoConfig };
                  videoConfig.resolution = value
                  rtcEngine?.setOnLocalLiveMixInnerCdnVideoResolutionSetListener(() => {
                    this.setState({ videoConfig: videoConfig })
                  });
                  rtcEngine?.setLocalLiveMixInnerCdnVideoResolution(Constants.resolution[value].width, Constants.resolution[value].height);
                }}
              />
            </View>
          </View>
        </View>

        {/* 订阅表格 */}
        {
          this.state.isSubscribeMix === true && this.state.audioStats &&
          <View style={{ marginTop: 5, padding: 5 }}>
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              <View style={{ ...styles.formBorder, height: 20, }}>
                <Text style={styles.formText}>音频码率:</Text>
              </View>
              <View style={{ ...styles.formBorder, height: 20, borderLeftWidth: 0, }}>
                <Text style={styles.formText}>{this.state.audioStats.bitrate}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ ...styles.formBorder, height: 20, borderTopWidth: 0, }}>
                <Text style={styles.formText}>视频丢包率:</Text>
              </View>
              <View style={{ ...styles.formBorder, height: 20, borderLeftWidth: 0, borderTopWidth: 0, }}>
                <Text style={styles.formText}>{this.state.audioStats.packageLostRate}</Text>
              </View>
            </View>
          </View>
        }
        {
          this.state.isSubscribeMix === true && this.state.videoStats &&
          <View style={{ marginTop: 5, padding: 5 }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ ...styles.formBorder, height: 20 }}>
                <Text style={styles.formText}>视频码率:</Text>
              </View>
              <View style={{ ...styles.formBorder, height: 20, borderLeftWidth: 0 }}>
                <Text style={styles.formText}>{this.state.videoStats.bitrate}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ ...styles.formBorder, height: 20, borderTopWidth: 0 }}>
                <Text style={styles.formText}>视频帧率:</Text>
              </View>
              <View style={{ ...styles.formBorder, height: 20, borderLeftWidth: 0, borderTopWidth: 0, }}>
                <Text style={styles.formText}>{this.state.videoStats.fps}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ ...styles.formBorder, height: 20, borderTopWidth: 0, }}>
                <Text style={styles.formText}>视频分辨率:</Text>
              </View>
              <View style={{ ...styles.formBorder, height: 20, borderLeftWidth: 0, borderTopWidth: 0, }}>
                <Text style={styles.formText}>{this.state.videoStats.width}*{this.state.videoStats.height}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ ...styles.formBorder, height: 20, borderTopWidth: 0, }}>
                <Text style={styles.formText}>视频丢包率:</Text>
              </View>
              <View style={{ ...styles.formBorder, height: 20, borderLeftWidth: 0, borderTopWidth: 0, }}>
                <Text style={styles.formText}>{this.state.videoStats.packageLostRate}</Text>
              </View>
            </View>
          </View>
        }
        {this.state.audienceReceivedSei?.length > 0 &&
          <View style={[styles.tipView, {marginTop: 16}]}>
            <Text style={styles.tipTitle}>{'观众收到合流 SEI 信息回调'}</Text>
            <Text style={styles.tipDesc}>{this.state.audienceReceivedSei}</Text>
          </View>
        }
      </ScrollView >
    );
  }
}
const styles = StyleSheet.create({
  formBorder: {
    borderWidth: 1,
    borderColor: 'lightblue',
    alignItems: 'center',
    height: 35,
    flex: 1
  },
  formText: {
    fontSize: 12
  },
  commonStreamView: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10
  },
  commonStreamLeftView: {
    width: 160,
    height: 200,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center'
  },
  commonStreamRightView: {
    flex: 1
  },
  commonText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000000'
  },
  tipView: {
    paddingVertical: 8,
    marginHorizontal: 16
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
export default AudienceScreen;
