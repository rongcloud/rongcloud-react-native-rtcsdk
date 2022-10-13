import {HostComponent,
    requireNativeComponent,
    ViewProps} from "react-native";

interface HostProps extends ViewProps {
    mirror?: boolean,
        fitType?: RCRTCViewFitType
}

const RCReactNativeRtcView: HostComponent<HostProps> = requireNativeComponent('RCReactNativeRtcView');

import {
    RCRTCAudioConfig,
    RCRTCCustomLayout,
    RCRTCEngineSetup,
    RCRTCRoomSetup,
    RCRTCVideoConfig,
    RCRTCAudioMixingMode,
    RCRTCCamera,
    RCRTCCameraCaptureOrientation,
    RCRTCErrorCode,
    RCRTCLiveMixLayoutMode,
    RCRTCLiveMixRenderMode,
    RCRTCMediaType,
    RCRTCVideoResolution,
    RCRTCViewFitType,
    RCRTCNetworkType,
    RCRTCStreamType,
    RCRTCAudioSetup,
    RCRTCVideoSetup,
    RCRTCAudioCodecType,
    RCRTCAudioSource,
    RCRTCAudioSampleRate,
    RCRTCAudioQuality,
    RCRTCAudioScenario,
    RCRTCVideoCodecType,
    RCRTCLocalAudioStats,
    RCRTCLocalVideoStats,
    RCRTCNetworkStats,
    RCRTCRemoteAudioStats,
    RCRTCRemoteVideoStats
} from './RCRTCDefines';

export {
    RCReactNativeRtcView,
    RCRTCLocalAudioStats,
    RCRTCLocalVideoStats,
    RCRTCNetworkStats,
    RCRTCRemoteAudioStats,
    RCRTCRemoteVideoStats,
    RCRTCEngineSetup,
    RCRTCAudioSetup,
    RCRTCVideoSetup,
    RCRTCRoomSetup,
    RCRTCAudioConfig,
    RCRTCVideoConfig,
    RCRTCCustomLayout,
    RCRTCErrorCode,
    RCRTCAudioCodecType,
    RCRTCAudioSource,
    RCRTCAudioSampleRate,
    RCRTCMediaType,
    RCRTCAudioQuality,
    RCRTCAudioScenario,
    RCRTCVideoResolution,
    RCRTCViewFitType,
    RCRTCCamera,
    RCRTCCameraCaptureOrientation,
    RCRTCLiveMixLayoutMode,
    RCRTCLiveMixRenderMode,
    RCRTCAudioMixingMode,
    RCRTCNetworkType,
    RCRTCVideoCodecType,
    RCRTCStreamType
}

import {
    logger
} from './Logger';
import {
    RCRTCRole,
    RCRTCVideoFps
} from './RCRTCDefines';
import {
    RCRTCEngine
} from './RCRTCEngine';
export {logger,
    RCRTCRole,
    RCRTCVideoFps,
    RCRTCEngine
}
