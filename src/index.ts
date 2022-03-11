import RCRTCEngine from "./RCRTCEngine";
import Logger from "./Logger";
import { HostComponent, requireNativeComponent, ViewProps } from "react-native";


interface HostProps extends ViewProps {
    mirror?: boolean,
    fitType?: RCRTCViewFitType
}

const RCReactNativeRtcView: HostComponent<HostProps> = requireNativeComponent('RCReactNativeRtcView');

import type {
    RCRTCLocalAudioStats,
    RCRTCLocalVideoStats,
    RCRTCNetworkStats,
    RCRTCRemoteAudioStats,
    RCRTCRemoteVideoStats,
} from './RCRTCStatsEventsInterface';


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
    RCRTCVideoFps,
    RCRTCVideoResolution,
    RCRTCViewFitType,
    RCRTCRole,
    RCRTCNetworkType,
    RCRTCStreamType,
    RCRTCAudioSetup,
    RCRTCVideoSetup,
    RCRTCAudioCodecType,
    RCRTCAudioSource,
    RCRTCAudioSampleRate,
    RCRTCAudioQuality,
    RCRTCAudioScenario,
    RCRTCVideoCodecType
} from './RCRTCDefines';



export {
    Logger,
    RCRTCEngine,
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
    RCRTCRole,
    RCRTCAudioQuality,
    RCRTCAudioScenario,
    RCRTCVideoFps,
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
