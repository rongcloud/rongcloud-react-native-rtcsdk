/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';

import type {
  Node
} from 'react';

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
  NativeEventEmitter,
} from 'react-native';

import {
  RRCToast,
  RRCLoading,
} from 'react-native-overlayer';

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from 'react-native-simple-radio-button';

import {
  CheckBox
} from '@react-native-community/checkbox';

import {
  NavigationContainer
} from '@react-navigation/native';

import {
  createStackNavigator
} from '@react-navigation/stack';

import {
  RCReactNativeIm
} from 'rc-react-native-im';

import {
  RCReactNativeRtc,
  RCReactNativeRtcView,
} from 'rc-react-native-rtc'

const KEY = 'z3v5yqkbv8v30';
const NAVIGATE = 'zav.cn.ronghub.com';
const FILE = 'up.qbox.me';
const MEDIA = '';
const HOST = 'http://120.92.13.87:8080/';
const PREFIX = 'rtd_';

const holders = [
  'Meeting Id',
  'Room Id',
  'Room Id',
];

const types = [
  '加入会议',
  '开始直播',
  '观看直播',
];

const screens = [
  'Meeting',
  'Meeting',
  'Meeting',
];

const options = { loadingImage: null, text: 'Loading...' };
RRCLoading.setLoadingOptions(options);
RRCLoading.hide();

const RCReactNativeRtcEventEmitter = new NativeEventEmitter(RCReactNativeRtc);

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
        this.props.navigation.navigate(screens[this.state.type], { content: this.state.room });
      }
      RRCLoading.hide();
    });

    this.state.extra.push(
      <View style={{ flexDirection: 'row', paddingLeft: 10, paddingBottom: 10 }}>
        {/* <CheckBox
          disabled={false}
          value={this.state.tiny}
          onValueChange={(checked) => {
            this.state.tiny = checked;
            this.setState(this.state);
          }}
        /> */}
        <Text style={styles.text}>开启大小流</Text>
      </View>
    );

    this.state.extra.push(
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.button}
          onPress={this.disconnect}>
          <Text style={styles.text}>断开链接</Text>
        </TouchableOpacity>
      </View>
    );
  }

  generate() {
    RRCLoading.show();
    let id = PREFIX + Date.now();
    let key = isEmpty(this.state.key) ? KEY : this.state.key;
    let url = HOST + 'token/' + id;
    let params = { key: key };
    post(url, params, (json) => {
      let token = json.token;
      if (!isEmpty(token)) {
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
    if (isEmpty(token)) {
      RRCToast.show('Token Should Not Be Null!');
      return;
    }

    RRCLoading.show();

    let key = this.state.key;
    let navigate = this.state.navigate;
    let file = this.state.file;

    let changed = false;
    if (isEmpty(key)) {
      key = KEY;
      this.state.key = key;
      changed = true;
    }
    if (isEmpty(navigate)) {
      navigate = NAVIGATE;
      this.state.navigate = navigate;
      changed = true;
    }
    if (isEmpty(file)) {
      file = FILE;
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
    if (isEmpty(id)) {
      RRCToast.show(holders[this.state.type] + ' Should Not Be Null!');
      return;
    }
    RRCLoading.show();
    let media = this.state.media;
    let videoSetup = {
      enableTinyStream: true, // TODO 小流
    };
    let setup = isEmpty(media) ? {
      videoSetup: videoSetup,
    } : {
      mediaUrl: 'media',
      videoSetup: videoSetup,
    };
    RCReactNativeRtc.init(setup).then(() => {
      RCReactNativeRtc.joinRoom(id, {
        type: 2, // TODO 音视频
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
      <View style={styles.column}>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder='App key'
            underlineColorAndroid={'transparent'}
            value={this.state.key}
            editable={false} />
        </View>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder='Navigate Url'
            underlineColorAndroid={'transparent'}
            value={this.state.navigate}
            editable={false} />
        </View>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder='File Url'
            underlineColorAndroid={'transparent'}
            value={this.state.file}
            editable={false} />
        </View>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder='Media Url'
            underlineColorAndroid={'transparent'}
            value={this.state.media}
            editable={false} />
        </View>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder='Token'
            underlineColorAndroid={'transparent'}
            value={this.state.token}
            editable={false} />
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.button}
            onPress={this.disconnect}>
            <Text style={styles.text}>断开链接</Text>
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
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder={holders[this.state.type] + '.'}
            underlineColorAndroid={'transparent'}
            value={this.state.room}
            onChangeText={(room) => {
              room = room.replace(/[^a-zA-Z0-9]/g, '');
              this.state.room = room;
              this.setState(this.state);
            }} />
        </View>
        {this.state.extra[this.state.type]}
        <View style={styles.row}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.button}
            onPress={this.join}>
            <Text style={styles.text}>{types[this.state.type]}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  unconnected() {
    return (
      <View style={styles.column}>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder='App key'
            underlineColorAndroid={'transparent'}
            value={this.state.key}
            onChangeText={(key) => {
              key = key.replace(/[^a-zA-Z0-9]/g, '');
              this.state.key = key;
              this.setState(this.state);
            }} />
        </View>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder='Navigate Url'
            underlineColorAndroid={'transparent'}
            value={this.state.navigate}
            onChangeText={(navigate) => {
              navigate = navigate.replace(/[^a-zA-Z0-9-_:\/.;+@=]/g, '');
              this.state.navigate = navigate;
              this.setState(this.state);
            }} />
        </View>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder='File Url'
            underlineColorAndroid={'transparent'}
            value={this.state.file}
            onChangeText={(file) => {
              file = file.replace(/[^a-zA-Z0-9-_:\/.;+@=]/g, '');
              this.state.file = file;
              this.setState(this.state);
            }} />
        </View>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            placeholder='Media Url'
            underlineColorAndroid={'transparent'}
            value={this.state.media}
            onChangeText={(media) => {
              media = media.replace(/[^a-zA-Z0-9-_:\/.;+@=]/g, '');
              this.state.media = media;
              this.setState(this.state);
            }} />
        </View>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
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
            style={styles.button}
            onPress={this.generate}>
            <Text style={styles.text}>生成</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.button}
            onPress={this.connect}>
            <Text style={styles.text}>链接</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    // return this.state.connected ? this.connected() : this.unconnected();
    return this.connected();
  }
}

class MeetingScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    RCReactNativeRtc.leaveRoom();
    RCReactNativeRtc.unInit();
  }

  render() {
    return (
      <View style={styles.column}>
      </View>
    );
  }
}

function isEmpty(str) {
  if (typeof str == "undefined" || str == null || str.length == 0 || str == '') {
    return true;
  } else {
    return false;
  }
}

function post(url, params, success, error) {
  let json = JSON.stringify(params);
  let init = {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: json
  };
  fetch(url, init)
    .then((response) => response.json())
    .then((json) => {
      success(json);
    })
    .catch((exception) => {
      error(exception);
    });
}

const Stack = createStackNavigator();

const App: () => Node = () => {
  const isDarkMode = false;

  const backgroundStyle = {
    backgroundColor: 'white',
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Connect'>
        <Stack.Screen
          name='Connect'
          component={ConnectScreen}
          options={{ title: '测试专用DEMO' }}
        />
        <Stack.Screen
          name='Meeting'
          component={MeetingScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'center',
  },
  column: {
    flexDirection: 'column',
    paddingTop: 10,
    paddingBottom: 10,
  },
  stack: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 2,
    fontSize: 25,
    borderColor: 'black',
    marginBottom: 16,
    paddingLeft: 10,
    padding: 0,
    borderWidth: 1,
    alignSelf: 'flex-start'
  },
  button: {
    color: 'black',
    backgroundColor: 'transparent',
    borderColor: 'black',
    borderWidth: 1,
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 5,
    paddingLeft: 5,
    alignSelf: 'flex-start'
  },
  text: {
    fontSize: 25,
    color: 'black',
  },
});

export default App;
