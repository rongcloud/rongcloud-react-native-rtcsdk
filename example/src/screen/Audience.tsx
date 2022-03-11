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
  RCRTCEngine,
  RCReactNativeRtcView,
  RCRTCMediaType,
  RCRTCRole,
  RCRTCRemoteAudioStats,
  RCRTCRemoteVideoStats,
  RCRTCViewFitType,
} from '@rongcloud/react-native-rtc'

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import CheckBox from '../component/CheckBox';
import Radio from '../component/Radio';
import Picker from '../component/Picker';
import * as Constants from '../constants'
interface AudienceScreenProps extends NativeStackScreenProps<any> {

}

interface AudienceScreenStates {
  media: RCRTCMediaType,
  tiny: boolean,
  speaker: boolean,
  subscribed: boolean,
  silenceAudio: boolean
  silenceVideo: boolean,
  videoStats: RCRTCRemoteVideoStats | null,
  audioStats: RCRTCRemoteAudioStats | null,
  fitType: RCRTCViewFitType,
}

class AudienceScreen extends React.Component<AudienceScreenProps, AudienceScreenStates> {
  localtag: number | null;
  constructor(props: AudienceScreenProps) {
    super(props);

    this.state = {
      media: RCRTCMediaType.AudioVideo,
      tiny: false,
      speaker: false,
      subscribed: false,
      silenceAudio: false,
      silenceVideo: false,
      videoStats: null,
      audioStats: null,
      fitType: RCRTCViewFitType.Center,
    };

    this.localtag = null;
    RCRTCEngine.enableSpeaker(this.state.speaker)
    RCRTCEngine.setOnLiveMixSubscribedListener((type: RCRTCMediaType, code: number, message: string) => {
      if (code != 0) {
        RRCToast.show('Subscribe Live Mix Error: ' + code + ', message: ' + message);
      } else {
        if (type != RCRTCMediaType.Audio)
          RCRTCEngine.setLiveMixView(this.localtag!);
        this.setState({ subscribed: true });
      }
      RRCLoading.hide();
    })

    RCRTCEngine.setOnLiveMixUnsubscribedListener((type: RCRTCMediaType, code: number, message: string) => {
      if (code != 0) {
        RRCToast.show('Unsubscribe Live Mix Error: ' + code + ', message: ' + message);
      } else {
        if (type != RCRTCMediaType.Audio)
          RCRTCEngine.removeLiveMixView();
        this.setState({ subscribed: false });
      }
      RRCLoading.hide();
    })

    RCRTCEngine.setOnLiveMixAudioStatsListener((stats: RCRTCRemoteAudioStats) => {
      this.setState({ audioStats: stats })
    })

    RCRTCEngine.setOnLiveMixVideoStatsListener((stats: RCRTCRemoteVideoStats) => {
      this.setState({ videoStats: stats })
    })
  }

  setOptions() {
    this.props.navigation.setOptions({
      headerTitle: '观看直播:' + this.props.route.params!.roomId,
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => {
              this.props.navigation.navigate('Message', {
                userId: this.props.route.params!.userId,
                roomId: this.props.route.params!.roomId,
                role: RCRTCRole.LiveAudience
              })
            }}>
            <Image source={{ uri: 'message' }} style={{ width: 25, height: 25 }}></Image>
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

    RCRTCEngine.leaveRoom();
    RCRTCEngine.unInit();

    RCRTCEngine.setOnRemoteAudioStatsListener()
    RCRTCEngine.setOnRemoteVideoStatsListener()
  }


  async subscribeLiveMix() {
    RRCLoading.show();
    let code = await RCRTCEngine.subscribeLiveMix(this.state.media, this.state.tiny);
    if (code != 0) {
      RRCToast.show('Subscribe Live Mix Error: ' + code);
      RRCLoading.hide();
    }
  }

  async unsubscribeLiveMix() {
    RRCLoading.show();
    let code = await RCRTCEngine.unsubscribeLiveMix(RCRTCMediaType.AudioVideo);
    if (code != 0) {
      RRCToast.show('Unsubscribe Live Mix Error: ' + code);
      RRCLoading.hide();
    }
  }
  async enableSpeaker() {
    RRCLoading.show();
    let code = await RCRTCEngine.enableSpeaker(!this.state.speaker);
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

        {this.state.media != RCRTCMediaType.Audio &&
          <CheckBox
            style={{ alignSelf: 'center', marginTop: 10 }}
            text={'订阅小流'}
            onValueChange={() => { this.setState({ tiny: !this.state.tiny }) }}
            value={this.state.tiny} />
        }
        <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
          <Button title={this.state.subscribed ? '取消订阅' : '订阅'} onPress={() => {
            !this.state.subscribed ? this.subscribeLiveMix() : this.unsubscribeLiveMix()
          }} />
        </View>

        <View style={{ height: 300, backgroundColor: 'black', overflow: 'hidden', marginTop: 10 }}>
          <RCReactNativeRtcView
            fitType={this.state.fitType}
            style={{ width: '100%', height: 300 }}
            ref={ref => {
              this.localtag = findNodeHandle(ref);
            }}
            mirror={false}
          />
          <View style={{ position: 'absolute', width: '100%', height: 300, padding: 10 }}>
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

        <View style={{ flexDirection: 'row', marginTop: 10, justifyContent: 'center' }}>
          <CheckBox
            text={'静音音频'}
            onValueChange={() => {
              const silenceAudio = !this.state.silenceAudio
              this.setState({ silenceAudio: silenceAudio })
              RCRTCEngine.muteLiveMixStream(RCRTCMediaType.Audio, silenceAudio)
            }}
            value={this.state.silenceAudio} />

          <CheckBox
            style={{ marginLeft: 100 }}
            text={'静音视频'}
            onValueChange={() => {
              const silenceVideo = !this.state.silenceVideo
              this.setState({ silenceVideo: silenceVideo })
              RCRTCEngine.muteLiveMixStream(RCRTCMediaType.Video, silenceVideo)
            }}
            value={this.state.silenceVideo} />
        </View>
        <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
          <Button title={this.state.speaker ? '扬声器' : '听筒'} onPress={() => {
            this.enableSpeaker()
          }} />
        </View>


        {/* 订阅表格 */}
        {
          this.state.subscribed && this.state.audioStats &&
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
          this.state.subscribed && this.state.videoStats &&
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
  }
})
export default AudienceScreen;
