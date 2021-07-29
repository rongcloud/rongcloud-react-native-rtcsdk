import {
    NativeModules, 
    requireNativeComponent,
    NativeEventEmitter,
    DeviceEventEmitter,
    Platform
} from 'react-native';

const { RCReactNativeCall } = NativeModules;

if (Platform.OS === "android") {
    RCReactNativeCall.ManagerEmitter = DeviceEventEmitter;
} else {
    RCReactNativeCall.ManagerEmitter = new NativeEventEmitter(RCReactNativeCall);
}

const RCReactNativeCallVideoView = requireNativeComponent('RCReactNativeCallVideoView');

module.exports = {
    RCReactNativeCall,
    RCReactNativeCallVideoView
};
