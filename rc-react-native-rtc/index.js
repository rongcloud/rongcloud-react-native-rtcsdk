
import { NativeModules, requireNativeComponent } from 'react-native';

const { RCReactNativeRtc, RCReactNativeRtcView } = NativeModules;

module.exports = {
	RCReactNativeRtc,
    RCReactNativeRtcView
};
