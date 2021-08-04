
import React from 'react';

import * as Util from './util';
import * as UI from './ui';
import * as Constants from './constants'

import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  findNodeHandle,
} from 'react-native';

import {
  RRCToast,
  RRCLoading,
} from 'react-native-overlayer';

import RadioForm from 'react-native-simple-radio-button';

import CheckBox from '@react-native-community/checkbox';

import Icon from 'react-native-vector-icons/dist/FontAwesome';

import RNPickerSelect from 'react-native-picker-select';

import {
  RCReactNativeRtc,
  RCReactNativeRtcView,
  RCReactNativeRtcEventEmitter
} from 'rc-react-native-rtc'

class AudienceScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      local: null,
      media: 2,
      tiny: false,
      speaker: false,
      subscribed: false,
    };

    this.listeners = [];
    this.remotes = new Map();

    // RRCLoading.hide();

    this.listeners.push(
      RCReactNativeRtcEventEmitter.addListener('Engine:OnLiveMixSubscribed', (event) => {
        let type = event.type;
        let code = event.code;
        let message = event.message;
        if (code != 0) {
          RRCToast.show('Subscribe Live Mix ' + (Constants.media[type]) + ' Error: ' + code + ', message: ' + message);
        } else {
          RCReactNativeRtc.setLiveMixView(this.state.local);
          this.setState({ subscribed: true });
        }
        RRCLoading.hide();
      })
    );

    this.listeners.push(
      RCReactNativeRtcEventEmitter.addListener('Engine:OnLiveMixUnsubscribed', (event) => {
        let type = event.type;
        let code = event.code;
        let message = event.message;
        if (code != 0) {
          RRCToast.show('Unsubscribe Live Mix ' + (Constants.media[type]) + ' Error: ' + code + ', message: ' + message);
        } else {
          RCReactNativeRtc.removeLiveMixView();
          this.setState({ subscribed: false });
        }
        RRCLoading.hide();
      })
    );

    this.props.navigation.setOptions({
      headerTitle: '观看直播:' + this.props.route.params.room,
      headerRight: () => (
        <View style={UI.styles.row}>
          <Icon.Button
            name="comments"
            backgroundColor='transparent'
            underlayColor='lightblue'
            color='blue'
            iconStyle={{ marginRight: 0 }}
            onPress={() => {
              // TODO 聊天室
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
        <RadioForm
          style={{
            marginTop: 10,
            alignSelf: 'center',
          }}
          radio_props={[
            { label: '        音频        ', value: 0 },
            { label: '        视频        ', value: 1 },
            { label: '       音视频       ', value: 2 },
          ]}
          initial={this.state.media}
          formHorizontal={true}
          labelHorizontal={false}
          animation={false}
          onPress={(value) => {
            if (this.state.media != value) {
              this.state.media = value;
              this.setState(this.state);
            }
          }}
        />
        <View style={{ height: 10 }} />
        <View style={UI.styles.row}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ tiny: !this.state.tiny });
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckBox
                style={{ width: 15, height: 15 }}
                disabled={true}
                value={this.state.tiny}
              />
              <View style={{ width: 2 }} />
              <Text style={UI.styles.text, { fontSize: 15 }}>订阅小流</Text>
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
              if (!this.state.subscribed) {
                let code = await RCReactNativeRtc.subscribeLiveMix(this.state.media, this.state.tiny);
                if (code != 0) {
                  RRCToast.show('Subscribe Live Mix ' + (Constants.media[this.state.media]) + ' Error: ' + code);
                  RRCLoading.hide();
                }
              } else {
                let code = await RCReactNativeRtc.unsubscribeLiveMix(2);
                if (code != 0) {
                  RRCToast.show('Unsubscribe Live Mix Error: ' + code);
                  RRCLoading.hide();
                }
              }
            }}>
            <Text style={UI.styles.text}>{this.state.subscribed ? '取消订阅' : '订阅'}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 10 }} />
        <View style={{ height: 300, backgroundColor: 'black', overflow: 'hidden' }}>
          <RCReactNativeRtcView
            style={{
              width: '100%', height: 300
            }}
            ref={ref => {
              this.state.local = findNodeHandle(ref);
            }}
            mirror={false}
          />
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
      </View >
    );
  }

}

export default AudienceScreen;
