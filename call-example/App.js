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