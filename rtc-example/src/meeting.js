
import React from 'react';

import * as Config from './config';
import * as Util from './util';
import * as UI from './ui';
import * as Constants from './constants'

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
  findNodeHandle,
} from 'react-native';

import {
  RRCToast,
  RRCLoading,
} from 'react-native-overlayer';

import CheckBox from '@react-native-community/checkbox';

import Icon from 'react-native-vector-icons/dist/FontAwesome';

import RNPickerSelect from 'react-native-picker-select';

import {
  NavigationContainer
} from '@react-navigation/native';

import {
  RCReactNativeRtc,
  RCReactNativeRtcView,
  RCReactNativeRtcEventEmitter
} from 'rc-react-native-rtc'

class MeetingScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      local: null,
      remotes: [],
      microphone: false,
      camera: false,
      audio: false,
      video: false,
      speaker: false,
      front: true,
      mirror: true,
      videoFpsPopUp: false,
      videoResolutionPopUp: false,
      videoMinBitratePopUp: false,
      videoMaxBitratePopUp: false,
      tinyVideoResolutionPopUp: false,
      tinyVideoMinBitratePopUp: false,
      tinyVideoMaxBitratePopUp: false,
      videoConfig: {
        minBitrate: 200,
        maxBitrate: 1200,
        fps: 2,
        resolution: 15,
      },
      tinyVideoConfig: {
        minBitrate: 100,
        maxBitrate: 500,
        resolution: 6,
      },
    };

    // RRCLoading.hide();

    RCReactNativeRtcEventEmitter.addListener('Engine:OnEnableCamera', (event) => {
      let enable = event.enable;
      let code = event.code;
      let message = event.message;
      if (enable) {
        RCReactNativeRtc.setLocalView(this.state.local);
      } else {
        RCReactNativeRtc.removeLocalView();
      }
      this.setState({ camera: enable });
      if (code != 0) {
        RRCToast.show((enable ? 'Stop' : 'Start') + ' Camera Error: ' + code + ', message: ' + message);
      }
      RRCLoading.hide();
    });

    RCReactNativeRtcEventEmitter.addListener('Engine:OnPublished', (event) => {
      let type = event.type;
      let code = event.code;
      let message = event.message;
      switch (type) {
        case 0:
          this.setState({ audio: code == 0 });
          break;
        case 1:
          this.setState({ video: code == 0 });
          break;
        default:
          this.setState({ audio: code == 0 });
          this.setState({ video: code == 0 });
          break;
      }
      if (code != 0) RRCToast.show('Publish ' + (media[type]) + ' Error: ' + code + ', message: ' + message);
      RRCLoading.hide();
    });

    RCReactNativeRtcEventEmitter.addListener('Engine:OnUnpublished', (event) => {
      let type = event.type;
      let code = event.code;
      let message = event.message;
      switch (type) {
        case 0:
          this.setState({ audio: code != 0 });
          break;
        case 1:
          this.setState({ video: code != 0 });
          break;
        default:
          this.setState({ audio: code != 0 });
          this.setState({ video: code != 0 });
          break;
      }
      if (code != 0) RRCToast.show('Publish ' + (media[type]) + ' Error: ' + code + ', message: ' + message);
      RRCLoading.hide();
    });

    RCReactNativeRtcEventEmitter.addListener('Engine:OnSwitchCamera', (event) => {
      let camera = event.camera;
      let code = event.code;
      let message = event.message;
      this.setState({ front: camera == 1 });
      if (code != 0) {
        RRCToast.show('Switch Camera Error: ' + code + ', message: ' + message);
      }
      RRCLoading.hide();
    });

    RCReactNativeRtc.enableMicrophone(this.state.microphone);

    this.props.navigation.setOptions({
      headerTitle: '会议号:' + this.props.route.params.room,
      headerRight: () => (
        <View style={UI.styles.row}>
          <Icon.Button
            name="bullhorn"
            backgroundColor='transparent'
            underlayColor={this.state.audio || this.state.video ? 'lightblue' : 'transparent'}
            color={this.state.audio || this.state.video ? 'blue' : 'gray'}
            iconStyle={{ marginRight: 0 }}
            onPress={() => {
              // TODO 音效
            }}
          />
          <Icon.Button
            name="music"
            backgroundColor='transparent'
            underlayColor={this.state.audio || this.state.video ? 'lightblue' : 'transparent'}
            color={this.state.audio || this.state.video ? 'blue' : 'gray'}
            iconStyle={{ marginRight: 0 }}
            onPress={() => {
              // TODO 混音
            }}
          />
        </View>
      ),
    });
  }

  componentWillUnmount() {
    // TODO 暂时屏蔽
    // RCReactNativeRtc.leaveRoom();
    // RCReactNativeRtc.unInit();
  }

  render() {
    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row' }}>
          <RCReactNativeRtcView
            style={{
              width: '50%', height: 210, backgroundColor: 'black'
            }}
            ref={ref => {
              this.state.local = findNodeHandle(ref);
            }}
            mirror={this.state.mirror}
          />
          <View style={UI.styles.column}>
            <View style={UI.styles.row}>
              <TouchableOpacity
                onPress={async () => {
                  RRCLoading.show();
                  let code = await RCReactNativeRtc.enableMicrophone(!this.state.microphone);
                  if (code != 0) {
                    RRCToast.show((this.state.microphone ? 'Stop' : 'Start') + ' Microphone Error: ' + code);
                  } else {
                    this.setState({ microphone: !this.state.microphone });
                  }
                  RRCLoading.hide();
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckBox
                    style={{ width: 15, height: 15 }}
                    disabled={true}
                    value={this.state.microphone}
                  />
                  <View style={{ width: 2 }} />
                  <Text style={UI.styles.text, { fontSize: 15 }}>采集音频</Text>
                </View>
              </TouchableOpacity>
              <View style={{ width: 10 }} />
              <TouchableOpacity
                onPress={async () => {
                  RRCLoading.show();
                  let code = await RCReactNativeRtc.enableCamera(!this.state.camera, this.state.front ? 1 : 2);
                  if (code != 0) {
                    RRCToast.show((this.state.camera ? 'Stop' : 'Start') + ' Camera Error: ' + code);
                    RRCLoading.hide();
                  }
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckBox
                    style={{ width: 15, height: 15 }}
                    disabled={true}
                    value={this.state.camera}
                  />
                  <View style={{ width: 2 }} />
                  <Text style={UI.styles.text, { fontSize: 15 }}>采集视频</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ height: 10 }} />
            <View style={UI.styles.row}>
              <TouchableOpacity
                onPress={async () => {
                  RRCLoading.show();
                  if (!this.state.audio) {
                    let code = await RCReactNativeRtc.publish(0);
                    if (code != 0) {
                      this.state.audio = false;
                      RRCToast.show('Publish Audio Error: ' + code);
                      RRCLoading.hide();
                    }
                  } else {
                    let code = await RCReactNativeRtc.unpublish(0);
                    if (code != 0) {
                      this.state.audio = true;
                      RRCToast.show('Unpublish Audio Error: ' + code);
                      RRCLoading.hide();
                    }
                  }
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckBox
                    style={{ width: 15, height: 15 }}
                    disabled={true}
                    value={this.state.audio}
                  />
                  <View style={{ width: 2 }} />
                  <Text style={UI.styles.text, { fontSize: 15 }}>发布音频</Text>
                </View>
              </TouchableOpacity>
              <View style={{ width: 10 }} />
              <TouchableOpacity
                onPress={async () => {
                  RRCLoading.show();
                  if (!this.state.video) {
                    let code = await RCReactNativeRtc.publish(1);
                    if (code != 0) {
                      this.state.video = false;
                      RRCToast.show('Publish Video Error: ' + code);
                      RRCLoading.hide();
                    }
                  } else {
                    let code = await RCReactNativeRtc.unpublish(1);
                    if (code != 0) {
                      this.state.video = true;
                      RRCToast.show('Unpublish Video Error: ' + code);
                      RRCLoading.hide();
                    }
                  }
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckBox
                    style={{ width: 15, height: 15 }}
                    disabled={true}
                    value={this.state.video}
                  />
                  <View style={{ width: 2 }} />
                  <Text style={UI.styles.text, { fontSize: 15 }}>发布视频</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ height: 10 }} />
            <View style={UI.styles.row}>
              <TouchableOpacity
                onPress={async () => {
                  RRCLoading.show();
                  let code = await RCReactNativeRtc.switchCamera();
                  if (code != 0) {
                    RRCToast.show('Switch Camera Error: ' + code);
                    RRCLoading.hide();
                  }
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckBox
                    style={{ width: 15, height: 15 }}
                    disabled={true}
                    value={this.state.front}
                  />
                  <View style={{ width: 2 }} />
                  <Text style={UI.styles.text, { fontSize: 15 }}>前置摄像</Text>
                </View>
              </TouchableOpacity>
              <View style={{ width: 10 }} />
              <TouchableOpacity
                onPress={() => {
                  this.setState({ mirror: !this.state.mirror });
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CheckBox
                    style={{ width: 15, height: 15 }}
                    disabled={true}
                    value={this.state.mirror}
                  />
                  <View style={{ width: 2 }} />
                  <Text style={UI.styles.text, { fontSize: 15 }}>本地镜像</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ height: 10 }} />
            <View style={UI.styles.row}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={UI.styles.button}
                onPress={async () => {
                  RRCLoading.show();
                  let code = await RCReactNativeRtc.enableSpeaker(!this.state.speaker);
                  if (code != 0) {
                    RRCToast.show((this.state.speaker ? 'Stop' : 'Start') + ' Speaker Error: ' + code);
                  } else {
                    this.setState({ speaker: !this.state.speaker });
                  }
                  RRCLoading.hide();
                }}>
                <Text style={UI.styles.text, { fontSize: 15 }}>{this.state.speaker ? '扬声器' : '听筒'}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 10 }} />
            <View style={UI.styles.row}>
              <RNPickerSelect
                items={Constants.fps}
                value={this.state.videoConfig.fps}
                onValueChange={(value) => {
                  if (value != null) {
                    const videoConfig = {}
                    videoConfig.fps = value;
                    this.setState({ videoConfig: videoConfig })
                    RCReactNativeRtc.setVideoConfig(videoConfig, false);
                  }
                }}
              />
              <View style={{ width: 10 }} />
              <RNPickerSelect
                items={Constants.resolution}
                value={this.state.videoConfig.resolution}
                onValueChange={(value) => {
                  if (value != null) {
                    const videoConfig = {}
                    videoConfig.resolution = value;
                    this.setState({ videoConfig: videoConfig })
                    RCReactNativeRtc.setVideoConfig(videoConfig, false);
                  }
                }}
              />
            </View>
            <View style={{ height: 10 }} />
            <View style={UI.styles.row}>
              <Text style={UI.styles.text, { fontSize: 15 }}>码率下限:</Text>
              <RNPickerSelect
                items={Constants.minVideoKbps}
                value={this.state.videoConfig.minBitrate}
                onValueChange={(value) => {
                  if (value != null) {
                    const videoConfig = {}
                    videoConfig.minBitrate = value;
                    this.setState({ videoConfig: videoConfig })
                    RCReactNativeRtc.setVideoConfig(videoConfig, false);
                  }
                }}
              />
            </View>
            <View style={{ height: 10 }} />
            <View style={UI.styles.row}>
              <Text style={UI.styles.text, { fontSize: 15 }}>码率上限:</Text>
              <RNPickerSelect
                items={Constants.maxVideoKbps}
                value={this.state.videoConfig.maxBitrate}
                onValueChange={(value) => {
                  if (value != null) {
                    const videoConfig = {}
                    videoConfig.maxBitrate = value;
                    this.setState({ videoConfig: videoConfig })
                    RCReactNativeRtc.setVideoConfig(videoConfig, false);
                  }
                }}
              />
            </View>
          </View>
        </View>
        <View style={{
          flexDirection: 'row',
          margin: 5,
          padding: 5,
          borderWidth: 1,
          borderColor: 'lightblue',
          alignItems: 'center',
          alignSelf: 'center'
        }}>
          <Text style={UI.styles.text, { fontSize: 15 }}>小流设置</Text>
          <View style={{ width: 5 }} />
          <View style={{ flexDirection: 'column', alignItems: 'center' }}>
            <View style={UI.styles.row}>
              <RNPickerSelect
                items={Constants.resolution}
                value={this.state.tinyVideoConfig.resolution}
                onValueChange={(value) => {
                  if (value != null) {
                    const videoConfig = {}
                    videoConfig.resolution = value;
                    this.setState({ tinyVideoConfig: videoConfig })
                    RCReactNativeRtc.setVideoConfig(videoConfig, true);
                  }
                }}
              />
            </View>
            <View style={{ height: 10 }} />
            <View style={{ flexDirection: 'row' }}>
              <View style={UI.styles.row}>
                <Text style={UI.styles.text, { fontSize: 15 }}>下限:</Text>
                <RNPickerSelect
                  items={Constants.minVideoKbps}
                  value={this.state.tinyVideoConfig.minBitrate}
                  onValueChange={(value) => {
                    if (value != null) {
                      const videoConfig = {}
                      videoConfig.minBitrate = value;
                      this.setState({ tinyVideoConfig: videoConfig })
                      RCReactNativeRtc.setVideoConfig(videoConfig, true);
                    }
                  }}
                />
              </View>
              <View style={{ width: 5 }} />
              <View style={UI.styles.row}>
                <Text style={UI.styles.text, { fontSize: 15 }}>上限:</Text>
                <RNPickerSelect
                  items={Constants.maxVideoKbps}
                  value={this.state.tinyVideoConfig.maxBitrate}
                  onValueChange={(value) => {
                    if (value != null) {
                      const videoConfig = {}
                      videoConfig.maxBitrate = value;
                      this.setState({ tinyVideoConfig: videoConfig })
                      RCReactNativeRtc.setVideoConfig(videoConfig, true);
                    }
                  }}
                />
              </View>
            </View>
          </View>
        </View>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View>
            
          </View>
        </ScrollView>
      </View>
    );
  }

  videoResolutionPopUp() {
    if (this.state.videoResolutionPopUp) {
      return (
        <View style={{ borderWidth: 1, borderColor: 'black' }}>
          {
            Constants.resolution.map((resolution, index) => {
              return (
                <TouchableOpacity key={resolution} onPress={() => {
                  this.state.videoConfig.resolution = index;
                  this.state.videoResolutionPopUp = false;
                  RCReactNativeRtc.setVideoConfig(this.state.videoConfig, false);
                  this.setState(this.state);
                }}>
                  <Text style={UI.styles.text, { fontSize: 15 }}>{resolution}</Text>
                </TouchableOpacity>
              );
            })
          }
        </View>
      );
    }
  }

  videoMinBitratePopUp() {
    if (this.state.videoMinBitratePopUp) {
      return (
        <View style={{ borderWidth: 1, borderColor: 'black' }}>
          {
            Constants.minVideoKbps.map((kbps) => {
              return (
                <TouchableOpacity key={kbps} onPress={() => {
                  this.state.videoConfig.minBitrate = kbps;
                  this.state.videoMinBitratePopUp = false;
                  RCReactNativeRtc.setVideoConfig(this.state.videoConfig, false);
                  this.setState(this.state);
                }}>
                  <Text style={UI.styles.text, { fontSize: 15 }}>{kbps + 'kbps'}</Text>
                </TouchableOpacity>
              );
            })
          }
        </View>
      );
    }
  }

  videoMaxBitratePopUp() {
    if (this.state.videoMaxBitratePopUp) {
      return (
        <View style={{ borderWidth: 1, borderColor: 'black' }}>
          {
            Constants.maxVideoKbps.map((kbps) => {
              return (
                <TouchableOpacity key={kbps} onPress={() => {
                  this.state.videoConfig.maxBitrate = kbps;
                  this.state.videoMaxBitratePopUp = false;
                  RCReactNativeRtc.setVideoConfig(this.state.videoConfig, false);
                  this.setState(this.state);
                }}>
                  <Text style={UI.styles.text, { fontSize: 15 }}>{kbps + 'kbps'}</Text>
                </TouchableOpacity>
              );
            })
          }
        </View>
      );
    }
  }

  tinyVideoResolutionPopUp() {
    if (this.state.tinyVideoResolutionPopUp) {
      return (
        <View style={{ borderWidth: 1, borderColor: 'black' }}>
          {
            Constants.resolution.map((resolution, index) => {
              return (
                <TouchableOpacity key={resolution} onPress={() => {
                  this.state.tinyVideoConfig.resolution = index;
                  this.state.tinyVideoResolutionPopUp = false;
                  RCReactNativeRtc.setVideoConfig(this.state.tinyVideoConfig, true);
                  this.setState(this.state);
                }}>
                  <Text style={UI.styles.text, { fontSize: 15 }}>{resolution}</Text>
                </TouchableOpacity>
              );
            })
          }
        </View>
      );
    }
  }

  tinyVideoMinBitratePopUp() {
    if (this.state.tinyVideoMinBitratePopUp) {
      return (
        <View style={{ borderWidth: 1, borderColor: 'black' }}>
          {
            Constants.minVideoKbps.map((kbps) => {
              return (
                <TouchableOpacity key={kbps} onPress={() => {
                  this.state.tinyVideoConfig.minBitrate = kbps;
                  this.state.tinyVideoMinBitratePopUp = false;
                  RCReactNativeRtc.setVideoConfig(this.state.tinyVideoConfig, true);
                  this.setState(this.state);
                }}>
                  <Text style={UI.styles.text, { fontSize: 15 }}>{kbps + 'kbps'}</Text>
                </TouchableOpacity>
              );
            })
          }
        </View>
      );
    }
  }

  tinyVideoMaxBitratePopUp() {
    if (this.state.tinyVideoMaxBitratePopUp) {
      return (
        <View style={{ borderWidth: 1, borderColor: 'black' }}>
          {
            Constants.maxVideoKbps.map((kbps) => {
              return (
                <TouchableOpacity key={kbps} onPress={() => {
                  this.state.tinyVideoConfig.maxBitrate = kbps;
                  this.state.tinyVideoMaxBitratePopUp = false;
                  RCReactNativeRtc.setVideoConfig(this.state.tinyVideoConfig, true);
                  this.setState(this.state);
                }}>
                  <Text style={UI.styles.text, { fontSize: 15 }}>{kbps + 'kbps'}</Text>
                </TouchableOpacity>
              );
            })
          }
        </View>
      );
    }
  }

}

export default MeetingScreen;
