import PropTypes from "prop-types";
import { NativeModules, View, requireNativeComponent } from 'react-native';

const { RCReactNativeRtc } = NativeModules;

const RCReactNativeRtcView = requireNativeComponent('RCReactNativeRtcView', {
    propTypes: {
        fitType: PropTypes.number,
        mirror: PropTypes.bool,
        ...View.propTypes
    }
});

module.exports = {
    RCReactNativeRtc,
    RCReactNativeRtcView
};
