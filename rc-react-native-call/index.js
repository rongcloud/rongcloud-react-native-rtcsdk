
import { NativeModules, requireNativeComponent } from 'react-native';

const { RCReactNativeCall } = NativeModules;
const RCReactNativeCallVideoView = requireNativeComponent('RCReactNativeCallVideoView');

module.exports = {
    RCReactNativeCall,
    RCReactNativeCallVideoView
};
