import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    SafeAreaView,
    findNodeHandle,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Image
} from 'react-native';

import { 
    RCReactNativeCall,
    RCReactNativeCallVideoView
} from 'rc-react-native-call';

class Room extends Component {

    constructor(props) {
        super(props);

        this.viewHandles = {
            bigView: null,
            smallViews: []
        };
    }

    componentDidMount(){
        const options = this.props.route.params.options;
        try {
            this.startCall(options);
        } catch (e) {
            alert(e.message);
        }
    }

    async startCall(options) {
        if (options.isCallOut) {
            const userIds = options.userIds;
            if (userIds.length == 0) {
                return;
            }
            if (userIds.length > 1) {
                await RCReactNativeCall.startGroupCall(userIds[0],userIds,null,1,null);
            } else {
                await RCReactNativeCall.startSingleCall(userIds[0], 1, null);
            }
            const callSession = await RCReactNativeCall.getCurrentCallSession();
            const userId = callSession.mine.userId;
            this.onSetVideoView(userId, this.viewHandles.bigView);
        }
    }

    onSetVideoView(userId,ref) {
        RCReactNativeCall.setVideoView(userId, ref, 1);
    }
    
    test() {
        // if (userIds.length > 1) {
            
        // } else {
            /*
            用户id
            media type: 0 音频, 1 音视频    
            extra
            */ 
            // 
        // }
    }

    onHangup() {
        RCReactNativeCall.hangup();
        this.onGoBack();
    }

    onGoBack() {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={styles.container}>
                <RCReactNativeCallVideoView 
                    style={styles.bigVideo}
                    ref={ref => { this.viewHandles.bigView = findNodeHandle(ref); }}>
                </RCReactNativeCallVideoView>
                <View style={styles.content}>
                    <SafeAreaView style={{flex: 1}}>
                        <View style={styles.topView}>
                            <TouchableOpacity
                                style={styles.btnHangup}
                                onPress={ this.onHangup.bind(this) }>
                                <Image style={{flex: 1}} source={require('./images/hang_up.png')} />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    bigVideo: {
        backgroundColor: '#000',
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    content: {
        height: '100%',
        width: '100%'
    },
    topView: {
        flex: 1,
        flexDirection: 'column-reverse',
        alignItems: 'center'
    },
    btnHangup: {
        width: 65,
        height: 65,
    }
});

export default Room;

/*

import React, { Component } from 'react';
import {
  Button,
  View,
  SafeAreaView,
  findNodeHandle
} from 'react-native';

import {
  RCReactNativeCall,
  RCReactNativeCallVideoView
} from 'rc-react-native-call';

import Room from './src/room';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      goto: false
    };
  }

  onclickbutton() {
    // RCReactNativeCall.ManagerEmitter.removeAllListeners("Engine:OnReceiveCall");
    this.setState({
      goto: !this.state.goto
    })
  }

  componentDidMount() {

    RCReactNativeCall.ManagerEmitter.addListener("Engine:OnReceiveCall", (session) => {
      alert(session);
    });

  }

  componentWillUnmount() {
    RCReactNativeCall.ManagerEmitter.removeAllListeners("Engine:OnReceiveCall");
  }

  callback() {
    this.setState({
      goto: !this.state.goto
    })
  }

  renderView = (goto) => {
    switch(goto) {
      case false:
        return (
          <View style={{flex: 1}}>
            <Button title="按钮" color='red' style={{padding: 100, width: 100, height: 80}} onPress={this.onclickbutton.bind(this)}/>
            <RCReactNativeCallVideoView ref={ref => { this._callView = findNodeHandle(ref); }} style={{width: 200, height: 200}} />
          </View>
        )
      case true:
        return (
          // <View style={{flex: 1}}>
          //   <Button title="返回" color='blue' style={{padding: 100, width: 100, height: 80}} onPress={this.onclickbutton.bind(this)}/>
          //   <RCReactNativeCallVideoView ref={ref => { this._callView = findNodeHandle(ref); }} style={{width: 200, height: 200}} />
          // </View>
          <Room onaction={ this.callback.bind(this) }/>
        )
    }
  }

  render() {

    const {goto} = this.state;

    return (
      <SafeAreaView style={{flex: 1}}>
        { this.renderView(goto) }
      </SafeAreaView>
    )
  }
};

export default App;

*/