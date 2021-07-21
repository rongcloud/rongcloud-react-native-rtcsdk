#import "RCReactNativeRtc.h"
#import <RongRTCLibWrapper/RongRTCLibWrapper.h>
#import <React/RCTConvert.h>
#import <React/RCTUIManager.h>

#import "ArgumentAdapter.h"

@interface RCReactNativeRtc() <RCRTCIWEngineDelegate, RCRTCIWStatsDelegate>  {
    RCRTCIWEngine *engine;
    BOOL hasListener;
}

@end

@implementation RCReactNativeRtc

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

- (void)startObserving {
    hasListener = YES;
}

- (void)stopObserving {
    hasListener = NO;
}

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(init:(NSDictionary *)setup
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    if (setup) {
        engine = [RCRTCIWEngine create:toEngineSetup(setup)];
    } else {
        engine = [RCRTCIWEngine create];
    }
    [engine setEngineDelegate:self];
    [engine setStatsDelegate:self];
    resolve(nil);
}

RCT_EXPORT_METHOD(unInit:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    if (engine) {
        [engine destroy];
    }
    resolve(nil);
}

RCT_EXPORT_METHOD(joinRoom:(NSString *)roomId
                  setup:(NSDictionary *)setup
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine joinRoom:roomId setup:toRoomSetup(setup)];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(leaveRoom:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine leaveRoom];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(publish:(int)type
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine publish:toMediaType(type)];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(unpublish:(int)type
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine unpublish:toMediaType(type)];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(subscribe:(NSString *)userId
                  type:(int)type
                  tiny:(BOOL)tiny
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine subscribe:userId type:toMediaType(type) tiny:tiny];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(subscribes:(NSArray *)userIds
                  type:(int)type
                  tiny:(BOOL)tiny
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine subscribeWithUserIds:userIds type:toMediaType(type) tiny:tiny];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(subscribeLiveMix:(int)type
                  tiny:(BOOL)tiny
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine subscribeLiveMix:toMediaType(type) tiny:tiny];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(unsubscribe:(NSString *)userId
                  type:(int)type
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine unsubscribe:userId type:toMediaType(type)];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(unsubscribes:(NSArray *)userIds
                  type:(int)type
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine unsubscribeWithUserIds:userIds type:toMediaType(type)];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(unsubscribeLiveMix:(int)type
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine unsubscribeLiveMix:toMediaType(type)];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(setAudioConfig:(NSDictionary *)config
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine setAudioConfig:toAudioConfig(config)];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(setVideoConfig:(NSDictionary *)config
                  tiny:(BOOL)tiny
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        if (tiny) {
            code = [engine setTinyVideoConfig:toVideoConfig(config)];
        } else {
            code = [engine setVideoConfig:toVideoConfig(config)];
        }
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(enableMicrophone:(BOOL)enable
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine enableMicrophone:enable];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(enableSpeaker:(BOOL)enable
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine enableSpeaker:enable];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(adjustLocalVolume:(NSInteger)volume
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine adjustLocalVolume:volume];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(enableCamera:(BOOL)enable
                  camera:(int)camera
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine enableCamera:enable camera:toCamera(camera)];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(switchCamera:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine switchCamera];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(whichCamera:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine whichCamera];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(isCameraFocusSupported:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    BOOL code = -1;
    if (engine) {
        code = [engine isCameraFocusSupported];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(isCameraExposurePositionSupported:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    BOOL code = -1;
    if (engine) {
        code = [engine isCameraExposurePositionSupported];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(setCameraFocusPositionInPreview:(double)x
                  y:(double)y
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine setCameraFocusPositionInPreview:CGPointMake(x, y)];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(setCameraExposurePositionInPreview:(double)x
                  y:(double)y
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine setCameraExposurePositionInPreview:CGPointMake(x, y)];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(setCameraCaptureOrientation:(int)orientation
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine setCameraCaptureOrientation:toCameraCaptureOrientation(orientation)];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(setLocalView:(NSDictionary *)view
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        NSNumber *viewId = [RCTConvert NSNumber:view[@"id"]];
        UIView *uiView = [self.bridge.uiManager viewForReactTag:viewId];
        [engine setLocalView:(RCRTCIWView *) uiView];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(removeLocalView:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    BOOL code = -1;
    if (engine) {
        code = [engine removeLocalView];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(setRemoteView:(NSDictionary *)view
                  userId:(NSString *)userId
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        NSNumber *viewId = [RCTConvert NSNumber:view[@"id"]];
        UIView *uiView = [self.bridge.uiManager viewForReactTag:viewId];
        [engine setRemoteView:(RCRTCIWView *)uiView userId:userId];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(removeRemoteView:(NSString *)userId
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine removeRemoteView:userId];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(setLiveMixView:(NSDictionary *)view
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        NSNumber *viewId = [RCTConvert NSNumber:view[@"id"]];
        UIView *uiView = [self.bridge.uiManager viewForReactTag:viewId];
        [engine setLiveMixView:(RCRTCIWView *) uiView];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(removeLiveMixView:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    BOOL code = -1;
    if (engine) {
        code = [engine removeLiveMixView];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(muteLocalStream:(int)type
                  mute:(BOOL)mute
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine muteLocalStream:toMediaType(type) mute:mute];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(muteRemoteStream:(NSString *)userId
                  type:(int)type
                  mute:(BOOL)mute
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine muteRemoteStream:userId type:toMediaType(type) mute:mute];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(addLiveCdn:(NSString *)url
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine addLiveCdn:url];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(removeLiveCdn:(NSString *)url
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine removeLiveCdn:url];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(setLiveMixLayoutMode:(int)mode
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine setLiveMixLayoutMode:toLiveMixLayoutMode(mode)];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(setLiveMixRenderMode:(int)mode
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine setLiveMixRenderMode:toLiveMixRenderMode(mode)];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(setLiveMixCustomAudios:(NSArray *)userIds
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine setLiveMixCustomAudios:userIds];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(setLiveMixCustomLayouts:(NSArray *)layouts
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine setLiveMixCustomLayouts:toLiveMixCustomLayouts(layouts)];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(setLiveMixAudioBitrate:(NSInteger)bitrate
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine setLiveMixAudioBitrate:bitrate];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(setLiveMixVideoBitrate:(NSInteger)bitrate
                  tiny:(BOOL)tiny
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        if (tiny) {
            code = [engine setLiveMixTinyVideoBitrate:bitrate];
        } else {
            code = [engine setLiveMixVideoBitrate:bitrate];
        }
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(setLiveMixVideoResolution:(int)resolution
                  tiny:(BOOL)tiny
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        if (tiny) {
            code = [engine setLiveMixTinyVideoResolution:toVideoResolution(resolution)];
        } else {
            code = [engine setLiveMixVideoResolution:toVideoResolution(resolution)];
        }
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(setLiveMixVideoFps:(int)fps
                  tiny:(BOOL)tiny
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        if (tiny) {
            code = [engine setLiveMixTinyVideoFps:toVideoFps(fps)];
        } else {
            code = [engine setLiveMixVideoFps:toVideoFps(fps)];
        }
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(createAudioEffect:(NSString *)path
                  effectId:(NSInteger)effectId
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine createAudioEffect:[NSURL URLWithString:path] effectId:effectId];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(releaseAudioEffect:(NSInteger)effectId
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine releaseAudioEffect:effectId];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(playAudioEffect:(NSInteger)effectId
                  volume:(NSInteger)volume
                  loop:(NSInteger)loop
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine playAudioEffect:effectId volume:volume loop:loop];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(pauseAudioEffect:(NSInteger)effectId
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine pauseAudioEffect:effectId];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(pauseAllAudioEffects:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine pauseAllAudioEffects];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(resumeAudioEffect:(NSInteger)effectId
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine resumeAudioEffect:effectId];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(resumeAllAudioEffects:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine resumeAllAudioEffects];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(stopAudioEffect:(NSInteger)effectId
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine stopAudioEffect:effectId];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(stopAllAudioEffects:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine stopAllAudioEffects];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(adjustAudioEffectVolume:(NSInteger)effectId
                  volume:(NSInteger)volume
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine adjustAudioEffect:effectId volume:volume];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(getAudioEffectVolume:(NSInteger)effectId
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine getAudioEffectVolume:effectId];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(adjustAllAudioEffectsVolume:(NSInteger)volume
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine adjustAllAudioEffectsVolume:volume];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(startAudioMixing:(NSString *)path
                  mode:(int)mode
                  playback:(BOOL)playback
                  loop:(NSInteger)loop
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine startAudioMixing:[NSURL URLWithString:path]
                                   mode:toAudioMixingMode(mode)
                               playback:playback
                                   loop:loop];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(stopAudioMixing:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine stopAudioMixing];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(pauseAudioMixing:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine pauseAudioMixing];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(resumeAudioMixing:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine resumeAudioMixing];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(adjustAudioMixingVolume:(NSInteger)volume
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine adjustAudioMixingVolume:volume];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(adjustAudioMixingPlaybackVolume:(NSInteger)volume
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine adjustAudioMixingPlaybackVolume:volume];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(getAudioMixingPlaybackVolume:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine getAudioMixingPlaybackVolume];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(adjustAudioMixingPublishVolume:(NSInteger)volume
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine adjustAudioMixingPublishVolume:volume];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(getAudioMixingPublishVolume:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine getAudioMixingPublishVolume];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(setAudioMixingPosition:(double)position
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine setAudioMixingPosition:position];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(getAudioMixingPosition:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    double code = -1;
    if (engine) {
        code = [engine getAudioMixingPosition];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(getAudioMixingDuration:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSInteger code = -1;
    if (engine) {
        code = [engine getAudioMixingDuration];
    }
    resolve(@(code));
}

RCT_EXPORT_METHOD(getSessionId:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    NSString *code = nil;
    if (engine) {
        code = [engine getSessionId];
    }
    resolve(code);
}

- (void)onError:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnError" body:arguments];
    };
}

- (void)onKicked:(NSString *)roomId message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:roomId forKey:@"id"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnKicked" body:arguments];
    };
}

- (void)onRoomJoined:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnRoomJoined" body:arguments];
    };
}

- (void)onRoomLeft:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnRoomLeft" body:arguments];
    };
}

- (void)onPublished:(RCRTCIWMediaType)type code:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@((int) type) forKey:@"type"];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnPublished" body:arguments];
    };
}

- (void)onUnpublished:(RCRTCIWMediaType)type code:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@((int) type) forKey:@"type"];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnUnpublished" body:arguments];
    };
}

- (void)onSubscribed:(NSString *)userId
           mediaType:(RCRTCIWMediaType)type
                code:(NSInteger)code
             message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:userId forKey:@"id"];
    [arguments setObject:@((int) type) forKey:@"type"];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnSubscribed" body:arguments];
    };
}

- (void)onUnsubscribed:(NSString *)userId
             mediaType:(RCRTCIWMediaType)type
                  code:(NSInteger)code
               message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:userId forKey:@"id"];
    [arguments setObject:@((int) type) forKey:@"type"];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnUnsubscribed" body:arguments];
    };
}

- (void)onLiveMixSubscribed:(RCRTCIWMediaType)type code:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@((int) type) forKey:@"type"];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnLiveMixSubscribed" body:arguments];
    };
}

- (void)onLiveMixUnsubscribed:(RCRTCIWMediaType)type code:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@((int) type) forKey:@"type"];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnLiveMixUnsubscribed" body:arguments];
    };
}

- (void)onEnableCamera:(BOOL)enable code:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@(enable) forKey:@"enable"];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnEnableCamera" body:arguments];
    };
}

- (void)onSwitchCamera:(RCRTCIWCamera)camera code:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@((int) camera + 1) forKey:@"camera"];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnSwitchCamera" body:arguments];
    };
}

- (void)onLiveCdnAdded:(NSString *)url code:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:url forKey:@"url"];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnLiveCdnAdded" body:arguments];
    };
}

- (void)onLiveCdnRemoved:(NSString *)url code:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:url forKey:@"url"];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnLiveCdnRemoved" body:arguments];
    };
}

- (void)onLiveMixLayoutModeSet:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnLiveMixLayoutModeSet" body:arguments];
    };
}

- (void)onLiveMixRenderModeSet:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnLiveMixRenderModeSet" body:arguments];
    };
}

- (void)onLiveMixCustomAudiosSet:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnLiveMixCustomAudiosSet" body:arguments];
    };
}

- (void)onLiveMixCustomLayoutsSet:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnLiveMixCustomLayoutsSet" body:arguments];
    };
}

- (void)onLiveMixAudioBitrateSet:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnLiveMixAudioBitrateSet" body:arguments];
    };
}

- (void)onLiveMixVideoBitrateSet:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@(false) forKey:@"tiny"];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnLiveMixVideoBitrateSet" body:arguments];
    };
}

- (void)onLiveMixTinyVideoBitrateSet:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@(true) forKey:@"tiny"];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnLiveMixVideoBitrateSet" body:arguments];
    };
}

- (void)onLiveMixVideoResolutionSet:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@(false) forKey:@"tiny"];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnLiveMixVideoResolutionSet" body:arguments];
    };
}

- (void)onLiveMixTinyVideoResolutionSet:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@(true) forKey:@"tiny"];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnLiveMixVideoResolutionSet" body:arguments];
    };
}

- (void)onLiveMixVideoFpsSet:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@(false) forKey:@"tiny"];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnLiveMixVideoFpsSet" body:arguments];
    };
}

- (void)onLiveMixTinyVideoFpsSet:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@(true) forKey:@"tiny"];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnLiveMixVideoFpsSet" body:arguments];
    };
}

- (void)onAudioEffectCreated:(NSInteger)effectId code:(NSInteger)code message:(NSString *)errMsg {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:@(effectId) forKey:@"id"];
    [arguments setObject:@(code) forKey:@"code"];
    [arguments setObject:errMsg forKey:@"message"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnAudioEffectCreated" body:arguments];
    };
}

- (void)onAudioEffectFinished:(NSInteger)effectId {
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnAudioEffectFinished" body:@(effectId)];
    };
}

- (void)onAudioMixingStarted {
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnAudioMixingStarted" body:nil];
    };
}

- (void)onAudioMixingPaused {
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnAudioMixingPaused" body:nil];
    };
}

- (void)onAudioMixingResume {
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnAudioMixingStarted" body:nil];
    };
}

- (void)onAudioMixingStopped {
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnAudioMixingStopped" body:nil];
    };
}

- (void)onAudioMixingFinished {
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnAudioMixingFinished" body:nil];
    };
}

- (void)onUserJoined:(NSString *)userId {
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnUserJoined" body:userId];
    };
}

- (void)onUserOffline:(NSString *)userId {
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnUserOffline" body:userId];
    };
}

- (void)onUserLeft:(NSString *)userId {
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnUserLeft" body:userId];
    };
}

- (void)onRemotePublished:(NSString *)userId mediaType:(RCRTCIWMediaType)type {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:userId forKey:@"id"];
    [arguments setObject:@((int) type) forKey:@"type"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnRemotePublished" body:arguments];
    };
}

- (void)onRemoteUnpublished:(NSString *)userId mediaType:(RCRTCIWMediaType)type {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:userId forKey:@"id"];
    [arguments setObject:@((int) type) forKey:@"type"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnRemoteUnpublished" body:arguments];
    };
}

- (void)onRemoteLiveMixPublished:(RCRTCIWMediaType)type {
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnRemoteLiveMixPublished" body:@((int) type)];
    };
}

- (void)onRemoteLiveMixUnpublished:(RCRTCIWMediaType)type {
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnRemoteLiveMixUnpublished" body:@((int) type)];
    };
}

- (void)onRemoteStateChanged:(NSString *)userId type:(RCRTCIWMediaType)type disabled:(BOOL)disabled {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:userId forKey:@"id"];
    [arguments setObject:@((int) type) forKey:@"type"];
    [arguments setObject:@(disabled) forKey:@"disabled"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnRemoteStateChanged" body:arguments];
    };
}

- (void)onRemoteFirstFrame:(NSString *)userId type:(RCRTCIWMediaType)type {
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setObject:userId forKey:@"id"];
    [arguments setObject:@((int) type) forKey:@"type"];
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnRemoteFirstFrame" body:arguments];
    };
}

- (void)onRemoteLiveMixFirstFrame:(RCRTCIWMediaType)type {
    if (hasListener) {
        [self sendEventWithName:@"Engine:OnRemoteLiveMixFirstFrame" body:@((int) type)];
    };
}

- (void)onMessageReceived:(RCMessage *)message {
    // TODO onMessageReceived
    // IM RN Message
}

- (void)onNetworkStats:(RCRTCIWNetworkStats *)stats {
    NSDictionary *argument = fromNetworkStats(stats);
    if (hasListener) {
        [self sendEventWithName:@"Stats:OnNetworkStats" body:argument];
    };
}

- (void)onLocalAudioStats:(RCRTCIWLocalAudioStats *)stats {
    NSDictionary *argument = fromLocalAudioStats(stats);
    if (hasListener) {
        [self sendEventWithName:@"Stats:OnLocalAudioStats" body:argument];
    };
}

- (void)onLocalVideoStats:(RCRTCIWLocalVideoStats *)stats {
    NSDictionary *argument = fromLocalVideoStats(stats);
    if (hasListener) {
        [self sendEventWithName:@"Stats:OnLocalVideoStats" body:argument];
    };
}

- (void)onRemoteAudioStats:(RCRTCIWRemoteAudioStats *)stats {
    NSDictionary *argument = fromRemoteAudioStats(stats);
    if (hasListener) {
        [self sendEventWithName:@"Stats:OnRemoteAudioStats" body:argument];
    };
}

- (void)onRemoteVideoStats:(RCRTCIWRemoteVideoStats *)stats {
    NSDictionary *argument = fromRemoteVideoStats(stats);
    if (hasListener) {
        [self sendEventWithName:@"Stats:OnRemoteVideoStats" body:argument];
    };
}

- (NSArray<NSString *> *)supportedEvents {
    return @[
        @"Engine:OnError",
        @"Engine:OnKicked",
        @"Engine:OnRoomJoined",
        @"Engine:OnRoomLeft",
        @"Engine:OnPublished",
        @"Engine:OnUnpublished",
        @"Engine:OnSubscribed",
        @"Engine:OnUnsubscribed",
        @"Engine:OnLiveMixSubscribed",
        @"Engine:OnLiveMixUnsubscribed",
        @"Engine:OnEnableCamera",
        @"Engine:OnSwitchCamera",
        @"Engine:OnLiveCdnAdded",
        @"Engine:OnLiveCdnRemoved",
        @"Engine:OnLiveMixLayoutModeSet",
        @"Engine:OnLiveMixRenderModeSet",
        @"Engine:OnLiveMixCustomAudiosSet",
        @"Engine:OnLiveMixCustomLayoutsSet",
        @"Engine:OnLiveMixAudioBitrateSet",
        @"Engine:OnLiveMixVideoBitrateSet",
        @"Engine:OnLiveMixVideoResolutionSet",
        @"Engine:OnLiveMixVideoFpsSet",
        @"Engine:OnAudioEffectCreated",
        @"Engine:OnAudioEffectFinished",
        @"Engine:OnAudioMixingStarted",
        @"Engine:OnAudioMixingPaused",
        @"Engine:OnAudioMixingStopped",
        @"Engine:OnAudioMixingFinished",
        @"Engine:OnUserJoined",
        @"Engine:OnUserOffline",
        @"Engine:OnUserLeft",
        @"Engine:OnRemotePublished",
        @"Engine:OnRemoteUnpublished",
        @"Engine:OnRemoteLiveMixPublished",
        @"Engine:OnRemoteLiveMixUnpublished",
        @"Engine:OnRemoteStateChanged",
        @"Engine:OnRemoteFirstFrame",
        @"Engine:OnRemoteLiveMixFirstFrame",
        @"Stats:OnNetworkStats",
        @"Stats:OnLocalAudioStats",
        @"Stats:OnLocalVideoStats",
        @"Stats:OnRemoteAudioStats",
        @"Stats:OnRemoteVideoStats"
    ];
}

@end
  
