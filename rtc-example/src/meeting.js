
import React from 'react';

import * as Config from './config';
import * as Util from './util';
import * as UI from './ui';
import * as Constants from './constants'

import {
  FlatList,
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
      refresh: {},
      microphone: false,
      camera: false,
      audio: false,
      video: false,
      speaker: false,
      front: true,
      mirror: true,
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

    this.listeners = [];
    this.remotes = new Map();

    // RRCLoading.hide();

    this.listeners.push(
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
      })
    );

    this.listeners.push(
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
      })
    );

    this.listeners.push(
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
      })
    );

    this.listeners.push(
      RCReactNativeRtcEventEmitter.addListener('Engine:OnSwitchCamera', (event) => {
        let camera = event.camera;
        let code = event.code;
        let message = event.message;
        this.setState({ front: camera == 1 });
        if (code != 0) {
          RRCToast.show('Switch Camera Error: ' + code + ', message: ' + message);
        }
        RRCLoading.hide();
      })
    );

    this.listeners.push(
      RCReactNativeRtcEventEmitter.addListener('Engine:OnSubscribed', (event) => {
        let id = event.id;
        let type = event.type;
        let code = event.code;
        let message = event.message;
        if (code != 0) {
          RRCToast.show('Subscribe ' + id + ' ' + (media[type]) + ' Error: ' + code + ', message: ' + message);
        } else {
          RCReactNativeRtc.setRemoteView(id, this.remotes.get(id));
          let user = Util.users.get(id);
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
          this.setState({ refresh: {} });
        }
        RRCLoading.hide();
      })
    );

    this.listeners.push(
      RCReactNativeRtcEventEmitter.addListener('Engine:OnUnsubscribed', (event) => {
        let id = event.id;
        let type = event.type;
        let code = event.code;
        let message = event.message;
        if (code != 0) {
          RRCToast.show('Unsubscribe ' + id + ' ' + (media[type]) + ' Error: ' + code + ', message: ' + message);
        } else {
          RCReactNativeRtc.removeRemoteView(id);
          let user = Util.users.get(id);
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
          this.setState({ refresh: {} });
        }
        RRCLoading.hide();
      })
    );

    Util.setListeners(
      () => {
        this.setState({ refresh: {} });
      },
      () => {
        this.setState({ refresh: {} });
      },
      (id, published) => {
        this.setState({ refresh: {} });
      },
      (id, published) => {
        this.setState({ refresh: {} });
      },
    );

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
    Util.unInit();
    this.listeners.map((listener) => {
      listener.remove();
    });
    this.listeners.length = 0;
    RCReactNativeRtc.leaveRoom();
    RCReactNativeRtc.unInit();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
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
        <FlatList
          style={{ flex: 1 }}
          data={Array.from(Util.users.values())}
          ItemSeparatorComponent={() => (
            <View style={{ height: 5 }} />
          )}
          renderItem={
            ({ item }) => (
              <View style={{ flexDirection: 'row' }}>
                <RCReactNativeRtcView
                  style={{
                    width: '50%', height: 210, backgroundColor: 'black'
                  }}
                  ref={(ref) => {
                    let id = item.id;
                    let current = findNodeHandle(ref);
                    if (!Util.isNull(current)) {
                      if (this.remotes.has(id)) {
                        let cache = this.remotes.get(id);
                        if (current != cache) {
                          this.remotes.delete(id);
                          this.remotes.set(id, current);
                        }
                      } else {
                        this.remotes.set(id, current);
                      }
                    }
                  }}
                  mirror={false}
                />
                <View style={UI.styles.column}>
                  <View style={UI.styles.row}>
                    <TouchableOpacity
                      disabled={!item.audioPublished}
                      onPress={async () => {
                        RRCLoading.show();
                        if (!item.audioSubscribed) {
                          let code = await RCReactNativeRtc.subscribe(item.id, 0, false);
                          if (code != 0) {
                            RRCToast.show('Subscribe Audio Error: ' + code);
                            RRCLoading.hide();
                          }
                        } else {
                          let code = await RCReactNativeRtc.unsubscribe(item.id, 0);
                          if (code != 0) {
                            RRCToast.show('Unsubscribe Audio Error: ' + code);
                            RRCLoading.hide();
                          }
                        }
                      }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CheckBox
                          style={{ width: 15, height: 15 }}
                          disabled={true}
                          value={item.audioSubscribed}
                        />
                        <View style={{ width: 2 }} />
                        <Text style={{ fontSize: 15, color: item.audioPublished ? 'black' : 'gray' }}>订阅音频</Text>
                      </View>
                    </TouchableOpacity>
                    <View style={{ width: 10 }} />
                    <TouchableOpacity
                      disabled={!item.videoPublished}
                      onPress={async () => {
                        RRCLoading.show();
                        if (!item.videoSubscribed) {
                          let code = await RCReactNativeRtc.subscribe(item.id, 1, false);
                          if (code != 0) {
                            RRCToast.show('Subscribe Video Error: ' + code);
                            RRCLoading.hide();
                          }
                        } else {
                          let code = await RCReactNativeRtc.unsubscribe(item.id, 1);
                          if (code != 0) {
                            RRCToast.show('Unsubscribe Video Error: ' + code);
                            RRCLoading.hide();
                          }
                        }
                      }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CheckBox
                          style={{ width: 15, height: 15 }}
                          disabled={true}
                          value={item.videoSubscribed}
                        />
                        <View style={{ width: 2 }} />
                        <Text style={{ fontSize: 15, color: item.videoPublished ? 'black' : 'gray' }}>订阅视频</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={{ height: 10 }} />
                  {/* TODO stats table */}
                </View>
              </View>
            )
          }
        />
      </View >
    );
  }

}

export default MeetingScreen;
