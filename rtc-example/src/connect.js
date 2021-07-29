
import React from 'react';

import * as Config from './config';
import * as Util from './util';
import * as UI from './ui';
import * as Constants from './constants'

import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';

import {
  RRCToast,
  RRCLoading,
} from 'react-native-overlayer';

import RadioForm from 'react-native-simple-radio-button';

import CheckBox from '@react-native-community/checkbox';

import {
  RCReactNativeIm
} from 'rc-react-native-im';

import {
  RCReactNativeRtc,
  RCReactNativeRtcEventEmitter,
} from 'rc-react-native-rtc'

class ConnectScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: '',
      navigate: '',
      file: '',
      media: '',
      token: '',
      connected: false,
      type: 0,
      room: '',
      tiny: true,
      mode: 0,
      extra: [],
    };
    RCReactNativeIm.disconnect();
    this.generate = this.generate.bind(this);
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.join = this.join.bind(this);

    RCReactNativeRtcEventEmitter.addListener('Engine:OnRoomJoined', (data) => {
      let code = data.code;
      let message = data.message;
      if (code != 0) {
        RRCToast.show('Join Room Error: ' + code + ", message:" + message);
      } else {
        this.props.navigation.navigate(Constants.screens[this.state.type], { content: this.state.room });
      }
      RRCLoading.hide();
    });

    this.state.extra.push(
      <View style={{ flexDirection: 'row', paddingLeft: 10, paddingBottom: 10, alignItems: 'center' }}>
        <CheckBox
          disabled={false}
          value={this.state.tiny}
          onValueChange={(checked) => {
            this.state.tiny = checked;
            this.setState(this.state);
          }}
        />
        <View style={{ width: 10 }} />
        <Text style={UI.styles.text}>开启大小流</Text>
      </View>
    );

    this.state.extra.push(
      <View style={UI.styles.column}>
        <RadioForm
          style={{
            marginTop: -20,
            alignSelf: 'center',
          }}
          radio_props={[
            { label: '音视频模式', value: 0 },
            { label: '纯音频模式', value: 1 },
          ]}
          initial={this.state.mode}
          formHorizontal={true}
          labelHorizontal={false}
          animation={false}
          onPress={(value) => {
            if (this.state.mode != value) {
              this.state.mode = value;
              this.setState(this.state);
            }
          }}
        />
        <View style={{ flexDirection: 'row', paddingLeft: 10, paddingBottom: 10, alignItems: 'center' }}>
          <CheckBox
            disabled={false}
            value={this.state.tiny}
            onValueChange={(checked) => {
              this.state.tiny = checked;
              this.setState(this.state);
            }}
          />
          <View style={{ width: 10 }} />
          <Text style={UI.styles.text}>开启大小流</Text>
        </View>
      </View>
    );
  }

  generate() {
    RRCLoading.show();
    let id = Config.prefix + Date.now();
    let key = Util.isEmpty(this.state.key) ? Config.key : this.state.key;
    let url = Config.host + 'token/' + id;
    let params = { key: key };
    Util.post(url, params, (json) => {
      let token = json.token;
      if (!Util.isEmpty(token)) {
        this.state.key = key;
        this.state.token = token;
        this.setState(this.state);
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

    let changed = false;
    if (Util.isEmpty(key)) {
      key = Config.key;
      this.state.key = key;
      changed = true;
    }
    if (Util.isEmpty(navigate)) {
      navigate = Config.navigate;
      this.state.navigate = navigate;
      changed = true;
    }
    if (Util.isEmpty(file)) {
      file = Config.file;
      this.state.file = file;
      changed = true;
    }

    RCReactNativeIm.setServerInfo(navigate, file);
    RCReactNativeIm.init(key);
    RCReactNativeIm.connect(token).then((event) => {
      let error = event.error;
      if (error != 0) {
        RRCToast.show('IM Connect Error: ' + error);
      } else {
        this.state.connected = true;
        changed = true;
      }
      if (changed) {
        this.setState(this.state);
      }
      RRCLoading.hide();
    });
  }

  disconnect() {
    RCReactNativeIm.disconnect();
    this.state.connected = false;
    this.setState(this.state);
  }

  join() {
    let id = this.state.room;
    if (Util.isEmpty(id)) {
      RRCToast.show(Constants.holders[this.state.type] + ' Should Not Be Null!');
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
      mediaUrl: 'media',
      videoSetup: videoSetup,
    };
    RCReactNativeRtc.init(setup).then(() => {
      RCReactNativeRtc.joinRoom(id, {
        type: this.state.mode == 0 ? 2 : 0,
        role: this.state.type,
      }).then((code) => {
        if (code != 0) {
          RRCToast.show('Join Room Error: ' + code);
          RRCLoading.hide();
        }
      });
    });
  }

  connected() {
    return (
      <View style={UI.styles.column}>
        <View style={UI.styles.row}>
          <TextInput
            style={UI.styles.input}
            placeholder='App key'
            underlineColorAndroid={'transparent'}
            value={this.state.key}
            editable={false} />
        </View>
        <View style={UI.styles.row}>
          <TextInput
            style={UI.styles.input}
            placeholder='Navigate Url'
            underlineColorAndroid={'transparent'}
            value={this.state.navigate}
            editable={false} />
        </View>
        <View style={UI.styles.row}>
          <TextInput
            style={UI.styles.input}
            placeholder='File Url'
            underlineColorAndroid={'transparent'}
            value={this.state.file}
            editable={false} />
        </View>
        <View style={UI.styles.row}>
          <TextInput
            style={UI.styles.input}
            placeholder='Media Url'
            underlineColorAndroid={'transparent'}
            value={this.state.media}
            editable={false} />
        </View>
        <View style={UI.styles.row}>
          <TextInput
            style={UI.styles.input}
            placeholder='Token'
            underlineColorAndroid={'transparent'}
            value={this.state.token}
            editable={false} />
        </View>
        <View style={UI.styles.row}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={UI.styles.button}
            onPress={this.disconnect}>
            <Text style={UI.styles.text}>断开链接</Text>
          </TouchableOpacity>
        </View>
        <RadioForm
          style={{
            marginTop: 30,
            alignSelf: 'center',
          }}
          radio_props={[
            { label: '会议模式', value: 0 },
            { label: '主播模式', value: 1 },
            { label: '观众模式', value: 2 },
          ]}
          initial={this.state.type}
          formHorizontal={true}
          labelHorizontal={false}
          animation={false}
          onPress={(value) => {
            if (this.state.type != value) {
              this.state.type = value;
              this.state.room = '';
              this.state.tiny = true;
              this.state.mode = 0;
              this.setState(this.state);
            }
          }}
        />
        <View style={UI.styles.row}>
          <TextInput
            style={UI.styles.input}
            placeholder={Constants.holders[this.state.type] + '.'}
            underlineColorAndroid={'transparent'}
            value={this.state.room}
            onChangeText={(room) => {
              room = room.replace(/[^a-zA-Z0-9]/g, '');
              this.state.room = room;
              this.setState(this.state);
            }} />
        </View>
        {this.state.extra[this.state.type]}
        <View style={UI.styles.row}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={UI.styles.button}
            onPress={this.join}>
            <Text style={UI.styles.text}>{Constants.types[this.state.type]}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  unconnected() {
    return (
      <View style={UI.styles.column}>
        <View style={UI.styles.row}>
          <TextInput
            style={UI.styles.input}
            placeholder='App key'
            underlineColorAndroid={'transparent'}
            value={this.state.key}
            onChangeText={(key) => {
              key = key.replace(/[^a-zA-Z0-9]/g, '');
              this.state.key = key;
              this.setState(this.state);
            }} />
        </View>
        <View style={UI.styles.row}>
          <TextInput
            style={UI.styles.input}
            placeholder='Navigate Url'
            underlineColorAndroid={'transparent'}
            value={this.state.navigate}
            onChangeText={(navigate) => {
              navigate = navigate.replace(/[^a-zA-Z0-9-_:\/.;+@=]/g, '');
              this.state.navigate = navigate;
              this.setState(this.state);
            }} />
        </View>
        <View style={UI.styles.row}>
          <TextInput
            style={UI.styles.input}
            placeholder='File Url'
            underlineColorAndroid={'transparent'}
            value={this.state.file}
            onChangeText={(file) => {
              file = file.replace(/[^a-zA-Z0-9-_:\/.;+@=]/g, '');
              this.state.file = file;
              this.setState(this.state);
            }} />
        </View>
        <View style={UI.styles.row}>
          <TextInput
            style={UI.styles.input}
            placeholder='Media Url'
            underlineColorAndroid={'transparent'}
            value={this.state.media}
            onChangeText={(media) => {
              media = media.replace(/[^a-zA-Z0-9-_:\/.;+@=]/g, '');
              this.state.media = media;
              this.setState(this.state);
            }} />
        </View>
        <View style={UI.styles.row}>
          <TextInput
            style={UI.styles.input}
            placeholder='Token'
            underlineColorAndroid={'transparent'}
            value={this.state.token}
            onChangeText={(token) => {
              token = token.replace(/[^a-zA-Z0-9-_:\/.;+@=]/g, '');
              this.state.token = token;
              this.setState(this.state);
            }} />
          <View style={{ width: 10 }} />
          <TouchableOpacity
            activeOpacity={0.5}
            style={UI.styles.button}
            onPress={this.generate}>
            <Text style={UI.styles.text}>生成</Text>
          </TouchableOpacity>
        </View>
        <View style={UI.styles.row}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={UI.styles.button}
            onPress={this.connect}>
            <Text style={UI.styles.text}>链接</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    return this.state.connected ? this.connected() : this.unconnected();
  }
}

export default ConnectScreen;
