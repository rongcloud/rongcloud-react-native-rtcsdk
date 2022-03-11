import type {
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
   RCRTCRole
} from './RCRTCDefines';

import {
   RCRTCEngineEventsInterface,
   RCRTCEngineEventsName,
} from './RCRTCEngineEventsInterface';

import type RCRTCEngineInterface from './RCRTCEngineInterface';
import {
   RCRTCLocalAudioStats,
   RCRTCLocalVideoStats,
   RCRTCNetworkStats,
   RCRTCRemoteAudioStats,
   RCRTCRemoteVideoStats,
   RCRTCStatsEventsInterface,
   RCRTCStatsEventsName
} from './RCRTCStatsEventsInterface';

import Logger from './Logger'


import {
   NativeModules,
   Platform,
   NativeEventEmitter,
   DeviceEventEmitter,
} from 'react-native';

const { RCReactNativeRtc } = NativeModules;

const RCReactNativeEventEmitter = Platform.OS === 'ios' ? new NativeEventEmitter(RCReactNativeRtc) : DeviceEventEmitter;

class RCRTCEngineImpl implements
   RCRTCEngineInterface,
   RCRTCEngineEventsInterface,
   RCRTCStatsEventsInterface {


   init(setup: RCRTCEngineSetup): Promise<null> {
      Logger.log(`init setup=${Logger.toString(setup)}`);
      return RCReactNativeRtc.init(setup);
   }


   unInit(): Promise<null> {
      Logger.log(`unInit`);
      return RCReactNativeRtc.unInit();
   }


   joinRoom(roomId: string, setup: RCRTCRoomSetup): Promise<null> {
      Logger.log(`joinRoom roomId=${roomId}, setup=${Logger.toString(setup)}`);
      return RCReactNativeRtc.joinRoom(roomId, setup);
   }


   leaveRoom(): Promise<RCRTCErrorCode> {
      Logger.log(`leaveRoom`);
      return RCReactNativeRtc.leaveRoom();
   }



   publish(type: RCRTCMediaType): Promise<RCRTCErrorCode> {
      Logger.log(`publish type=${type}`);
      return RCReactNativeRtc.publish(type);
   }


   unpublish(type: RCRTCMediaType): Promise<RCRTCErrorCode> {
      Logger.log(`unpublish type=${type}`);
      return RCReactNativeRtc.unpublish(type);
   }


   subscribe(userId: string, type: RCRTCMediaType, tiny: boolean): Promise<RCRTCErrorCode> {
      Logger.log(`subscribe userId=${userId}, type=${type}, tiny=${tiny}`);
      return RCReactNativeRtc.subscribe(userId, type, tiny);
   }


   subscribes(userIds: string[], type: RCRTCMediaType, tiny: boolean): Promise<RCRTCErrorCode> {
      Logger.log(`subscribes userIds=${userIds}, type=${type}, tiny=${tiny}`);
      return RCReactNativeRtc.subscribes(userIds, type, tiny);
   }


   unsubscribe(userId: string, type: RCRTCMediaType): Promise<RCRTCErrorCode> {
      Logger.log(`unsubscribe userId=${userId}, type=${type}`);
      return RCReactNativeRtc.unsubscribe(userId, type);
   }


   unsubscribes(userIds: string[], type: RCRTCMediaType): Promise<RCRTCErrorCode> {
      Logger.log(`unsubscribes userIds=${userIds}, type=${type}`);
      return RCReactNativeRtc.unsubscribes(userIds, type);
   }


   subscribeLiveMix(type: RCRTCMediaType, tiny: boolean): Promise<RCRTCErrorCode> {
      Logger.log(`subscribeLiveMix type=${type}, tiny=${tiny}`);
      return RCReactNativeRtc.subscribeLiveMix(type, tiny);
   }


   unsubscribeLiveMix(type: RCRTCMediaType): Promise<RCRTCErrorCode> {
      Logger.log(`unsubscribeLiveMix type=${type}`);
      return RCReactNativeRtc.unsubscribeLiveMix(type);
   }


   setAudioConfig(config: RCRTCAudioConfig): Promise<RCRTCErrorCode> {
      Logger.log(`setAudioConfig config=${Logger.toString(config)}`);
      return RCReactNativeRtc.setAudioConfig(config);
   }


   setVideoConfig(config: RCRTCVideoConfig, tiny: boolean = false): Promise<RCRTCErrorCode> {
      Logger.log(`setVideoConfig config=${Logger.toString(config)}, tiny=${tiny}`);
      return RCReactNativeRtc.setVideoConfig(config, tiny);
   }


   enableMicrophone(enable: boolean): Promise<RCRTCErrorCode> {
      Logger.log(`enableMicrophone enable=${enable}`);
      return RCReactNativeRtc.enableMicrophone(enable);
   }


   enableSpeaker(enable: boolean): Promise<RCRTCErrorCode> {
      Logger.log(`enableSpeaker enable=${enable}`);
      return RCReactNativeRtc.enableSpeaker(enable);
   }


   adjustLocalVolume(volume: number): Promise<RCRTCErrorCode> {
      Logger.log(`adjustLocalVolume volume=${volume}`);
      return RCReactNativeRtc.adjustLocalVolume(volume);
   }


   enableCamera(enable: boolean, camera: RCRTCCamera): Promise<RCRTCErrorCode> {
      Logger.log(`enableCamera enable=${enable}, camera=${camera}`);
      return RCReactNativeRtc.enableCamera(enable, camera);
   }


   switchCamera(): Promise<RCRTCErrorCode> {
      Logger.log(`switchCamera`);
      return RCReactNativeRtc.switchCamera();
   }



   switchToCamera(camera: RCRTCCamera): Promise<RCRTCErrorCode> {
      Logger.log(`switchToCamera camera=${camera}`);
      return RCReactNativeRtc.switchToCamera(camera);
   }



   whichCamera(): Promise<RCRTCCamera> {
      Logger.log(`whichCamera`);
      return RCReactNativeRtc.whichCamera();
   }


   isCameraFocusSupported(): Promise<boolean> {
      Logger.log(`isCameraFocusSupported`);
      return RCReactNativeRtc.isCameraFocusSupported();
   }


   isCameraExposurePositionSupported(): Promise<boolean> {
      Logger.log(`isCameraExposurePositionSupported`);
      return RCReactNativeRtc.isCameraExposurePositionSupported();
   }


   setCameraFocusPositionInPreview(x: number, y: number): Promise<RCRTCErrorCode> {
      Logger.log(`setCameraFocusPositionInPreview x=${x}, y=${y}`);
      return RCReactNativeRtc.setCameraFocusPositionInPreview(x, y);
   }


   setCameraExposurePositionInPreview(x: number, y: number): Promise<RCRTCErrorCode> {
      Logger.log(`setCameraExposurePositionInPreview x=${x}, y=${y}`);
      return RCReactNativeRtc.setCameraExposurePositionInPreview(x, y);
   }


   setCameraCaptureOrientation(orientation: RCRTCCameraCaptureOrientation): Promise<RCRTCErrorCode> {
      Logger.log(`setCameraCaptureOrientation orientation=${orientation}`);
      return RCReactNativeRtc.setCameraCaptureOrientation(orientation);
   }


   setLocalView(tag: number): Promise<RCRTCErrorCode> {
      Logger.log(`setLocalView tag=${tag}`);
      return RCReactNativeRtc.setLocalView(tag);
   }


   removeLocalView(): Promise<RCRTCErrorCode> {
      Logger.log(`removeLocalView`);
      return RCReactNativeRtc.removeLocalView();
   }


   setRemoteView(userId: string, tag: number): Promise<RCRTCErrorCode> {
      Logger.log(`setRemoteView userId=${userId}, tag=${tag}`);
      return RCReactNativeRtc.setRemoteView(userId, tag);
   }


   removeRemoteView(userId: string): Promise<RCRTCErrorCode> {
      Logger.log(`removeRemoteView userId=${userId}`);
      return RCReactNativeRtc.removeRemoteView(userId);
   }


   setLiveMixView(tag: number): Promise<RCRTCErrorCode> {
      Logger.log(`setLiveMixView tag=${tag}`);
      return RCReactNativeRtc.setLiveMixView(tag);
   }

   removeLiveMixView(): Promise<RCRTCErrorCode> {
      Logger.log(`removeLiveMixView`);
      return RCReactNativeRtc.removeLiveMixView();
   }


   muteLocalStream(type: RCRTCMediaType, mute: boolean): Promise<RCRTCErrorCode> {
      Logger.log(`muteLocalStream type=${type}, mute=${mute}`);
      return RCReactNativeRtc.muteLocalStream(type, mute);
   }


   muteRemoteStream(userId: string, type: RCRTCMediaType, mute: boolean): Promise<RCRTCErrorCode> {
      Logger.log(`muteRemoteStream userId=${userId}, type=${type}, mute=${mute}`);
      return RCReactNativeRtc.muteRemoteStream(userId, type, mute);
   }

   muteLiveMixStream(type: RCRTCMediaType, mute: boolean): Promise<number> {
      Logger.log(`muteLiveMixStream type=${type}, mute=${mute}`);
      return RCReactNativeRtc.muteLiveMixStream(type, mute);
   }

   addLiveCdn(url: string): Promise<RCRTCErrorCode> {
      Logger.log(`addLiveCdn url=${url}`);
      return RCReactNativeRtc.addLiveCdn(url);
   }


   removeLiveCdn(url: string): Promise<RCRTCErrorCode> {
      Logger.log(`removeLiveCdn url=${url}`);
      return RCReactNativeRtc.removeLiveCdn(url);
   }


   setLiveMixLayoutMode(mode: RCRTCLiveMixLayoutMode): Promise<RCRTCErrorCode> {
      Logger.log(`setLiveMixLayoutMode mode=${mode}`);
      return RCReactNativeRtc.setLiveMixLayoutMode(mode);
   }


   setLiveMixRenderMode(mode: RCRTCLiveMixRenderMode): Promise<RCRTCErrorCode> {
      Logger.log(`setLiveMixRenderMode mode=${mode}`);
      return RCReactNativeRtc.setLiveMixRenderMode(mode);
   }

   setLiveMixBackgroundColor(color: number): Promise<number> {
      Logger.log(`setLiveMixBackgroundColor color=${color}`);
      return RCReactNativeRtc.setLiveMixBackgroundColor(color);
   }

   setLiveMixBackgroundColorRgb(red: number, green: number, blue: number): Promise<number> {
      Logger.log(`setLiveMixBackgroundColorRgb red=${red}, green=${green}, blue=${blue}`);
      return RCReactNativeRtc.setLiveMixBackgroundColorRgb(red, green, blue);
   }

   setLiveMixCustomLayouts(layouts: RCRTCCustomLayout[]): Promise<RCRTCErrorCode> {
      Logger.log(`setLiveMixCustomLayouts layouts=${Logger.toString(layouts)}`);
      return RCReactNativeRtc.setLiveMixCustomLayouts(layouts);
   }


   setLiveMixCustomAudios(userIds: string[]): Promise<RCRTCErrorCode> {
      Logger.log(`setLiveMixCustomAudios userIds=${userIds}`);
      return RCReactNativeRtc.setLiveMixCustomAudios(userIds);
   }


   setLiveMixAudioBitrate(bitrate: number): Promise<RCRTCErrorCode> {
      Logger.log(`setLiveMixAudioBitrate bitrate=${bitrate}`);
      return RCReactNativeRtc.setLiveMixAudioBitrate(bitrate);
   }


   setLiveMixVideoBitrate(bitrate: number, tiny: boolean = false): Promise<RCRTCErrorCode> {
      Logger.log(`setLiveMixVideoBitrate bitrate=${bitrate}, tiny=${tiny}`);
      return RCReactNativeRtc.setLiveMixVideoBitrate(bitrate, tiny);
   }


   setLiveMixVideoResolution(width: number, height: number, tiny: boolean = false): Promise<RCRTCErrorCode> {
      Logger.log(`setLiveMixVideoResolution width=${width},height=${height}, tiny=${tiny}`);
      return RCReactNativeRtc.setLiveMixVideoResolution(width, height, tiny);
   }


   setLiveMixVideoFps(fps: RCRTCVideoFps, tiny: boolean = false): Promise<RCRTCErrorCode> {
      Logger.log(`setLiveMixVideoFps fps=${fps}, tiny=${tiny}`);
      return RCReactNativeRtc.setLiveMixVideoFps(fps, tiny);
   }


   createAudioEffect(path: string, effectId: number): Promise<RCRTCErrorCode> {
      Logger.log(`createAudioEffect path=${path}, effectId=${effectId}`);
      return RCReactNativeRtc.createAudioEffect(path, effectId);
   }


   releaseAudioEffect(effectId: number): Promise<RCRTCErrorCode> {
      Logger.log(`releaseAudioEffect effectId=${effectId}`);
      return RCReactNativeRtc.releaseAudioEffect(effectId);
   }


   playAudioEffect(effectId: number, volume: number, loop: number = 1): Promise<RCRTCErrorCode> {
      Logger.log(`playAudioEffect effectId=${effectId}, volume=${volume}, loop=${loop}`);
      return RCReactNativeRtc.playAudioEffect(effectId, volume, loop);
   }


   pauseAudioEffect(effectId: number): Promise<RCRTCErrorCode> {
      Logger.log(`pauseAudioEffect effectId=${effectId}`);
      return RCReactNativeRtc.pauseAudioEffect(effectId);
   }


   pauseAllAudioEffects(): Promise<RCRTCErrorCode> {
      Logger.log(`pauseAllAudioEffects`);
      return RCReactNativeRtc.pauseAllAudioEffects();
   }


   resumeAudioEffect(effectId: number): Promise<RCRTCErrorCode> {
      Logger.log(`resumeAudioEffect effectId=${effectId}`);
      return RCReactNativeRtc.resumeAudioEffect(effectId);
   }


   resumeAllAudioEffects(): Promise<RCRTCErrorCode> {
      Logger.log(`resumeAllAudioEffects`);
      return RCReactNativeRtc.resumeAllAudioEffects();
   }


   stopAudioEffect(effectId: number): Promise<RCRTCErrorCode> {
      Logger.log(`stopAudioEffect effectId=${effectId}`);
      return RCReactNativeRtc.stopAudioEffect(effectId);
   }


   stopAllAudioEffects(): Promise<RCRTCErrorCode> {
      Logger.log(`stopAllAudioEffects`);
      return RCReactNativeRtc.stopAllAudioEffects();
   }


   adjustAudioEffectVolume(effectId: number, volume: number): Promise<RCRTCErrorCode> {
      Logger.log(`adjustAudioEffectVolume effectId=${effectId}, volume=${volume}`);
      return RCReactNativeRtc.adjustAudioEffectVolume(effectId, volume);
   }


   getAudioEffectVolume(effectId: number): Promise<RCRTCErrorCode> {
      Logger.log(`getAudioEffectVolume effectId=${effectId}`);
      return RCReactNativeRtc.getAudioEffectVolume(effectId);
   }


   adjustAllAudioEffectsVolume(volume: number): Promise<RCRTCErrorCode> {
      Logger.log(`adjustAllAudioEffectsVolume volume=${volume}`);
      return RCReactNativeRtc.adjustAllAudioEffectsVolume(volume);
   }


   startAudioMixing(path: string, mode: RCRTCAudioMixingMode, playback: boolean = true, loop: number = 1): Promise<RCRTCErrorCode> {
      Logger.log(`startAudioMixing path=${path}, mode=${mode}, playback=${playback}, loop=${loop}`);
      return RCReactNativeRtc.startAudioMixing(path, mode, playback, loop);
   }


   stopAudioMixing(): Promise<RCRTCErrorCode> {
      Logger.log(`stopAudioMixing`);
      return RCReactNativeRtc.stopAudioMixing();
   }


   pauseAudioMixing(): Promise<RCRTCErrorCode> {
      Logger.log(`pauseAudioMixing`);
      return RCReactNativeRtc.pauseAudioMixing();
   }


   resumeAudioMixing(): Promise<RCRTCErrorCode> {
      Logger.log(`resumeAudioMixing`);
      return RCReactNativeRtc.resumeAudioMixing();
   }


   adjustAudioMixingVolume(volume: number): Promise<RCRTCErrorCode> {
      Logger.log(`adjustAudioMixingVolume volume=${volume}`);
      return RCReactNativeRtc.adjustAudioMixingVolume(volume);
   }


   adjustAudioMixingPlaybackVolume(volume: number): Promise<RCRTCErrorCode> {
      Logger.log(`adjustAudioMixingPlaybackVolume volume=${volume}`);
      return RCReactNativeRtc.adjustAudioMixingPlaybackVolume(volume);
   }


   getAudioMixingPlaybackVolume(): Promise<number> {
      Logger.log(`getAudioMixingPlaybackVolume`);
      return RCReactNativeRtc.getAudioMixingPlaybackVolume();
   }


   adjustAudioMixingPublishVolume(volume: number): Promise<RCRTCErrorCode> {
      Logger.log(`adjustAudioMixingPublishVolume volume=${volume}`);
      return RCReactNativeRtc.adjustAudioMixingPublishVolume(volume);
   }


   getAudioMixingPublishVolume(): Promise<number> {
      Logger.log(`getAudioMixingPublishVolume`);
      return RCReactNativeRtc.getAudioMixingPublishVolume();
   }


   setAudioMixingPosition(position: number): Promise<RCRTCErrorCode> {
      Logger.log(`setAudioMixingPosition position=${position}`);
      return RCReactNativeRtc.setAudioMixingPosition(position);
   }


   getAudioMixingPosition(): Promise<number> {
      Logger.log(`getAudioMixingPosition`);
      return RCReactNativeRtc.getAudioMixingPosition();
   }


   getAudioMixingDuration(): Promise<number> {
      Logger.log(`getAudioMixingDuration`);
      return RCReactNativeRtc.getAudioMixingDuration();
   }


   getSessionId(): Promise<string> {
      Logger.log(`getSessionId`);
      return RCReactNativeRtc.getSessionId();
   }

   createCustomStreamFromFile(path: string, tag: string, replace: boolean, playback: boolean): Promise<RCRTCErrorCode> {
      Logger.log(`createCustomStreamFromFile path=${path}, tag=${tag}, replace=${replace}, playback=${playback}`);
      return RCReactNativeRtc.createCustomStreamFromFile(path, tag, replace, playback);
   }

   setCustomStreamVideoConfig(tag: string, config: RCRTCVideoConfig): Promise<RCRTCErrorCode> {
      Logger.log(`setCustomStreamVideoConfig tag=${tag}, config=${Logger.toString(config)}`);
      return RCReactNativeRtc.setCustomStreamVideoConfig(tag, config);
   }

   muteLocalCustomStream(tag: string, mute: boolean): Promise<RCRTCErrorCode> {
      Logger.log(`muteLocalCustomStream tag=${tag}, mute=${mute}`);
      return RCReactNativeRtc.muteLocalCustomStream(tag, mute);
   }

   setLocalCustomStreamView(tag: string, view: number): Promise<RCRTCErrorCode> {
      Logger.log(`setLocalCustomStreamView tag=${tag}, view=${view}`);
      return RCReactNativeRtc.setLocalCustomStreamView(tag, view);
   }

   removeLocalCustomStreamView(tag: string): Promise<RCRTCErrorCode> {
      Logger.log(`removeLocalCustomStreamView tag=${tag}`);
      return RCReactNativeRtc.removeLocalCustomStreamView(tag);
   }

   publishCustomStream(tag: string): Promise<RCRTCErrorCode> {
      Logger.log(`publishCustomStream tag=${tag}`);
      return RCReactNativeRtc.publishCustomStream(tag);
   }

   unpublishCustomStream(tag: string): Promise<RCRTCErrorCode> {
      Logger.log(`unpublishCustomStream tag=${tag}`);
      return RCReactNativeRtc.unpublishCustomStream(tag);
   }

   muteRemoteCustomStream(userId: string, tag: string, type: number, mute: boolean): Promise<RCRTCErrorCode> {
      Logger.log(`muteRemoteCustomStream userId=${userId}, tag=${tag}, type=${type}, mute=${mute}`);
      return RCReactNativeRtc.muteRemoteCustomStream(userId, tag, type, mute);
   }

   setRemoteCustomStreamView(userId: string, tag: string, view: number): Promise<RCRTCErrorCode> {
      Logger.log(`setRemoteCustomStreamView userId=${userId}, tag=${tag}, view=${view}`);
      return RCReactNativeRtc.setRemoteCustomStreamView(userId, tag, view);
   }

   removeRemoteCustomStreamView(userId: string, tag: string): Promise<RCRTCErrorCode> {
      Logger.log(`removeRemoteCustomStreamView userId=${userId}, tag=${tag}`);
      return RCReactNativeRtc.removeRemoteCustomStreamView(userId, tag);
   }

   subscribeCustomStream(userId: string, tag: string, type: number, tiny: boolean): Promise<RCRTCErrorCode> {
      Logger.log(`subscribeCustomStream userId=${userId}, tag=${tag}, type=${type}, tiny=${tiny}`);
      return RCReactNativeRtc.subscribeCustomStream(userId, tag, type, tiny);
   }

   unsubscribeCustomStream(userId: string, tag: string, type: number): Promise<RCRTCErrorCode> {
      Logger.log(`unsubscribeCustomStream userId=${userId}, tag=${tag}, type=${type}`);
      return RCReactNativeRtc.unsubscribeCustomStream(userId, tag, type);
   }

   requestJoinSubRoom(roomId: string, userId: string, autoLayout: boolean, extra: string): Promise<RCRTCErrorCode> {
      Logger.log(`requestJoinSubRoom roomId=${roomId}, userId=${userId}, autoLayout=${autoLayout}, extra=${extra}`);
      return RCReactNativeRtc.requestJoinSubRoom(roomId, userId, autoLayout, extra);
   }

   cancelJoinSubRoomRequest(roomId: string, userId: string, extra: string): Promise<RCRTCErrorCode> {
      Logger.log(`cancelJoinSubRoomRequest roomId=${roomId}, userId=${userId}, extra=${extra}`);
      return RCReactNativeRtc.cancelJoinSubRoomRequest(roomId, userId, extra);
   }

   responseJoinSubRoomRequest(roomId: string, userId: string, agree: boolean, autoLayout: boolean, extra: string): Promise<RCRTCErrorCode> {
      Logger.log(`responseJoinSubRoomRequest roomId=${roomId}, userId=${userId}, agree=${agree}, autoLayout=${autoLayout}, extra=${extra}`);
      return RCReactNativeRtc.responseJoinSubRoomRequest(roomId, userId, agree, autoLayout, extra);
   }

   joinSubRoom(roomId: string): Promise<RCRTCErrorCode> {
      Logger.log(`joinSubRoom roomId=${roomId}`);
      return RCReactNativeRtc.joinSubRoom(roomId);
   }

   leaveSubRoom(roomId: string, disband: boolean): Promise<RCRTCErrorCode> {
      Logger.log(`leaveSubRoom roomId=${roomId}, disband=${disband}`);
      return RCReactNativeRtc.leaveSubRoom(roomId,disband);
   }


   /*  以下是事件回调  */
   setOnErrorListener(listener?: (code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnError;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, message: string }) => {
            Logger.log(`${eventName} code=${data.code}, message=${data.message}`);
            listener(data.code, data.message);
         });
      }
   }

   setOnKickedListener(listener?: (id: string, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnKicked;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { id: string, message: string }) => {
            Logger.log(`${eventName} id=${data.id}, message=${data.message}`);
            listener(data.id, data.message);
         });
      }
   }

   setOnRoomJoinedListener(listener?: (code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnRoomJoined;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, message: string }) => {
            Logger.log(`${eventName} code=${data.code}, message=${data.message}`);
            listener(data.code, data.message);
         });
      }
   }

   setOnRoomLeftListener(listener?: (code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnRoomLeft;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, message: string }) => {
            Logger.log(`${eventName} code=${data.code}, message=${data.message}`);
            listener(data.code, data.message);
         });
      }
   }

   setOnPublishedListener(listener?: (type: RCRTCMediaType, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnPublished;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { type: RCRTCMediaType, code: number, message: string }) => {
            Logger.log(`${eventName} type=${data.type}, code=${data.code}, message=${data.message}`);
            listener(data.type, data.code, data.message);
         });
      }
   }

   setOnUnpublishedListener(listener?: (type: RCRTCMediaType, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnUnpublished;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { type: RCRTCMediaType, code: number, message: string }) => {
            Logger.log(`${eventName} type=${data.type}, code=${data.code}, message=${data.message}`);
            listener(data.type, data.code, data.message);
         });
      }
   }

   setOnSubscribedListener(listener?: (userId: string, type: RCRTCMediaType, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnSubscribed;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { userId: string, type: RCRTCMediaType, code: number, message: string }) => {
            Logger.log(`${eventName} id=${data.userId}, type=${data.type}, code=${data.code}, message=${data.message}`);
            listener(data.userId, data.type, data.code, data.message);
         });
      }
   }

   setOnUnsubscribedListener(listener?: (userId: string, type: RCRTCMediaType, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnUnsubscribed;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { userId: string, type: RCRTCMediaType, code: number, message: string }) => {
            Logger.log(`${eventName} id=${data.userId}, type=${data.type}, code=${data.code}, message=${data.message}`);
            listener(data.userId, data.type, data.code, data.message);
         });
      }
   }

   setOnLiveMixSubscribedListener(listener?: (type: RCRTCMediaType, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnLiveMixSubscribed;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { type: RCRTCMediaType, code: number, message: string }) => {
            Logger.log(`${eventName} type=${data.type}, code=${data.code}, message=${data.message}`);
            listener(data.type, data.code, data.message);
         });
      }
   }

   setOnLiveMixUnsubscribedListener(listener?: (type: RCRTCMediaType, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnLiveMixUnsubscribed;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { type: RCRTCMediaType, code: number, message: string }) => {
            Logger.log(`${eventName} type=${data.type}, code=${data.code}, message=${data.message}`);
            listener(data.type, data.code, data.message);
         });
      }
   }

   setOnEnableCameraListener(listener?: (enable: boolean, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnEnableCamera;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { enable: boolean, code: number, message: string }) => {
            Logger.log(`${eventName} enable=${data.enable}, code=${data.code}, message=${data.message}`);
            listener(data.enable, data.code, data.message);
         });
      }
   }

   setOnSwitchCameraListener(listener?: (camera: RCRTCCamera, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnSwitchCamera;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { camera: RCRTCCamera, code: number, message: string }) => {
            Logger.log(`${eventName} camera=${data.camera}, code=${data.code}, message=${data.message}`);
            listener(data.camera, data.code, data.message);
         });
      }
   }

   setOnLiveCdnAddedListener(listener?: (url: string, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnLiveCdnAdded;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { url: string, code: number, message: string }) => {
            Logger.log(`${eventName} url=${data.url}, code=${data.code}, message=${data.message}`);
            listener(data.url, data.code, data.message);
         });
      }
   }

   setOnLiveCdnRemovedListener(listener?: (url: string, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnLiveCdnRemoved;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { url: string, code: number, message: string }) => {
            Logger.log(`${eventName} url=${data.url}, code=${data.code}, message=${data.message}`);
            listener(data.url, data.code, data.message);
         });
      }
   }

   setOnLiveMixLayoutModeSetListener(listener?: (code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnLiveMixLayoutModeSet;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, message: string }) => {
            Logger.log(`${eventName} code=${data.code}, message=${data.message}`);
            listener(data.code, data.message);
         });
      }
   }

   setOnLiveMixRenderModeSetListener(listener?: (code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnLiveMixRenderModeSet;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, message: string }) => {
            Logger.log(`${eventName} code=${data.code}, message=${data.message}`);
            listener(data.code, data.message);
         });
      }
   }

   setOnLiveMixBackgroundColorSetListener(listener?: (code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnLiveMixBackgroundColorSet;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, message: string }) => {
            Logger.log(`${eventName} code=${data.code}, message=${data.message}`);
            listener(data.code, data.message);
         });
      }
   }

   setOnLiveMixCustomLayoutsSetListener(listener?: (code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnLiveMixCustomLayoutsSet;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, message: string }) => {
            Logger.log(`${eventName} code=${data.code}, message=${data.message}`);
            listener(data.code, data.message);
         });
      }
   }

   setOnLiveMixCustomAudiosSetListener(listener?: (code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnLiveMixCustomAudiosSet;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, message: string }) => {
            Logger.log(`${eventName} code=${data.code}, message=${data.message}`);
            listener(data.code, data.message);
         });
      }
   }

   setOnLiveMixAudioBitrateSetListener(listener?: (code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnLiveMixAudioBitrateSet;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { code: number, message: string }) => {
            Logger.log(`${eventName} code=${data.code}, message=${data.message}`);
            listener(data.code, data.message);
         });
      }
   }

   setOnLiveMixVideoBitrateSetListener(listener?: (tiny: boolean, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnLiveMixVideoBitrateSet;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { tiny: boolean, code: number, message: string }) => {
            Logger.log(`${eventName} tiny=${data.tiny}, code=${data.code}, message=${data.message}`);
            listener(data.tiny, data.code, data.message);
         });
      }
   }

   setOnLiveMixVideoResolutionSetListener(listener?: (tiny: boolean, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnLiveMixVideoResolutionSet;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { tiny: boolean, code: number, message: string }) => {
            Logger.log(`${eventName} tiny=${data.tiny}, code=${data.code}, message=${data.message}`);
            listener(data.tiny, data.code, data.message);
         });
      }
   }

   setOnLiveMixVideoFpsSetListener(listener?: (tiny: boolean, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnLiveMixVideoFpsSet;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { tiny: boolean, code: number, message: string }) => {
            Logger.log(`${eventName} tiny=${data.tiny}, code=${data.code}, message=${data.message}`);
            listener(data.tiny, data.code, data.message);
         });
      }
   }

   setOnAudioEffectCreatedListener(listener?: (id: string, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnAudioEffectCreated;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { id: string, code: number, message: string }) => {
            Logger.log(`${eventName} id=${data.id}, code=${data.code}, message=${data.message}`);
            listener(data.id, data.code, data.message);
         });
      }
   }

   setOnAudioEffectFinishedListener(listener?: (id: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnAudioEffectFinished;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (id: string) => {
            Logger.log(`${eventName} id=${id}`);
            listener(id);
         });
      }
   }

   setOnAudioMixingStartedListener(listener?: () => void): void {
      const eventName = RCRTCEngineEventsName.OnAudioMixingStarted;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, () => {
            Logger.log(`${eventName}`);
            listener();
         });
      }
   }

   setOnAudioMixingPausedListener(listener?: () => void): void {
      const eventName = RCRTCEngineEventsName.OnAudioMixingPaused;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, () => {
            Logger.log(`${eventName}`);
            listener();
         });
      }
   }

   setOnAudioMixingStoppedListener(listener?: () => void): void {
      const eventName = RCRTCEngineEventsName.OnAudioMixingStopped;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, () => {
            Logger.log(`${eventName}`);
            listener();
         });
      }
   }

   setOnAudioMixingFinishedListener(listener?: () => void): void {
      const eventName = RCRTCEngineEventsName.OnAudioMixingFinished;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, () => {
            Logger.log(`${eventName}`);
            listener();
         });
      }
   }

   setOnUserJoinedListener(listener?: (roomId: string, userId: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnUserJoined;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}`);
            listener(data.roomId, data.userId);
         });
      }
   }

   setOnUserOfflineListener(listener?: (roomId: string, userId: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnUserOffline;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}`);
            listener(data.roomId, data.userId);
         });
      }
   }

   setOnUserLeftListener(listener?: (roomId: string, userId: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnUserLeft;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}`);
            listener(data.roomId, data.userId);
         });
      }
   }

   setOnRemotePublishedListener(listener?: (roomId: string, userId: string, type: RCRTCMediaType) => void): void {
      const eventName = RCRTCEngineEventsName.OnRemotePublished;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, type: RCRTCMediaType }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, type=${data.type}`);
            listener(data.roomId, data.userId, data.type);
         });
      }
   }

   setOnRemoteUnpublishedListener(listener?: (roomId: string, userId: string, type: RCRTCMediaType) => void): void {
      const eventName = RCRTCEngineEventsName.OnRemoteUnpublished;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, type: RCRTCMediaType }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, type=${data.type}`);
            listener(data.roomId, data.userId, data.type);
         });
      }
   }

   setOnRemoteLiveMixPublishedListener(listener?: (type: RCRTCMediaType) => void): void {
      const eventName = RCRTCEngineEventsName.OnRemoteLiveMixPublished;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (type: RCRTCMediaType) => {
            Logger.log(`${eventName} type=${type}`);
            listener(type);
         });
      }
   }

   setOnRemoteLiveMixUnpublishedListener(listener?: (type: RCRTCMediaType) => void): void {
      const eventName = RCRTCEngineEventsName.OnRemoteLiveMixUnpublished;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (type: RCRTCMediaType) => {
            Logger.log(`${eventName} type=${type}`);
            listener(type);
         });
      }
   }

   setOnRemoteStateChangedListener(listener?: (roomId: string, userId: string, type: RCRTCMediaType, disabled: boolean) => void): void {
      const eventName = RCRTCEngineEventsName.OnRemoteStateChanged;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, type: RCRTCMediaType, disabled: boolean }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, type=${data.type}, disabled=${data.disabled}`);
            listener(data.roomId, data.userId, data.type, data.disabled);
         });
      }
   }

   setOnRemoteFirstFrameListener(listener?: (roomId: string, userId: string, type: RCRTCMediaType) => void): void {
      const eventName = RCRTCEngineEventsName.OnRemoteFirstFrame;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, type: RCRTCMediaType }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, type=${data.type}`);
            listener(data.roomId, data.userId, data.type);
         });
      }
   }

   setOnRemoteLiveMixFirstFrameListener(listener?: (type: RCRTCMediaType) => void): void {
      const eventName = RCRTCEngineEventsName.OnRemoteLiveMixFirstFrame;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (type: RCRTCMediaType) => {
            Logger.log(`${eventName} type=${type}`);
            listener(type);
         });
      }
   }

   setOnCustomStreamPublishedListener(listener?: (tag: string, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnCustomStreamPublished;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { tag: string, code: number, message: string }) => {
            Logger.log(`${eventName} tag=${data.tag}, code=${data.code}, message=${data.message}`);
            listener(data.tag, data.code, data.message);
         });
      }
   }

   setOnCustomStreamPublishFinishedListener(listener?: (tag: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnCustomStreamPublishFinished;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (tag: string ) => {
            Logger.log(`${eventName} tag=${tag}`);
            listener(tag);
         });
      }
   }

   setOnCustomStreamUnpublishedListener(listener?: (tag: string, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnCustomStreamUnpublished;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { tag: string, code: number, message: string }) => {
            Logger.log(`${eventName} tag=${data.tag}, code=${data.code}, message=${data.message}`);
            listener(data.tag, data.code, data.message);
         });
      }
   }

   setOnRemoteCustomStreamPublishedListener(listener?: (roomId: string, userId: string, tag: string, type: RCRTCMediaType) => void): void {
      const eventName = RCRTCEngineEventsName.OnRemoteCustomStreamPublished;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, tag: string, type: RCRTCMediaType }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, tag=${data.tag}, type=${data.type}`);
            listener(data.roomId, data.userId, data.tag, data.type);
         });
      }
   }

   setOnRemoteCustomStreamUnpublishedListener(listener?: (roomId: string, userId: string, tag: string, type: RCRTCMediaType) => void): void {
      const eventName = RCRTCEngineEventsName.OnRemoteCustomStreamUnpublished;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, tag: string, type: RCRTCMediaType }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, tag=${data.tag}, type=${data.type}`);
            listener(data.roomId, data.userId, data.tag, data.type);
         });
      }
   }

   setOnRemoteCustomStreamStateChangedListener(listener?: (roomId: string, userId: string, tag: string, type: RCRTCMediaType, disabled: boolean) => void): void {
      const eventName = RCRTCEngineEventsName.OnRemoteCustomStreamStateChanged;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, tag: string, type: RCRTCMediaType, disabled: boolean }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, tag=${data.tag}, type=${data.type}, disabled=${data.disabled}`);
            listener(data.roomId, data.userId, data.tag, data.type, data.disabled);
         });
      }
   }

   setOnRemoteCustomStreamFirstFrameListener(listener?: (roomId: string, userId: string, tag: string, type: RCRTCMediaType) => void): void {
      const eventName = RCRTCEngineEventsName.OnRemoteCustomStreamFirstFrame;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, tag: string, type: RCRTCMediaType }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, tag=${data.tag}, type=${data.type}`);
            listener(data.roomId, data.userId, data.tag, data.type);
         });
      }
   }

   setOnCustomStreamSubscribedListener(listener?: (userId: string, tag: string, type: RCRTCMediaType, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnCustomStreamSubscribed;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { userId: string, tag: string, type: RCRTCMediaType, code: number, message: string }) => {
            Logger.log(`${eventName} userId=${data.userId}, tag=${data.tag}, type=${data.type}, code=${data.code}, message=${data.message}`);
            listener(data.userId, data.tag, data.type, data.code, data.message);
         });
      }
   }

   setOnCustomStreamUnsubscribedListener(listener?: (userId: string, tag: string, type: RCRTCMediaType, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnCustomStreamUnsubscribed;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { userId: string, tag: string, type: RCRTCMediaType, code: number, message: string }) => {
            Logger.log(`${eventName} userId=${data.userId}, tag=${data.tag}, type=${data.type}, code=${data.code}, message=${data.message}`);
            listener(data.userId, data.tag, data.type, data.code, data.message);
         });
      }
   }

   setOnJoinSubRoomRequestedListener(listener?: (roomId: string, userId: string, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnJoinSubRoomRequested;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, code: number, message: string }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, code=${data.code}, message=${data.message}`);
            listener(data.roomId, data.userId, data.code, data.message);
         });
      }
   }

   setOnJoinSubRoomRequestCanceledListener(listener?: (roomId: string, userId: string, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnJoinSubRoomRequestCanceled;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, code: number, message: string }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, code=${data.code}, message=${data.message}`);
            listener(data.roomId, data.userId, data.code, data.message);
         });
      }
   }

   setOnJoinSubRoomRequestRespondedListener(listener?: (roomId: string, userId: string, agree: boolean, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnJoinSubRoomRequestResponded;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, agree: boolean, code: number, message: string }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, code=${data.code}, message=${data.message}`);
            listener(data.roomId, data.userId, data.agree, data.code, data.message);
         });
      }
   }

   setOnJoinSubRoomRequestReceivedListener(listener?: (roomId: string, userId: string, extra: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnJoinSubRoomRequestReceived;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, extra: string }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, extra=${data.extra}`);
            listener(data.roomId, data.userId, data.extra);
         });
      }
   }

   setOnCancelJoinSubRoomRequestReceivedListener(listener?: (roomId: string, userId: string, extra: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnCancelJoinSubRoomRequestReceived;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, extra: string }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, extra=${data.extra}`);
            listener(data.roomId, data.userId, data.extra);
         });
      }
   }

   setOnJoinSubRoomRequestResponseReceivedListener(listener?: (roomId: string, userId: string, agree: boolean, extra: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnJoinSubRoomRequestResponseReceived;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, agree: boolean, extra: string }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, agree=${data.agree}, extra=${data.extra}`);
            listener(data.roomId, data.userId, data.agree, data.extra);
         });
      }
   }

   setOnSubRoomJoinedListener(listener?: (roomId: string, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnSubRoomJoined;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, code: number, message: string }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, code=${data.code}, message=${data.message}`);
            listener(data.roomId, data.code, data.message);
         });
      }
   }

   setOnSubRoomLeftListener(listener?: (roomId: string, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnSubRoomLeft;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, code: number, message: string }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, code=${data.code}, message=${data.message}`);
            listener(data.roomId, data.code, data.message);
         });
      }
   }

   setOnSubRoomBandedListener(listener?: (roomId: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnSubRoomBanded;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (roomId: string) => {
            Logger.log(`${eventName} roomId=${roomId}`);
            listener(roomId);
         });
      }
   }

   setOnSubRoomDisbandListener(listener?: (roomId: string, userId: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnSubRoomDisband;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}`);
            listener(data.roomId, data.userId);
         });
      }
   }

   setOnLiveRoleSwitchedListener(listener?: (current: RCRTCRole, code: number, message: string) => void): void {
      const eventName = RCRTCEngineEventsName.OnLiveRoleSwitched;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { current: RCRTCRole, code: number, message: string }) => {
            Logger.log(`${eventName} current=${data.current}, code=${data.code}, message=${data.message}`);
            listener(data.current, data.code, data.message);
         });
      }
   }

   setOnRemoteLiveRoleSwitchedListener(listener?: (roomId: string, userId: string, role: RCRTCRole) => void): void {
      const eventName = RCRTCEngineEventsName.OnRemoteLiveRoleSwitched;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, role: RCRTCRole }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, role=${data.role}`);
            listener(data.roomId, data.userId, data.role);
         });
      }
   }


   /* 以下是 状态回调 */

   setOnNetworkStatsListener(listener?: (stats: RCRTCNetworkStats) => void): void {
      const eventName = RCRTCStatsEventsName.OnNetworkStats;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (stats: RCRTCNetworkStats) => {
            Logger.log(`${eventName} stats=${Logger.toString(stats)}`);
            listener(stats);
         });
      }
   }

   setOnLocalAudioStatsListener(listener?: (stats: RCRTCLocalAudioStats) => void): void {
      const eventName = RCRTCStatsEventsName.OnLocalAudioStats;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (stats: RCRTCLocalAudioStats) => {
            Logger.log(`${eventName} stats=${Logger.toString(stats)}`);
            listener(stats);
         });
      }
   }

   setOnLocalVideoStatsListener(listener?: (stats: RCRTCLocalVideoStats) => void): void {
      const eventName = RCRTCStatsEventsName.OnLocalVideoStats;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (stats: RCRTCLocalVideoStats) => {
            Logger.log(`${eventName} stats=${Logger.toString(stats)}`);
            listener(stats);
         });
      }
   }

   setOnRemoteAudioStatsListener(listener?: (roomId: string, userId: string, stats: RCRTCRemoteAudioStats) => void): void {
      const eventName = RCRTCStatsEventsName.OnRemoteAudioStats;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, stats: RCRTCRemoteAudioStats }) => {
            Logger.log(`${eventName} roomId=${data.roomId},stats=${Logger.toString(data.stats)}`);
            listener(data.roomId, data.userId, data.stats);
         });
      }
   }

   setOnRemoteVideoStatsListener(listener?: (roomId: string, userId: string, stats: RCRTCRemoteVideoStats) => void): void {
      const eventName = RCRTCStatsEventsName.OnRemoteVideoStats;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, stats: RCRTCRemoteVideoStats }) => {
            Logger.log(`${eventName} roomId=${data.roomId},stats=${Logger.toString(data.stats)}`);
            listener(data.roomId, data.userId, data.stats);
         });
      }
   }


   setOnLiveMixAudioStatsListener(listener?: (stats: RCRTCRemoteAudioStats) => void): void {
      const eventName = RCRTCStatsEventsName.OnLiveMixAudioStats;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (stats: RCRTCRemoteAudioStats) => {
            Logger.log(`${eventName} stats=${Logger.toString(stats)}`);
            listener(stats);
         });
      }
   }

   setOnLiveMixVideoStatsListener(listener?: (stats: RCRTCRemoteVideoStats) => void): void {
      const eventName = RCRTCStatsEventsName.OnLiveMixVideoStats;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (stats: RCRTCRemoteVideoStats) => {
            Logger.log(`${eventName} stats=${Logger.toString(stats)}`);
            listener(stats);
         });
      }
   }

   setOnLiveMixMemberAudioStatsListener(listener?: (userId: string, volume: number) => void): void {
      const eventName = RCRTCStatsEventsName.OnLiveMixMemberAudioStats;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { userId: string, volume: number }) => {
            Logger.log(`${eventName} userId=${data.userId}, volume=${data.volume}`);
            listener(data.userId, data.volume);
         });
      }
   }

   setOnLiveMixMemberCustomAudioStatsListener(listener?: (userId: string, tag: string, volume: number) => void): void {
      const eventName = RCRTCStatsEventsName.OnLiveMixMemberCustomAudioStats;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { userId: string, tag: string, volume: number }) => {
            Logger.log(`${eventName} userId=${data.userId}, tag=${data.tag}, volume=${data.volume}`);
            listener(data.userId, data.tag, data.volume);
         });
      }
   }

   setOnLocalCustomAudioStatsListener(listener?: (tag: string, stats: RCRTCLocalAudioStats) => void): void {
      const eventName = RCRTCStatsEventsName.OnLocalCustomAudioStats;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { tag: string, stats: RCRTCLocalAudioStats }) => {
            Logger.log(`${eventName} tag=${data.tag}, stats=${Logger.toString(data.stats)}`);
            listener(data.tag, data.stats);
         });
      }
   }

   setOnLocalCustomVideoStatsListener(listener?: (tag: string, stats: RCRTCLocalVideoStats) => void): void {
      const eventName = RCRTCStatsEventsName.OnLocalCustomVideoStats;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { tag: string, stats: RCRTCLocalVideoStats }) => {
            Logger.log(`${eventName} tag=${data.tag}, stats=${Logger.toString(data.stats)}`);
            listener(data.tag, data.stats);
         });
      }
   }
   setOnRemoteCustomAudioStatsListener(listener?: (roomId: string, userId: string, tag: string, stats: RCRTCRemoteAudioStats) => void): void {
      const eventName = RCRTCStatsEventsName.OnRemoteCustomAudioStats;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, tag: string, stats: RCRTCRemoteAudioStats }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, tag=${data.tag}, stats=${Logger.toString(data.stats)}`);
            listener(data.roomId, data.userId, data.tag, data.stats);
         });
      }
   }
   setOnRemoteCustomVideoStatsListener(listener?: (roomId: string, userId: string, tag: string, stats: RCRTCRemoteVideoStats) => void): void {
      const eventName = RCRTCStatsEventsName.OnRemoteCustomVideoStats;
      RCReactNativeEventEmitter.removeAllListeners(eventName);
      if (listener) {
         RCReactNativeEventEmitter.addListener(eventName, (data: { roomId: string, userId: string, tag: string, stats: RCRTCRemoteVideoStats }) => {
            Logger.log(`${eventName} roomId=${data.roomId}, userId=${data.userId}, tag=${data.tag}, stats=${Logger.toString(data.stats)}`);
            listener(data.roomId, data.userId, data.tag, data.stats);
         });
      }
   }
}

const RCRTCEngine = new RCRTCEngineImpl();
export default RCRTCEngine;