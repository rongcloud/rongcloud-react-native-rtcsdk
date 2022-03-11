//
//  ArgumentAdapter.cpp
//  rongcloud_rtc_wrapper_plugin
//
//  Created by 潘铭达 on 2021/6/11.
//

#import "ArgumentAdapter.h"

RCRTCIWMediaType toMediaType(int type) {
    return (RCRTCIWMediaType) type;
}

RCRTCIWCamera toCamera(int camera) {
    return (RCRTCIWCamera) (camera - 1);
}

RCRTCIWCameraCaptureOrientation toCameraCaptureOrientation(int orientation) {
    return (RCRTCIWCameraCaptureOrientation) (orientation + 1);
}

RCRTCIWLiveMixLayoutMode toLiveMixLayoutMode(int mode) {
    return (RCRTCIWLiveMixLayoutMode) (mode + 1);
}

RCRTCIWLiveMixRenderMode toLiveMixRenderMode(int mode) {
    return (RCRTCIWLiveMixRenderMode) (mode + 1);
}

RCRTCIWVideoResolution toVideoResolution(int resolution) {
    return (RCRTCIWVideoResolution) resolution;
}

RCRTCIWVideoFps toVideoFps(int fps) {
    return (RCRTCIWVideoFps) fps;
}

RCRTCIWAudioMixingMode toAudioMixingMode(int mode) {
    return (RCRTCIWAudioMixingMode) mode;
}

RCRTCIWAudioCodecType toAudioCodecType(int type) {
    switch (type) {
        case 1:
            return RCRTCIWAudioCodecTypeOPUS;
        default:
            return RCRTCIWAudioCodecTypePCMU;
    }
}

RCRTCIWRole toRole(int role) {
    return (RCRTCIWRole) role;
}

RCRTCIWAudioQuality toAudioQuality(int quality) {
    switch (quality) {
        case 1:
            return RCRTCIWAudioQualityMusic;
        case 2:
            return RCRTCIWAudioQualityMusicHigh;
        default:
            return RCRTCIWAudioQualitySpeech;
    }
}

RCRTCIWAudioScenario toAudioScenario(int scenario) {
    return (RCRTCIWAudioScenario) scenario;
}

RCRTCIWStreamType toStreamType(int type) {
    return (RCRTCIWStreamType) (type - 1);
}

int getInt(NSDictionary *arguments, NSString *key, int defaultValue) {
    if (![arguments[key] isEqual:[NSNull null]]) {
        return [arguments[key] intValue];
    }
    return defaultValue;
}

bool getBool(NSDictionary *arguments, NSString *key, bool defaultValue) {
    if (![arguments[key] isEqual:[NSNull null]]) {
        return [arguments[key] boolValue];
    }
    return defaultValue;
}

RCRTCIWAudioSetup *toAudioSetup(NSDictionary *arguments) {
    int codec = getInt(arguments, @"codec", 1); // default opus
    RCRTCIWAudioSetup *setup = [[RCRTCIWAudioSetup alloc] init];
    setup.type = toAudioCodecType(codec);
    return setup;
}

RCRTCIWVideoSetup *toVideoSetup(NSDictionary *arguments) {
    bool enableTinyStream = getBool(arguments, @"enableTinyStream", true);
    RCRTCIWVideoSetup *setup = [[RCRTCIWVideoSetup alloc] init];
    setup.enableTinyStream = enableTinyStream;
    return setup;
}

RCRTCIWEngineSetup *toEngineSetup(NSDictionary *arguments) {
    bool reconnectable = getBool(arguments, @"reconnectable", true);
    int statsReportInterval = getInt(arguments, @"statsReportInterval", 1000);
    id mediaUrl = arguments[@"mediaUrl"];
    id audioSetup = arguments[@"audioSetup"];
    id videoSetup = arguments[@"videoSetup"];
    RCRTCIWEngineSetup *setup = [[RCRTCIWEngineSetup alloc] init];
    setup.reconnectable = reconnectable;
    setup.statsReportInterval = statsReportInterval;
    if (![mediaUrl isEqual:[NSNull null]]) {
        setup.mediaUrl = mediaUrl;
    }
    if (![audioSetup isEqual:[NSNull null]]) {
        setup.audioSetup = toAudioSetup(audioSetup);
    }
    if (![videoSetup isEqual:[NSNull null]]) {
        setup.videoSetup = toVideoSetup(videoSetup);
    }
    return setup;
}

RCRTCIWRoomSetup *toRoomSetup(NSDictionary *arguments) {
    int type = getInt(arguments, @"type", 2); // default audio_video
    int role = getInt(arguments, @"role", 0); // default meeting_member
    RCRTCIWRoomSetup *setup = [[RCRTCIWRoomSetup alloc] init];
    setup.type = toMediaType(type);
    setup.role = toRole(role);
    return setup;
}

RCRTCIWAudioConfig *toAudioConfig(NSDictionary *arguments) {
    int quality = getInt(arguments, @"quality", 0); // speech
    int scenario = getInt(arguments, @"scenario", 0); // normal
    RCRTCIWAudioConfig *config = [[RCRTCIWAudioConfig alloc] init];
    config.quality = toAudioQuality(quality);
    config.scenario = toAudioScenario(scenario);
    return config;
}

RCRTCIWVideoConfig *toVideoConfig(NSDictionary *arguments) {
    int minBitrate = getInt(arguments, @"minBitrate", 250);
    int maxBitrate = getInt(arguments, @"maxBitrate", 2200);
    int fps = getInt(arguments, @"fps", 2); // default 25fps
    int resolution = getInt(arguments, @"resolution", 15); // default 720p
    RCRTCIWVideoConfig *config = [[RCRTCIWVideoConfig alloc] init];
    config.minBitrate = minBitrate;
    config.maxBitrate = maxBitrate;
    config.fps = toVideoFps(fps);
    config.resolution = toVideoResolution(resolution);
    return config;
}

RCRTCIWCustomLayout *toLiveMixCustomLayout(NSDictionary *arguments) {
    NSString *uid = arguments[@"id"];
    int x = getInt(arguments, @"x", 0);
    int y = getInt(arguments, @"y", 0);
    int width = getInt(arguments, @"width", 480);
    int height = getInt(arguments, @"height", 640);
    RCRTCIWStreamType type = toStreamType([arguments[@"type"] intValue]);
    NSString *tag = arguments[@"tag"];
    RCRTCIWCustomLayout *layout = [[RCRTCIWCustomLayout alloc] initWithStreamType:type userId:uid tag:tag];
    layout.x = x;
    layout.y = y;
    layout.width = width;
    layout.height = height;
    return layout;
}

NSArray<RCRTCIWCustomLayout *> *toLiveMixCustomLayouts(NSArray<NSDictionary *> *arguments) {
    NSMutableArray *layouts = [NSMutableArray array];
    for (NSDictionary *argument in arguments) {
        [layouts addObject:toLiveMixCustomLayout(argument)];
    }
    return layouts;
}

NSDictionary *fromNetworkStats(RCRTCIWNetworkStats *stats) {
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
    [dictionary setObject:@((int) stats.type) forKey:@"type"];
    [dictionary setObject:stats.ip forKey:@"ip"];
    [dictionary setObject:@(stats.sendBitrate) forKey:@"sendBitrate"];
    [dictionary setObject:@(stats.receiveBitrate) forKey:@"receiveBitrate"];
    [dictionary setObject:@(stats.rtt) forKey:@"rtt"];
    return dictionary;
}

int fromAudioCodecType(RCRTCIWAudioCodecType type) {
    switch (type) {
        case RCRTCIWAudioCodecTypePCMU:
            return 0;
        default:
            return 1;
    }
}

NSDictionary *fromLocalAudioStats(RCRTCIWLocalAudioStats *stats) {
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
    [dictionary setObject:@(fromAudioCodecType(stats.codec)) forKey:@"codec"];
    [dictionary setObject:@(stats.bitrate) forKey:@"bitrate"];
    [dictionary setObject:@(stats.volume) forKey:@"volume"];
    [dictionary setObject:@(stats.packageLostRate) forKey:@"packageLostRate"];
    return dictionary;
}

NSDictionary *fromLocalVideoStats(RCRTCIWLocalVideoStats *stats) {
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
    [dictionary setObject:@(stats.tiny) forKey:@"tiny"];
    [dictionary setObject:@((int) stats.codec) forKey:@"codec"];
    [dictionary setObject:@(stats.bitrate) forKey:@"bitrate"];
    [dictionary setObject:@(stats.fps) forKey:@"fps"];
    [dictionary setObject:@(stats.width) forKey:@"width"];
    [dictionary setObject:@(stats.height) forKey:@"height"];
    [dictionary setObject:@(stats.packageLostRate) forKey:@"packageLostRate"];
    return dictionary;
}

NSDictionary *fromRemoteAudioStats(RCRTCIWRemoteAudioStats *stats) {
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
    [dictionary setObject:@(fromAudioCodecType(stats.codec)) forKey:@"codec"];
    [dictionary setObject:@(stats.bitrate) forKey:@"bitrate"];
    [dictionary setObject:@(stats.volume) forKey:@"volume"];
    [dictionary setObject:@(stats.packageLostRate) forKey:@"packageLostRate"];
    [dictionary setObject:@(stats.rtt) forKey:@"rtt"];
    return dictionary;
}

NSDictionary *fromRemoteVideoStats(RCRTCIWRemoteVideoStats *stats) {
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
    [dictionary setObject:@((int) stats.codec) forKey:@"codec"];
    [dictionary setObject:@(stats.bitrate) forKey:@"bitrate"];
    [dictionary setObject:@(stats.fps) forKey:@"fps"];
    [dictionary setObject:@(stats.width) forKey:@"width"];
    [dictionary setObject:@(stats.height) forKey:@"height"];
    [dictionary setObject:@(stats.packageLostRate) forKey:@"packageLostRate"];
    [dictionary setObject:@(stats.rtt) forKey:@"rtt"];
    return dictionary;
}
