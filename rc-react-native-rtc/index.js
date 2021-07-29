import PropTypes from "prop-types";
import {
    NativeModules,
    View,
    requireNativeComponent,
    Platform,
    NativeEventEmitter,
    DeviceEventEmitter,
} from 'react-native';

const { RCReactNativeRtc } = NativeModules;

const RCReactNativeRtcView = requireNativeComponent('RCReactNativeRtcView', {
    propTypes: {
        fitType: PropTypes.number,
        mirror: PropTypes.bool,
        ...View.propTypes
    }
});

const RCReactNativeRtcEventEmitter = Platform.OS === 'ios' ? new NativeEventEmitter(RCReactNativeRtc) : DeviceEventEmitter;

module.exports = {
    RCReactNativeRtc,
    RCReactNativeRtcView,
    RCReactNativeRtcEventEmitter
};
