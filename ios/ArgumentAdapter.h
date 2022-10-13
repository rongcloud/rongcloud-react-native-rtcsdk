//
//  ArgumentAdapter.hpp
//  rongcloud_rtc_wrapper_plugin
//
//  Created by 潘铭达 on 2021/6/11.
//

#ifndef ArgumentAdapter_h
#define ArgumentAdapter_h

#import <RongRTCLibWrapper/RCRTCIWEngine.h>

#ifdef __cplusplus
extern "C" {
#endif

RCRTCIWMediaType toMediaType(int type);

RCRTCIWCamera toCamera(int camera);

RCRTCIWCameraCaptureOrientation toCameraCaptureOrientation(int orientation);

RCRTCIWLiveMixLayoutMode toLiveMixLayoutMode(int mode);

RCRTCIWLiveMixRenderMode toLiveMixRenderMode(int mode);

RCRTCIWVideoResolution toVideoResolution(int resolution);

RCRTCIWAudioMixingMode toAudioMixingMode(int mode);

RCRTCIWAudioCodecType toAudioCodecType(int type);

RCRTCIWAudioQuality toAudioQuality(int quality);

RCRTCIWAudioScenario toAudioScenario(int scenario);

RCRTCIWEngineSetup *toEngineSetup(NSDictionary *arguments);

RCRTCIWRoomSetup *toRoomSetup(NSDictionary *arguments);

RCRTCIWAudioConfig *toAudioConfig(NSDictionary *arguments);

RCRTCIWVideoConfig *toVideoConfig(NSDictionary *arguments);

NSArray<RCRTCIWCustomLayout *> *toLiveMixCustomLayouts(NSArray<NSDictionary *> *arguments);

NSDictionary *fromNetworkStats(RCRTCIWNetworkStats *stats);

NSDictionary *fromNetworkProbeStats(RCRTCIWNetworkProbeStats *stats);

NSDictionary *fromLocalAudioStats(RCRTCIWLocalAudioStats *stats);

NSDictionary *fromLocalVideoStats(RCRTCIWLocalVideoStats *stats);

NSDictionary *fromRemoteAudioStats(RCRTCIWRemoteAudioStats *stats);

NSDictionary *fromRemoteVideoStats(RCRTCIWRemoteVideoStats *stats);

RCRTCIWRole toRole(NSUInteger role);

NSUInteger RoleToNum(RCRTCIWRole role);

RCRTCIWVideoFps toVideoFps(NSUInteger fps);

NSUInteger VideoFpsToNum(RCRTCIWVideoFps fps);


#ifdef __cplusplus
}
#endif

#endif /* ArgumentAdapter_h */
