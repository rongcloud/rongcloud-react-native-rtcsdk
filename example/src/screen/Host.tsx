import React, { RefObject } from 'react';

import * as Util from '../util';
import * as Constants from '../constants'
import Picker from '../component/Picker';
import Radio from '../component/Radio';
import CheckBox from '../component/CheckBox';
import Pop from "../component/Pop";
import * as ImagePicker from 'react-native-image-picker';

import {
  Text,
  View,
  TouchableOpacity,
  findNodeHandle,
  Image,
  StyleSheet,
  Button,
  DeviceEventEmitter,
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
  RCRTCCamera,
  RCRTCNetworkType,
  RCRTCNetworkStats,
  RCRTCLocalAudioStats,
  RCRTCLocalVideoStats,
  RCRTCViewFitType,
  RCRTCRemoteAudioStats,
  RCRTCRemoteVideoStats,
  RCRTCRole,
  RCRTCVideoConfig,
  RCRTCVideoFps,
  RCRTCVideoResolution,
  RCRTCErrorCode
} from '@rongcloud/react-native-rtc'

import type { NativeStackScreenProps } from '@react-navigation/native-stack';




interface HostScreenProps extends NativeStackScreenProps<any> {

}


interface HostScreenStates {
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
  localTinyVideoStats: RCRTCLocalVideoStats | null
  bandedSubRooms: string[],//已经加入的子房间
  joinedSubRooms: string[],//已经连麦的子房间
  customVideoTag: string,
  customVideoConfig: RCRTCVideoConfig,
  customVideoFile: string,
  customVideoFitType: RCRTCViewFitType,
  customVideoPublished: boolean,
}


const defaultVideoConfig = {
  minBitrate: 500,
  maxBitrate: 2200,
  fps: RCRTCVideoFps.Fps25,
  resolution: RCRTCVideoResolution.Resolution_720x1280,
}

const defaultTinyVideoConfig = {
  minBitrate: 100,
  maxBitrate: 500,
  resolution: RCRTCVideoResolution.Resolution_240x320,
}
const defaultCustomVideoConfig = {
  minBitrate: 500,
  maxBitrate: 2200,
  fps: RCRTCVideoFps.Fps30,
  resolution: RCRTCVideoResolution.Resolution_720x1280
}

const defaultNetworkStats = {
  type: RCRTCNetworkType.Unknown,
  ip: '',
  sendBitrate: 0,
  receiveBitrate: 0,
  rtt: 0
}

class HostScreen extends React.Component<HostScreenProps, HostScreenStates> {
  pop: RefObject<Pop>;
  localtag: number | null;
  customViewTag: number | null;
  constructor(props: HostScreenProps) {
    super(props);

    let customTag = this.props.route.params!.userId + 'Custom'
    customTag = customTag.replace('_', '');
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
      localTinyVideoStats: null,
      bandedSubRooms: [],//已经加入的子房间
      joinedSubRooms: [],//已经连麦的子房间,
      customVideoTag: customTag,
      customVideoConfig: defaultCustomVideoConfig,
      customVideoFile: 'null',
      customVideoFitType: RCRTCViewFitType.Center,
      customVideoPublished: false
    };
    this.pop = React.createRef<Pop>();
    this.localtag = null;
    this.customViewTag = null;

    RCRTCEngine.setVideoConfig(defaultVideoConfig, false);
    RCRTCEngine.setVideoConfig(defaultTinyVideoConfig, true);
    RCRTCEngine.enableMicrophone(this.state.microphone);
    RCRTCEngine.enableSpeaker(this.state.speaker)
    RCRTCEngine.setOnEnableCameraListener((enable: boolean, code: number, message: string) => {
      if (code != 0)
        RRCToast.show((enable ? 'Stop' : 'Start') + ' Camera Error: ' + code + ', message: ' + message);
      else {
        if (enable) {
          if (this.localtag)
            RCRTCEngine.setLocalView(this.localtag);
        } else {
          RCRTCEngine.removeLocalView();
        }
        this.setState({ camera: enable });
      }
      RRCLoading.hide();
    })


    RCRTCEngine.setOnPublishedListener((type: RCRTCMediaType, code: number, message: string) => {
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


    RCRTCEngine.setOnUnpublishedListener((type: RCRTCMediaType, code: number, message: string) => {
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


    RCRTCEngine.setOnSwitchCameraListener((camera: RCRTCCamera, code: number, message: string) => {
      if (code != 0)
        RRCToast.show('Switch Camera Error: ' + code + ', message: ' + message);
      else
        this.setState({ front: camera == 1 });
      RRCLoading.hide();
    })


    RCRTCEngine.setOnSubscribedListener((id: string, type: RCRTCMediaType, code: number, message: string) => {
      if (code != 0)
        RRCToast.show('Subscribe ' + id + ' ' + ' Error: ' + code + ', message: ' + message);
      else {
        let user = Util.users.get(id);
        if (type != RCRTCMediaType.Audio)
          RCRTCEngine.setRemoteView(id, user!.viewTag!);
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


    RCRTCEngine.setOnUnsubscribedListener((id: string, type: RCRTCMediaType, code: number, message: string) => {
      if (code != 0)
        RRCToast.show('Unsubscribe ' + id + ' ' + ' Error: ' + code + ', message: ' + message);
      else {
        if (type != RCRTCMediaType.Audio)
          RCRTCEngine.removeRemoteView(id);
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
    RCRTCEngine.setOnNetworkStatsListener((stats: RCRTCNetworkStats) => {
      this.setState({ networkStats: stats })
    })

    RCRTCEngine.setOnLocalAudioStatsListener((stats: RCRTCLocalAudioStats) => {
      this.setState({ localAudioStats: stats })
    })

    RCRTCEngine.setOnLocalVideoStatsListener((stats: RCRTCLocalVideoStats) => {
      if (stats.tiny)
        this.setState({ localTinyVideoStats: stats })
      else
        this.setState({ localVideoStats: stats })
    })

    RCRTCEngine.setOnRemoteAudioStatsListener((roomId: string, userId: string, stats: RCRTCRemoteAudioStats) => {
      const user = Util.users.get(userId)
      if (user) {
        user.remoteAudioStats = stats;
        this.setState({ refresh: {} })
      }
    })

    RCRTCEngine.setOnRemoteVideoStatsListener((roomId: string, userId: string, stats: RCRTCRemoteVideoStats) => {
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




    RCRTCEngine.setOnJoinSubRoomRequestRespondedListener((roomId: string, userId: string, agree: boolean, code: number, message: string) => {
      //responseJoinSubRoomRequest的回调，
      if (agree)//我已同意对方邀请，加入房间
        RCRTCEngine.joinSubRoom(roomId)
    })

    RCRTCEngine.setOnJoinSubRoomRequestReceivedListener((roomId: string, userId: string, extra: string) => {
      this.responseSubRoom(roomId, userId)
    })

    RCRTCEngine.setOnCancelJoinSubRoomRequestReceivedListener((roomId: string, userId: string, extra: string) => {
      RRCToast.show(`${userId}已取消邀请`)
      this.pop.current?.close()//关闭弹窗
    })

    RCRTCEngine.setOnSubRoomJoinedListener((roomId: string, code: number, message: string) => {
      let joinedSubRooms = this.state.joinedSubRooms
      if (!joinedSubRooms.includes(roomId))
        this.state.joinedSubRooms.push(roomId)
      DeviceEventEmitter.emit('OnUpdateJoinableSubRooms', {
        joinedSubRooms: this.state.joinedSubRooms,
        bandedSubRooms: this.state.bandedSubRooms
      })
    })

    RCRTCEngine.setOnSubRoomLeftListener((roomId: string, code: number, message: string) => {
      let joinedSubRooms = this.state.joinedSubRooms
      let joinedSubRoomsIndex = joinedSubRooms.indexOf(roomId);
      if (joinedSubRoomsIndex != -1) {
        joinedSubRooms.splice(joinedSubRoomsIndex, 1);
      }
      DeviceEventEmitter.emit('OnUpdateJoinableSubRooms', {
        joinedSubRooms: this.state.joinedSubRooms,
        bandedSubRooms: this.state.bandedSubRooms
      })
    })

    RCRTCEngine.setOnSubRoomBandedListener((roomId: string) => {
      let bandedSubRooms = this.state.bandedSubRooms
      if (!bandedSubRooms.includes(roomId))
        this.state.bandedSubRooms.push(roomId)
      DeviceEventEmitter.emit('OnUpdateJoinableSubRooms', {
        joinedSubRooms: this.state.joinedSubRooms,
        bandedSubRooms: this.state.bandedSubRooms
      })
    })

    RCRTCEngine.setOnSubRoomDisbandListener((roomId: string, userId: string) => {
      let bandedSubRooms = this.state.bandedSubRooms
      let jbandedSubRoomsIndex = bandedSubRooms.indexOf(roomId);
      if (jbandedSubRoomsIndex != -1) {
        bandedSubRooms.splice(jbandedSubRoomsIndex, 1);
      }
      DeviceEventEmitter.emit('OnUpdateJoinableSubRooms', {
        joinedSubRooms: this.state.joinedSubRooms,
        bandedSubRooms: this.state.bandedSubRooms
      })
    })

    //发布自定义视频回调
    RCRTCEngine.setOnCustomStreamPublishedListener((tag: string, code: number, message: string) => {
      if (tag === this.state.customVideoTag && code === 0) {
        this.setState({ customVideoPublished: true })
        RCRTCEngine.setLocalCustomStreamView(tag, this.customViewTag!)
      }
    })

    //取消发布自定义视频回调
    RCRTCEngine.setOnCustomStreamUnpublishedListener((tag: string, code: number, message: string) => {
      if (tag === this.state.customVideoTag && code === 0) {
        this.setState({ customVideoPublished: false })
        RCRTCEngine.removeLocalCustomStreamView(tag);
      }
    })

    //本地自定义流发布结束回调
    RCRTCEngine.setOnCustomStreamPublishFinishedListener((tag: string) => {
      this.setState({ customVideoPublished: false })
      RCRTCEngine.removeLocalCustomStreamView(tag);
    })

    //远端发布自定义视频
    RCRTCEngine.setOnRemoteCustomStreamPublishedListener((roomId: string, userId: string, tag: string, type: RCRTCMediaType) => {
      Util.users.delete(tag);
      let customUser = {
        id: userId,
        customTag: tag,
        viewTag: null,
        isCustom: true,
        audioPublished: false,
        videoPublished: false,
        audioSubscribed: false,
        videoSubscribed: false,
        subscribeTiny: false,
        fitType: RCRTCViewFitType.Center,
        remoteAudioStats: null,
        remoteVideoStats: null
      };
      switch (type) {
        case RCRTCMediaType.Audio:
          customUser.audioPublished = true;
          break;
        case RCRTCMediaType.Video:
          customUser.videoPublished = true;
          break;
        default:
          customUser.audioPublished = true;
          customUser.videoPublished = true;
          break;
      }
      Util.users.set(tag, customUser)
      this.setState({ refresh: {} })
    })

    //远端取消发布自定义视频
    RCRTCEngine.setOnRemoteCustomStreamUnpublishedListener((roomId: string, userId: string, tag: string, type: RCRTCMediaType) => {
      console.log('OnRemoteCustomStreamUnpublished')
      Util.users.delete(tag);
    })
    //远端自定义视频首帧
    RCRTCEngine.setOnRemoteCustomStreamFirstFrameListener((roomId: string, userId: string, tag: string, type: RCRTCMediaType) => {
      console.log('OnRemoteCustomStreamFirstFrame')
    })
    //远端用户开关自定义流操作回调
    RCRTCEngine.setOnRemoteCustomStreamStateChangedListener((roomId: string, userId: string, tag: string, type: RCRTCMediaType, disabled: boolean) => {
      console.log('OnRemoteCustomStreamStateChanged')
    })

    RCRTCEngine.setOnCustomStreamSubscribedListener((userId: string, tag: string, type: RCRTCMediaType, code: number, message: string) => {
      if (code != 0) {
        RRCToast.show('Subscribe ' + tag + ' ' + ' Error: ' + code + ', message: ' + message);
      } else {
        let user = Util.users.get(tag);
        RCRTCEngine.setRemoteCustomStreamView(userId, tag, user!.viewTag!)
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

    RCRTCEngine.setOnCustomStreamUnsubscribedListener((userId: string, tag: string, type: RCRTCMediaType, code: number, message: string) => {
      if (code != 0) {
        RRCToast.show('Unsubscribe ' + tag + ' ' + ' Error: ' + code + ', message: ' + message);
      } else {
        RCRTCEngine.removeRemoteCustomStreamView(userId, tag);
        let user = Util.users.get(tag);
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

    RCRTCEngine.setOnRemoteCustomAudioStatsListener((roomId: string, userId: string, tag: string, stats: RCRTCRemoteAudioStats) => {
      const user = Util.users.get(tag)
      if (user) {
        user.remoteAudioStats = stats;
        this.setState({ refresh: {} })
      }
    })
    RCRTCEngine.setOnRemoteCustomVideoStatsListener((roomId: string, userId: string, tag: string, stats: RCRTCRemoteVideoStats) => {
      const user = Util.users.get(tag)
      if (user) {
        user.remoteVideoStats = stats;
        this.setState({ refresh: {} })
      }
    })
  }



  responseSubRoom(roomId: string, userId: string) {
    this.pop.current?.setView(
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20 }}>加入子房间</Text>
        <Text style={{ marginTop: 20 }}>收到来自{roomId}的{userId}邀请你一起连麦，是否同意？</Text>
        <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'flex-end' }}>
          <Button title="OK" onPress={() => {
            this.pop.current?.close()
            RCRTCEngine.responseJoinSubRoomRequest(roomId, userId, true, true, '');
          }} />
          <View style={{ width: 30 }} />
          <Button title="Cancel" onPress={() => {
            this.pop.current?.close()
            RCRTCEngine.responseJoinSubRoomRequest(roomId, userId, false, false, '');
          }} />
        </View>
      </View>)
  }


  async enableMicrophone() {
    RRCLoading.show();
    let code = await RCRTCEngine.enableMicrophone(!this.state.microphone);
    if (code != 0) {
      RRCToast.show((this.state.microphone ? 'Stop' : 'Start') + ' Microphone Error: ' + code);
    } else {
      this.setState({ microphone: !this.state.microphone });
    }
    RRCLoading.hide();
  }

  async enableCamera() {
    RRCLoading.show();
    let code = await RCRTCEngine.enableCamera(!this.state.camera, this.state.front ? 1 : 2);
    if (code != 0) {
      RRCToast.show((this.state.camera ? 'Stop' : 'Start') + ' Camera Error: ' + code);
      RRCLoading.hide();
    }
  }

  async publishAudio(audio: boolean) {
    RRCLoading.show();
    if (!audio) {
      let code = await RCRTCEngine.publish(RCRTCMediaType.Audio);
      if (code != 0) {
        this.setState({ audio: false })
        RRCToast.show('Publish Audio Error: ' + code);
        RRCLoading.hide();
      }
    } else {
      let code = await RCRTCEngine.unpublish(RCRTCMediaType.Audio);
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
      let code = await RCRTCEngine.publish(RCRTCMediaType.Video);
      if (code != 0) {
        this.setState({ video: false })
        RRCToast.show('Publish Video Error: ' + code);
        RRCLoading.hide();
      }
    } else {
      let code = await RCRTCEngine.unpublish(RCRTCMediaType.Video);
      if (code != 0) {
        this.setState({ video: true })
        RRCToast.show('Unpublish Video Error: ' + code);
        RRCLoading.hide();
      }
    }
  }

  async switchCamera() {
    RRCLoading.show();
    let code = await RCRTCEngine.switchCamera();
    if (code != 0) {
      RRCToast.show('Switch Camera Error: ' + code);
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

  async audioSubscribe(item: Util.User) {
    RRCLoading.show();
    let code = 0;
    if (item.customTag)
      code = await RCRTCEngine.subscribeCustomStream(item.id, item.customTag, RCRTCMediaType.Audio, false)
    else
      code = await RCRTCEngine.subscribe(item.id, RCRTCMediaType.Audio, false);
    if (code != 0) {
      RRCToast.show('Subscribe Audio Error: ' + code);
      RRCLoading.hide();
    }
  }

  async audioUnSubscribe(item: Util.User) {
    RRCLoading.show();
    let code = 0;
    if (item.customTag)
      code = await RCRTCEngine.unsubscribeCustomStream(item.id, item.customTag, RCRTCMediaType.Audio)
    else
      code = await RCRTCEngine.unsubscribe(item.id, RCRTCMediaType.Audio);
    if (code != 0) {
      RRCToast.show('Unsubscribe Audio Error: ' + code);
      RRCLoading.hide();
    }
  }


  async videoSubscribe(item: Util.User) {
    RRCLoading.show();
    let code = 0;
    if (item.customTag)
      code = await RCRTCEngine.subscribeCustomStream(item.id, item.customTag, RCRTCMediaType.Video, item.subscribeTiny)
    else
      code = await RCRTCEngine.subscribe(item.id, RCRTCMediaType.Video, item.subscribeTiny);
    if (code != 0) {
      RRCToast.show('Subscribe Video Error: ' + code);
      RRCLoading.hide();
    }
  }

  async videoUnSubscribe(item: Util.User) {
    RRCLoading.show();
    let code = 0;
    if (item.customTag)
      code = await RCRTCEngine.unsubscribeCustomStream(item.id, item.customTag, RCRTCMediaType.Video);
    else
      code = await RCRTCEngine.unsubscribe(item.id, RCRTCMediaType.Video);
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
    Util.unInit();
    RCRTCEngine.leaveRoom();
    RCRTCEngine.unInit();
    RCRTCEngine.setOnNetworkStatsListener()
    RCRTCEngine.setOnLocalAudioStatsListener()
    RCRTCEngine.setOnLocalVideoStatsListener()
    RCRTCEngine.setOnRemoteAudioStatsListener()
    RCRTCEngine.setOnRemoteVideoStatsListener()

    if (this.state.customVideoPublished) {
      RCRTCEngine.unpublishCustomStream(this.state.customVideoTag)
    }
  }


  setOptions() {
    this.props.navigation.setOptions({
      headerTitle: '房间号:' + this.props.route.params!.roomId,
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('SubRoom', {
                bandedSubRooms: this.state.bandedSubRooms,
                joinedSubRooms: this.state.joinedSubRooms
              })
            }}>

            <Image source={{ uri: 'sub_room' }} style={{ width: 25, height: 25 }}></Image>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!(this.state.audio || this.state.video)}
            style={{ marginLeft: 10, backgroundColor: !(this.state.audio || this.state.video) ? 'grey' : undefined }}
            onPress={() => {
              this.props.navigation.navigate('CdnSetting', {})
            }}>

            <Image source={{ uri: 'cdn' }} style={{ width: 25, height: 25 }}></Image>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!(this.state.audio || this.state.video)}
            style={{ marginLeft: 10, backgroundColor: !(this.state.audio || this.state.video) ? 'grey' : undefined }}
            onPress={() => {
              let users = Array.from(Util.users.values()).map((value) => { return { id: value.id, tag: null } })
              // users是订阅的id，userId是自己的id
              this.props.navigation.navigate('Layout', {
                users: users,
                customTag: this.state.customVideoPublished ? this.state.customVideoTag : null,//发布自定义视频后才传tag
                userId: this.props.route.params!.userId
              })
            }}>

            <Image source={{ uri: 'layout' }} style={{ width: 25, height: 25 }}></Image>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => {
              this.props.navigation.navigate('Message', {
                userId: this.props.route.params!.userId,
                roomId: this.props.route.params!.roomId,
                role: RCRTCRole.LiveBroadcaster
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

  renderItem() {
    return Array.from(Util.users.values()).map((item, index) => {
      return (
        <View key={index} style={{ flexDirection: 'row', marginTop: 5 }}>
          <View style={{ width: '50%', height: 180, backgroundColor: 'black', overflow: 'hidden' }}>
            <RCReactNativeRtcView
              fitType={item.fitType}
              style={{ width: '100%', height: 180 }}
              ref={(ref) => {
                let id = item.customTag ? item.customTag : item.id;
                let current = findNodeHandle(ref);
                let user = Util.users.get(id);
                if (current && user)
                  user.viewTag = current
              }}
              mirror={false}
            />
            <View style={{ position: 'absolute', width: '100%', height: 180 }}>
              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={{ color: 'red', }}>{item.customTag ? item.customTag : item.id}</Text>
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
                  let videoConfig = { ...this.state.videoConfig };
                  videoConfig.fps = value
                  this.setState({ videoConfig: videoConfig })
                  RCRTCEngine.setVideoConfig(videoConfig, false);
                }}
              />

              <Picker
                style={{ marginLeft: 10 }}
                items={Constants.resolution}
                value={this.state.videoConfig.resolution}
                onValueChange={(value) => {
                  let videoConfig = { ...this.state.videoConfig };
                  videoConfig.resolution = value
                  this.setState({ videoConfig: videoConfig })
                  RCRTCEngine.setVideoConfig(videoConfig, false);
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 5 }}>
              <Text style={{ fontSize: 15 }}>码率下限:</Text>
              <Picker
                items={Constants.minVideoKbps}
                value={this.state.videoConfig.minBitrate}
                onValueChange={(value) => {
                  let videoConfig = { ...this.state.videoConfig };
                  videoConfig.minBitrate = value
                  this.setState({ videoConfig: videoConfig })
                  RCRTCEngine.setVideoConfig(videoConfig, false);
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 5 }}>
              <Text style={{ fontSize: 15 }}>码率上限:</Text>
              <Picker
                items={Constants.maxVideoKbps}
                value={this.state.videoConfig.maxBitrate}
                onValueChange={(value) => {
                  let videoConfig = { ...this.state.videoConfig };
                  videoConfig.maxBitrate = value
                  this.setState({ videoConfig: videoConfig })
                  RCRTCEngine.setVideoConfig(videoConfig, false);
                }}
              />
            </View>
          </View>
        </View>
        {/* 自定义视频 */}
        <View
          style={{
            flexDirection: 'row', borderWidth: 1, borderColor: 'lightblue'
          }}>
          <View style={{ width: '50%', height: 180, backgroundColor: 'yellow', overflow: 'hidden' }}>
            <RCReactNativeRtcView
              fitType={this.state.customVideoFitType}
              style={{ width: '100%', height: 180 }}
              ref={ref => this.customViewTag = findNodeHandle(ref)}
            />
            <View style={{ position: 'absolute', paddingLeft: 10, width: '100%', height: 180 }}>
              <Text style={{ color: 'red', }}>{this.state.customVideoTag}</Text>
              <Picker
                textStyle={{ color: 'red', textDecorationLine: 'underline' }}
                items={Constants.viewFitType}
                value={this.state.customVideoFitType}
                onValueChange={(value) => {
                  this.setState({ customVideoFitType: value })
                }}
              />
            </View>
          </View>
          <View style={{ flex: 1, marginLeft: 5 }}>
            <Text>已选文件</Text>
            <Text>{this.state.customVideoFile}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => {
                ImagePicker.launchImageLibrary({ mediaType: 'video' }, (response) => {
                  if (response.assets && response.assets!.length > 0) {
                    let file = response.assets![0].uri!
                    this.setState({ customVideoFile: file })
                  }
                })
              }}>

                <Text style={{ textDecorationLine: 'underline', color: 'blue' }}>选择文件</Text>
              </TouchableOpacity>

              <View style={{}}>
                <Button title={this.state.customVideoPublished ? '取消发布' : '发布'} onPress={() => {
                  if (this.state.customVideoPublished) {
                    RCRTCEngine.unpublishCustomStream(this.state.customVideoTag)
                  }
                  else {
                    let p = RCRTCEngine.createCustomStreamFromFile(this.state.customVideoFile, this.state.customVideoTag, true, true);
                    p.then(code => {
                      if (code === RCRTCErrorCode.Success)
                        return RCRTCEngine.setCustomStreamVideoConfig(this.state.customVideoTag, this.state.customVideoConfig);
                      else
                        return -1
                    }).then(code => {
                      if (code === RCRTCErrorCode.Success)
                        RCRTCEngine.publishCustomStream(this.state.customVideoTag)
                    })
                  }
                }} />
              </View>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 5 }}>
              <Picker
                items={Constants.fps}
                value={this.state.customVideoConfig.fps}
                onValueChange={(value) => {
                  let videoConfig = { ...this.state.customVideoConfig };
                  videoConfig.fps = value
                  this.setState({ customVideoConfig: videoConfig })
                }}
              />

              <Picker
                style={{ marginLeft: 10 }}
                items={Constants.resolution}
                value={this.state.customVideoConfig.resolution}
                onValueChange={(value) => {
                  let videoConfig = { ...this.state.customVideoConfig };
                  videoConfig.resolution = value
                  this.setState({ customVideoConfig: videoConfig })
                }}
              />
            </View>

            <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 5 }}>
              <Text style={{ fontSize: 15 }}>码率下限:</Text>
              <Picker
                items={Constants.minVideoKbps}
                value={this.state.customVideoConfig.minBitrate}
                onValueChange={(value) => {
                  let videoConfig = { ...this.state.customVideoConfig };
                  videoConfig.minBitrate = value
                  this.setState({ customVideoConfig: videoConfig })
                }}
              />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 5 }}>
              <Text style={{ fontSize: 15 }}>码率上限:</Text>
              <Picker
                items={Constants.maxVideoKbps}
                value={this.state.customVideoConfig.maxBitrate}
                onValueChange={(value) => {
                  let videoConfig = { ...this.state.customVideoConfig };
                  videoConfig.maxBitrate = value
                  this.setState({ customVideoConfig: videoConfig })
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
                let videoConfig = { ...this.state.tinyVideoConfig };
                videoConfig.resolution = value
                this.setState({ tinyVideoConfig: videoConfig })
                RCRTCEngine.setVideoConfig(videoConfig, true);
              }}
            />

            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Text style={{ fontSize: 15 }}>下限:</Text>
              <Picker
                items={Constants.tinyMinVideoKbps}
                value={this.state.tinyVideoConfig.minBitrate}
                onValueChange={(value) => {
                  let videoConfig = { ...this.state.tinyVideoConfig };
                  videoConfig.minBitrate = value
                  this.setState({ tinyVideoConfig: videoConfig })
                  RCRTCEngine.setVideoConfig(videoConfig, true);
                }}
              />

              <Text style={{ fontSize: 15, marginLeft: 10 }}>上限:</Text>
              <Picker
                items={Constants.tinyMaxVideoKbps}
                value={this.state.tinyVideoConfig.maxBitrate}
                onValueChange={(value) => {
                  let videoConfig = { ...this.state.tinyVideoConfig };
                  videoConfig.maxBitrate = value
                  this.setState({ tinyVideoConfig: videoConfig })
                  RCRTCEngine.setVideoConfig(videoConfig, true);
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
        <Pop ref={this.pop} />
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

export default HostScreen;
