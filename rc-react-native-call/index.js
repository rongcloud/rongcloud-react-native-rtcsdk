import {
    NativeModules, 
    requireNativeComponent,
    NativeEventEmitter
} from 'react-native';

const { RCReactNativeCall } = NativeModules;
RCReactNativeCall.ManagerEmitter = new NativeEventEmitter(RCReactNativeCall);

const RCReactNativeCallVideoView = requireNativeComponent('RCReactNativeCallVideoView');

module.exports = {
    RCReactNativeCall,
    RCReactNativeCallVideoView
};
