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

} from 'react-native';

import {
  RRCToast,
  RRCLoading,
} from 'react-native-overlayer';
import * as IMLib from '@rongcloud/react-native-imlib'

import {
  RCRTCEngine, RCRTCMediaType, RCRTCRole, RCRTCRoomSetup
} from '@rongcloud/react-native-rtc'
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Radio from '../component/Radio';
import CheckBox from '../component/CheckBox';
import Pop from "../component/Pop";
import AsyncStorage from '@react-native-community/async-storage';

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
    IMLib.disconnect();

    RCRTCEngine.setOnRoomJoinedListener((code: number, message: string) => {
      if (code != 0) {
        RRCToast.show('Join Room Error: ' + code + ", message:" + message);
      } else {
        this.props.navigation.navigate(Constants.screens[this.state.roleType], { roomId: this.state.room, userId: this.state.userId });
      }
      RRCLoading.hide();
    })
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

    IMLib.setServerInfo(navigate, file)

    IMLib.init(key)

    IMLib.connect(token, (userId) => {
      console.log('IM连接成功 userId ->' + userId)

      if (userId.length == 0) {
        RRCToast.show('IM Connect Error: ' + userId);
      } else {
        state.connected = true;
        state.userId = userId;
      }
      this.setState(state);
      this.save()
      RRCLoading.hide();
    }, (code) => {
      console.log('连接失败  code -> ' + code)
    }, () => { })
  }

  disconnect() {
    IMLib.disconnect();
    this.setState({ connected: false });
  }

  join() {
    let id = this.state.room;
    if (Util.isEmpty(id)) {
      RRCToast.show(holders[this.state.roleType] + ' Should Not Be Null!');
      return;
    }
    RRCLoading.show();
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


    RCRTCEngine.init(setup).then(() => {
      Util.init();
      const setup: RCRTCRoomSetup = {
        type: this.state.mediaType == 0 ? RCRTCMediaType.AudioVideo : RCRTCMediaType.Audio,
        role: this.state.roleType,
      }
      RCRTCEngine.joinRoom(id, setup).then((code) => {
        if (code != 0) {
          RRCToast.show('Join Room Error: ' + code);
          RRCLoading.hide();
        }
      });
    });
  }
  componentDidMount() {
    this.load()
  }

  componentWillUnmount() {
    Util.unInit();
  }

  render() {
    return (
      <View style={{ padding: 10 }}>
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
        <View style={{ alignSelf: 'center', marginTop: 16 }}>
          <Button
            title={this.state.connected ? '断开链接' : '链接'}
            onPress={() => this.state.connected ? this.disconnect() : this.connect()} />
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
    )
  }
}

export default ConnectScreen;
