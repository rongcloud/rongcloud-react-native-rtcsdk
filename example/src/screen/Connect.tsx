import React, { RefObject } from 'react';

import * as Config from '../config';
import * as Util from '../util';
import * as Constants from '../constants'

import {
  TextInput,
  View,
  StyleSheet,
  Button,
  FlatList,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';

import {
  RRCToast,
  RRCLoading,
} from 'react-native-overlayer';
import {
  RCIMIWEngine,
  RCIMIWEngineOptions,
} from '@rongcloud/react-native-im-wrapper';


import {
  RCRTCEngine, RCRTCMediaType, RCRTCRole, RCRTCRoomSetup
} from '@rongcloud/react-native-rtc'
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Radio from '../component/Radio';
import CheckBox from '../component/CheckBox';
import Pop from "../component/Pop";
import AsyncStorage from '@react-native-community/async-storage';
import RcTipAlert from '../component/RcTipAlert';

interface ConnectScreenProps extends NativeStackScreenProps<any> {

}

interface Data {
  key: string,
  navigate: string,
  file: string,
  media: string,
  token: string,
  userId: string
}

interface ConnectScreenStates extends Data {
  connected: boolean,
  roleType: RCRTCRole,
  room: string,
  tiny: boolean,
  mediaType: number,
  storageData: Data[]
}



const styles = StyleSheet.create({
  input: {
    color: 'black',
    borderRadius: 2,
    fontSize: 25,
    borderColor: 'black',
    paddingLeft: 10,
    padding: 0,
    borderWidth: 1,
  }
})


const types = [
  '加入会议',
  '开始直播',
  '观看直播',
];

export const holders = [
  'Meeting Id',
  'Room Id',
  'Room Id',
];

const storageKey = 'key'

export let imEngine: RCIMIWEngine;
export let rtcEngine: RCRTCEngine | undefined
let rcTipAlert: RcTipAlert;

class ConnectScreen extends React.Component<ConnectScreenProps, ConnectScreenStates> {
  _extraUniqueKey = (item: any, index: number) => {
    return item + index
  }
  pop: RefObject<Pop>;

  constructor(props: ConnectScreenProps) {
    super(props);
    this.pop = React.createRef<Pop>();
    this.state = {
      key: '',
      navigate: '',
      file: '',
      media: '',
      token: '',
      connected: false,
      roleType: RCRTCRole.MeetingMember,
      room: '',
      tiny: true,
      mediaType: 0,
      userId: '',
      storageData: []
    }
    imEngine?.disconnect(true);
    rtcEngine?.destroy();
  }

  clear() {
    AsyncStorage.setItem(storageKey, '[]')
    this.setState({ storageData: [] })
  }

  save() {
    const r = this.state.storageData.find((value) =>
      value.userId === this.state.userId
    )

    if (r)//已存在，不用保存
      return
    
    const data: Data = {
      key: this.state.key,
      navigate: this.state.navigate,
      file: this.state.file,
      media: this.state.media,
      token: this.state.token,
      userId: this.state.userId
    }
    this.state.storageData.push(data)
    this.setState({ storageData: this.state.storageData });
    const str = JSON.stringify(this.state.storageData);
    AsyncStorage.setItem(storageKey, str)
  }

  load() {
    AsyncStorage.getItem(storageKey).then((value) => {
      try {
        const data: Data[] = JSON.parse(value!);

        if (data.length > 0)
          this.setState({ storageData: data })
      } catch (error) {

      }
    })
  }

  show() {
    this.pop.current?.setView(
      <FlatList
        keyExtractor={this._extraUniqueKey}
        style={{}}
        data={this.state.storageData}
        ItemSeparatorComponent={() => {
          return (<View style={{ height: 1, backgroundColor: 'grey', marginTop: 5, marginBottom: 5 }} />)
        }}
        renderItem={(itemInfo: ListRenderItemInfo<Data>) => {
          const item = itemInfo.item
          return (
            <TouchableOpacity
              style={{ margin: 5, justifyContent: 'center' }}
              onPress={() => {
                this.setState({
                  key: item.key,
                  navigate: item.navigate,
                  file: item.file,
                  media: item.media,
                  token: item.token,
                })
                this.pop.current?.close()
              }}
            >
              <Text numberOfLines={1} style={{ fontSize: 18 }}>{`${item.key}_${item.userId}`}</Text>
            </TouchableOpacity>
          )
        }}
      />
    )
  }

  generate() {
    RRCLoading.show();
    let id = Config.prefix + Date.now();
    let key = Util.isEmpty(this.state.key) ? Config.key : this.state.key;
    let url = Config.host + 'token/' + id;

    console.log('url = ' + url);
    let params = { key: key };
    Util.post(url, params, (json) => {
      let token = json.token;
      if (!Util.isEmpty(token)) {
        this.setState({ key: key, token: token });
      } else {
        RRCToast.show('Get Token Error!');
      }
      RRCLoading.hide();
    }, (error) => {
      RRCToast.show('Network Error: ' + error);
      RRCLoading.hide();
    });
  }

  connect() {
    let token = this.state.token;
    if (Util.isEmpty(token)) {
      RRCToast.show('Token Should Not Be Null!');
      return;
    }

    RRCLoading.show();

    let key = this.state.key;
    let navigate = this.state.navigate;
    let file = this.state.file;

    let state: any = {};
    if (Util.isEmpty(key)) {
      key = Config.key;
      state.key = key;
    }
    if (Util.isEmpty(navigate)) {
      navigate = Config.navigate;
      state.navigate = navigate;
    }
    if (Util.isEmpty(file)) {
      file = Config.file;
      state.file = file;
    }

    // IM 初始化
    const options: RCIMIWEngineOptions = {
      naviServer: navigate,
      fileServer: file,
    };
    imEngine = RCIMIWEngine.create(key, options);

    // 设置连接回调
    imEngine?.setOnConnectedListener((code: number, userId: string) => {
      if (code === 0) {
        console.log('IM 连接成功 userId:' + userId);
        if (userId.length === 0) {
          RRCToast.show('IM Connect Error: ' + userId);
        } else {
          state.connected = true;
          state.userId = userId;
        }
        this.setState(state);
        this.save();
        RRCLoading.hide();
      } else {
        console.log('IM 连接失败,code: ' + code);
      }
    });

    // 连接融云 IM 服务器
    imEngine?.connect(token, 30)
    .then((code: number) => {
      if (code === 0) {
        console.log('connect 接口调用成功');
      } else {
        console.log('connect 接口调用失败', code);
      }
    });
  }

  disconnect() {
    imEngine?.disconnect(true)
    .then((code: number) => {
      if (code === 0) {
        this.setState({ connected: false });
      }
    });
    if (rtcEngine) {
      rtcEngine.destroy()
      rtcEngine = undefined
    }
  }

  join() {
    let id = this.state.room;
    if (Util.isEmpty(id)) {
      RRCToast.show(holders[this.state.roleType] + ' Should Not Be Null!');
      return;
    }
    RRCLoading.show();

    this.initRtc()
    
    rtcEngine?.setOnRoomJoinedListener((code: number, message: string) => {
      if (code != 0) {
        RRCToast.show('Join Room Error: ' + code + ", message:" + message);
      } else {
        this.props.navigation.navigate(Constants.screens[this.state.roleType], { roomId: this.state.room, userId: this.state.userId, mediaType: this.state.mediaType, switchRoleCallback: (roleType: RCRTCRole) => {
          setTimeout(() => {
            this.setState({roleType: roleType}, () => {
              this.join()
            })
          }, 500);
        }});
      }
      RRCLoading.hide();
    })
    Util.init();
    const roomSetup: RCRTCRoomSetup = {
      type: this.state.mediaType == 0 ? RCRTCMediaType.AudioVideo : RCRTCMediaType.Audio,
      role: this.state.roleType,
    }
    rtcEngine?.joinRoom(id, roomSetup).then((code: number) => {
      if (code != 0) {
        RRCToast.show('Join Room Error: ' + code);
        RRCLoading.hide();
      }
    });
  }

  initRtc () {
    let media = this.state.media;
    let videoSetup = {
      enableTinyStream: this.state.tiny,
    };
    let setup = Util.isEmpty(media) ? {
      videoSetup: videoSetup,
    } : {
      mediaUrl: media,
      videoSetup: videoSetup,
    };
    rtcEngine = RCRTCEngine.create(setup)
  }

  componentDidMount() {
    this.setOptions();
    this.load()
  }

  componentWillUnmount() {
    Util.unInit();
  }

  setOptions() {
    this.props.navigation.setOptions({
      headerTitle: '测试专用DEMO',
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{paddingHorizontal: 5}}
            onPress={() => {
              let media = this.state.media;
              let videoSetup = {
                enableTinyStream: this.state.tiny,
              };
              let setup = Util.isEmpty(media) ? {
                videoSetup: videoSetup,
              } : {
                mediaUrl: media,
                videoSetup: videoSetup,
              };
              rtcEngine = RCRTCEngine.create(setup)
              this.props.navigation.navigate('EquipmentTesting', {})
            }}>
            <Image source={{ uri: 'rong_icon_voice' }} style={{ width: 25, height: 25 }}></Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={{paddingHorizontal: 5}}
            onPress={() => {rcTipAlert.show()}}>
            <Image source={{ uri: 'rong_icon_info' }} style={{ width: 25, height: 25 }}></Image>
          </TouchableOpacity>
        </View>
      ),
    });
  }

  networkDetection() {
    this.initRtc()
    this.props.navigation.navigate('NetworkDetection', {});
  }

  render() {
    return (
      <ScrollView style={{flex: 1}}>
        <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 16  }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button disabled={this.state.storageData.length == 0} title='从用户缓存中选择' onPress={() => this.show()} />
            <Button disabled={this.state.storageData.length == 0} title='清空' onPress={() => this.clear()} />
          </View>
          <TextInput
            placeholderTextColor='grey'
            style={{ ...styles.input, marginTop: 16 }}
            autoCapitalize='none'
            placeholder='App key'
            defaultValue={this.state.key}
            onChangeText={(key) => {
              key = key.replace(/[^a-zA-Z0-9]/g, '');
              this.setState({ key: key });
            }} />

          <TextInput
            placeholderTextColor='grey'
            style={{ ...styles.input, marginTop: 16 }}
            autoCapitalize='none'
            placeholder='Navigate Url'
            defaultValue={this.state.navigate}
            onChangeText={(navigate) => {
              navigate = navigate.replace(/[^a-zA-Z0-9-_:\/.;+@=]/g, '');
              this.setState({ navigate: navigate });
            }} />


          <TextInput
            placeholderTextColor='grey'
            style={{ ...styles.input, marginTop: 16 }}
            autoCapitalize='none'
            placeholder='File Url'
            defaultValue={this.state.file}
            onChangeText={(file) => {
              file = file.replace(/[^a-zA-Z0-9-_:\/.;+@=]/g, '');
              this.setState({ file: file });
            }} />


          <TextInput
            placeholderTextColor='grey'
            style={{ ...styles.input, marginTop: 16 }}
            autoCapitalize='none'
            placeholder='Media Url'
            defaultValue={this.state.media}
            onChangeText={(media) => {
              media = media.replace(/[^a-zA-Z0-9-_:\/.;+@=]/g, '');
              this.setState({ media: media });
            }} />

          <View style={{ flexDirection: 'row', marginTop: 16 }}>
            <TextInput
              placeholderTextColor='grey'
              style={{ ...styles.input, flex: 1 }}
              autoCapitalize='none'
              placeholder='Token'
              defaultValue={this.state.token}
              onChangeText={(token) => {
                token = token.replace(/[^a-zA-Z0-9-_:\/.;+@=]/g, '');
                this.setState({ token: token });
              }} />
            {
              !this.state.connected &&
              <View style={{ marginLeft: 10 }}>
                <Button title='生成'
                  onPress={() => this.generate()} />
              </View>
            }
          </View>
          <View style={{alignSelf: 'flex-end', marginTop: 16}}>
            <TouchableOpacity
              style={{paddingHorizontal: 8, paddingVertical: 10, borderRadius: 2, borderWidth: 0.5, borderColor: '#000000'}}
              onPress={() => this.state.connected ? this.disconnect() : this.connect()}
            >
              <Text style={{}}>{this.state.connected ? '断开链接' : '链接'}</Text>
            </TouchableOpacity>
            {this.state.connected && 
                <TouchableOpacity
                style={{paddingHorizontal: 8, paddingVertical: 10, borderRadius: 2, borderWidth: 0.5, borderColor: '#000000', marginTop: 16}}
                onPress={() => {this.networkDetection()}}
              >
                <Text style={{}}>{'网络探测'}</Text>
              </TouchableOpacity>          
            }
            {/* {this.state.connected && 
                <TouchableOpacity
                style={{paddingHorizontal: 8, paddingVertical: 10, borderRadius: 2, borderWidth: 0.5, borderColor: '#000000', marginTop: 16}}
                onPress={() => {
                  rtcEngine?.preconnectToMediaServer()
                  RRCToast.show('操作了 预链接媒体服务器')
                }}
              >
                <Text style={{}}>{'预链接媒体服务器'}</Text>
              </TouchableOpacity>          
            } */}
          </View>

          {
            this.state.connected &&
            <View style={{ marginTop: 10 }}>
              <Radio
                items={[
                  { label: '会议模式', value: RCRTCRole.MeetingMember },
                  { label: '主播模式', value: RCRTCRole.LiveBroadcaster },
                  { label: '观众模式', value: RCRTCRole.LiveAudience },
                ]}
                value={this.state.roleType}

                onSelect={(value: number) => {
                  if (this.state.roleType != value) {
                    this.setState({ roleType: value, room: '', tiny: true, mediaType: 0 });
                  }
                }}
              />

              <TextInput
                placeholderTextColor='grey'
                style={{ ...styles.input, marginTop: 10 }}
                autoCapitalize='none'
                placeholder={holders[this.state.roleType] + '.'}
                defaultValue={this.state.room}
                onChangeText={(room) => {
                  room = room.replace(/[^a-zA-Z0-9]/g, '');
                  this.setState({ room: room });
                }} />
              {
                this.state.roleType === RCRTCRole.LiveBroadcaster &&
                <View style={{ marginTop: 10 }} >
                  <Radio
                    items={[
                      { label: '音视频模式', value: 0 },
                      { label: '纯音频模式', value: 1 },
                    ]}
                    value={this.state.mediaType}
                    onSelect={(value: number) => {
                      this.setState({ mediaType: value });
                    }}
                  />
                </View>
              }
              {
                (this.state.roleType === RCRTCRole.MeetingMember || this.state.roleType === RCRTCRole.LiveBroadcaster) &&
                <CheckBox
                  style={{ marginTop: 10 }}
                  text='开启大小流'
                  onValueChange={(value) => this.setState({ tiny: value })}
                  value={this.state.tiny} />
              }

              <View style={{ alignSelf: 'center', marginTop: 10 }}>
                <Button
                  title={types[this.state.roleType]}
                  onPress={() => this.join()} />
              </View>
            </View>
          }
          <Pop ref={this.pop} />
        </View>
        <RcTipAlert
            titleArr={['默认参数：', 'App Key: ' + Config.key, 'Nav Server: ' +  Config.navigate, 'File Server: ' + Config.file, 'Meadia Server:' + Config.media, 'Host: ' + Config.host, 'Prefix: ' + Config.prefix]}
            selectCallBack={(text: string, index: number) => {}}
            ref={(ref) => {
                rcTipAlert = ref!;
            }}
          />
      </ScrollView>
    )
  }
}

export default ConnectScreen;
