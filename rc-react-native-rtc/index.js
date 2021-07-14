
import { NativeModules, requireNativeComponent } from 'react-native';

const { RCReactNativeRtc } = NativeModules;

const { RCReactNativeRtcView } = requireNativeComponent('RCReactNativeRtcView');

export default RCReactNativeRtc;
export {
    RCReactNativeRtcView
};
