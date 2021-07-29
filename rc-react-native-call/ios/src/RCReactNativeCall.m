#import "RCReactNativeCall.h"
#import <Foundation/Foundation.h>
#import <RongCallWrapper/RongCallWrapper.h>
#import <React/RCTUIManager.h>
#import "RCReactNativeCallArgumentAdapter.h"
#import "RCReactNativeCallVideoView.h"

@interface RCReactNativeCall ()<RCCallIWEngineDelegate>

@property (nonatomic, assign) BOOL hasListener;
@property (nonatomic, strong) NSDictionary<NSString *, NSString *> *mapEvents;

@end

@implementation RCReactNativeCall

//@synthesize bridge = _bridge;

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

- (void)startObserving {
    self.hasListener = YES;
}

- (void)stopObserving {
    self.hasListener = NO;
}

RCT_EXPORT_MODULE();

#pragma mark - RN API...

/// 初始化 设置代理
RCT_REMAP_METHOD(init, rcNativeInit)
{
    [[RCCallIWEngine sharedInstance] setEngineDelegate:self];
}

RCT_EXPORT_METHOD(unInit)
{
    [[RCCallIWEngine sharedInstance] setEngineDelegate:nil];
}


/// 引擎配置
RCT_EXPORT_METHOD(setEngineConfig:(NSDictionary *)config)
{
    [[RCCallIWEngine sharedInstance] setEngineConfig:toCallIWEngineConfig(config)];
}

/// 推送配置
RCT_EXPORT_METHOD(setPushConfig:(NSDictionary *)callPushConfig
                  hangupPushConfig:(NSDictionary *)hangupPushConfig
                  enableApplePushKit:(BOOL)enableApplePushKit)
{
    [[RCCallIWEngine sharedInstance] setPushConfig:toCallIWPushConfig(callPushConfig) hangupPushConfig:toCallIWPushConfig(hangupPushConfig) enableApplePushKit:enableApplePushKit];
}

/// 音频配置
RCT_EXPORT_METHOD(setAudioConfig:(NSDictionary *)config)
{
    [[RCCallIWEngine sharedInstance] setAudioConfig:toCallIWAudioConfig(config)];
}

/// 视频配置
RCT_EXPORT_METHOD(setVideoConfig:(NSDictionary *)config)
{
    [[RCCallIWEngine sharedInstance] setVideoConfig:toCallIWVideoConfig(config)];
}

/* 拨打电话-单聊
 * 如果type为音视频，直接打开默认（前置）摄像头。
 */
RCT_EXPORT_METHOD(startSingleCall:(NSString *)userId
                  type:(int)type
                  extra:(NSString *)extra)
{
    [[RCCallIWEngine sharedInstance] startCall:userId
                                          type:toCallIWMediaType(type)
                                        extra:extra];
}

/* 拨打电话-群聊
 * 如果type为音视频，直接打开默认（前置）摄像头。
 */
RCT_EXPORT_METHOD(startGroupCall:(NSString *)groupId
                  userIds:(NSArray *)userIds
                  observerUserIds:(NSArray *)observerUserIds
                  type:(int)type
                  extra:(NSString *)extra)
{
    [[RCCallIWEngine sharedInstance] startCall:groupId
                                       userIds:userIds
                               observerUserIds:observerUserIds
                                          type:type
                                         extra:extra];
}

/// 获取当前call session
RCT_EXPORT_METHOD(getCurrentCallSession:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject)
{
    resolve(fromCallIWCallSession([[RCCallIWEngine sharedInstance] getCurrentCallSession]));
}

/* 接电话
 * 如果呼入类型为语音通话，即接受语音通话，如果呼入类型为视频通话，即接受视频通话，打开默认（前置）摄像头。
 * 观察者不开启摄像头。
 */
RCT_EXPORT_METHOD(accept)
{
    [[RCCallIWEngine sharedInstance] accept];
}

/// 挂断电话
RCT_EXPORT_METHOD(hangup)
{
    [[RCCallIWEngine sharedInstance] hangup];
}

/// 麦克风控制
RCT_EXPORT_METHOD(enableMicrophone:(BOOL)enable)
{
    [[RCCallIWEngine sharedInstance] enableMicrophone:enable];
}

RCT_EXPORT_METHOD(isEnableMicrophone:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject)
{
    resolve(@([[RCCallIWEngine sharedInstance] isEnableMicrophone]));
}

/// 扬声器控制
RCT_EXPORT_METHOD(enableSpeaker:(BOOL)enable)
{
    [[RCCallIWEngine sharedInstance] enableSpeaker:enable];
}

RCT_EXPORT_METHOD(isEnableSpeaker:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject)
{
    resolve(@([[RCCallIWEngine sharedInstance] isEnableSpeaker]));
}

/// 摄像头控制
RCT_EXPORT_METHOD(enableCamera:(BOOL)enable
                  camera:(int)camera)
{
    [[RCCallIWEngine sharedInstance] enableCamera:enable camera:toCallIWCamera(camera)];
}
 
RCT_EXPORT_METHOD(isEnableCamera:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject)
{
    resolve(@([[RCCallIWEngine sharedInstance] isEnableCamera]));
}

RCT_EXPORT_METHOD(currentCamera:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject)
{
    resolve(@(fromCallIWCamera([[RCCallIWEngine sharedInstance] currentCamera])));
}
 
RCT_EXPORT_METHOD(switchCamera)
{
    [[RCCallIWEngine sharedInstance] switchCamera];
}
 
/// 设置预览窗口
RCT_EXPORT_METHOD(setVideoView:(NSString *)userId
                  view:(nonnull NSNumber *)reactTag
                  fit:(int)fit)
{
    UIView *videoView = [self.bridge.uiManager viewForReactTag:reactTag];
    if (videoView && [videoView isKindOfClass:[RCReactNativeCallVideoView class]]) {
        [[RCCallIWEngine sharedInstance] setVideoView:userId
                                                 view:videoView
                                                  fit:toCallIWViewFitType(fit)];
    }
}

/// 修改通话类型
RCT_EXPORT_METHOD(changeMediaType:(int)type)
{
    [[RCCallIWEngine sharedInstance] changeMediaType:toCallIWMediaType(type)];
}

/// 邀请用户
RCT_EXPORT_METHOD(inviteUsers:(NSArray<NSString *> *)userIds
                  observerUserIds:(NSArray<NSString *> *)observerUserIds)
{
    [[RCCallIWEngine sharedInstance] inviteUsers:userIds
                                 observerUserIds:observerUserIds];
}

#pragma mark - RCTEventEmitter
- (NSArray<NSString *> *)supportedEvents {
    return self.mapEvents.allValues;
}

#pragma mark - RCCallIWEngineDelegate

#define kRCRNEventName self.mapEvents[NSStringFromSelector(_cmd)]

//@required
- (void)callDidConnect {
    
    RCRNReturnIfFalse(self.hasListener)
    
    [self sendEventWithName:kRCRNEventName body:nil];
}

- (void)callDidDisconnect:(RCCallIWCallDisconnectedReason)reason {
    
    RCRNReturnIfFalse(self.hasListener)
   
    [self sendEventWithName:kRCRNEventName body:@(fromCallIWCallDisconnectedReason(reason))];
}

- (void)didReceiveCall:(nonnull RCCallIWCallSession *)session {
    
    RCRNReturnIfFalse(self.hasListener)
    
    [self sendEventWithName:kRCRNEventName body:fromCallIWCallSession(session)];
}

- (void)remoteUserDidJoin:(nonnull RCCallIWUserProfile *)user {
    
    RCRNReturnIfFalse(self.hasListener)
    
    [self sendEventWithName:kRCRNEventName body:fromCallIWUserProfile(user)];
}

- (void)remoteUserDidLeave:(nonnull RCCallIWUserProfile *)user reason:(RCCallIWCallDisconnectedReason)reason {
    
    RCRNReturnIfFalse(self.hasListener)
    
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setValue:fromCallIWUserProfile(user) forKey:@"user"];
    [arguments setValue:@(fromCallIWCallDisconnectedReason(reason)) forKey:@"reason"];
    [self sendEventWithName:kRCRNEventName body:arguments];
}

//@optional
- (void)didReceiveCallRemoteNotification:(NSString *)callId
                           inviterUserId:(NSString *)inviterUserId
                               mediaType:(RCCallIWMediaType)mediaType
                              userIdList:(NSArray *)userIdList
                                userDict:(NSDictionary *)userDict
                              isVoIPPush:(BOOL)isVoIPPush
                              pushConfig:(RCCallIWPushConfig *)pushConfig {
    
    RCRNReturnIfFalse(self.hasListener)
    
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setValue:callId forKey:@"callId"];
    [arguments setValue:inviterUserId forKey:@"inviterUserId"];
    [arguments setValue:@(fromCallIWMediaType(mediaType)) forKey:@"mediaType"];
    [arguments setValue:userIdList forKey:@"userIdList"];
    [arguments setValue:userDict forKey:@"userDict"];
    [arguments setValue:@(isVoIPPush) forKey:@"isVoIPPush"];
    [arguments setValue:fromCallIWPushConfig(pushConfig) forKey:@"pushConfig"];
    [self sendEventWithName:kRCRNEventName body:arguments];
}

- (void)didCancelCallRemoteNotification:(NSString *)callId
                          inviterUserId:(NSString *)inviterUserId
                              mediaType:(RCCallIWMediaType)mediaType
                             userIdList:(NSArray *)userIdList
                             pushConfig:(RCCallIWPushConfig *)pushConfig
                         isRemoteCancel:(BOOL)isRemoteCancel {
    
    RCRNReturnIfFalse(self.hasListener)
    
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setValue:callId forKey:@"callId"];
    [arguments setValue:inviterUserId forKey:@"inviterUserId"];
    [arguments setValue:@(fromCallIWMediaType(mediaType)) forKey:@"mediaType"];
    [arguments setValue:userIdList forKey:@"userIdList"];
    [arguments setValue:fromCallIWPushConfig(pushConfig) forKey:@"pushConfig"];
    [arguments setValue:@(isRemoteCancel) forKey:@"isRemoteCancel"];
    [self sendEventWithName:kRCRNEventName body:arguments];
}
 
- (void)didEnableCamera:(RCCallIWCamera)camera
                 enable:(BOOL)enable {
    
    RCRNReturnIfFalse(self.hasListener)
    
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setValue:@(fromCallIWCamera(camera)) forKey:@"camera"];
    [arguments setValue:@(enable) forKey:@"enable"];
    [self sendEventWithName:kRCRNEventName body:arguments];
}

- (void)didSwitchCamera:(RCCallIWCamera)camera {
    
    RCRNReturnIfFalse(self.hasListener)
    
    [self sendEventWithName:kRCRNEventName body:@(fromCallIWCamera(camera))];
}

- (void)callDidError:(int)code {
    
    RCRNReturnIfFalse(self.hasListener)
    
    [self sendEventWithName:kRCRNEventName body:@(code)];
}

- (void)callDidMake {
    
    RCRNReturnIfFalse(self.hasListener)
    
    [self sendEventWithName:kRCRNEventName body:nil];
}

- (void)remoteUserDidRing:(NSString *)userId {
    
    RCRNReturnIfFalse(self.hasListener)
    
    [self sendEventWithName:kRCRNEventName body:userId];
}

- (void)remoteUserDidInvite:(NSString *)userId
                  mediaType:(RCCallIWMediaType)mediaType {
    
    RCRNReturnIfFalse(self.hasListener)
    
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setValue:userId forKey:@"userId"];
    [arguments setValue:@(fromCallIWMediaType(mediaType)) forKey:@"mediaType"];
    [self sendEventWithName:kRCRNEventName body:arguments];
}

- (void)remoteUserDidChangeMediaType:(RCCallIWUserProfile *)user
                           mediaType:(RCCallIWMediaType)mediaType {
    
    RCRNReturnIfFalse(self.hasListener)
    
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setValue:fromCallIWUserProfile(user) forKey:@"user"];
    [arguments setValue:@(fromCallIWMediaType(mediaType)) forKey:@"mediaType"];
    [self sendEventWithName:kRCRNEventName body:arguments];
}

- (void)remoteUserDidChangeMicrophoneState:(RCCallIWUserProfile *)user
                                    enable:(BOOL)enable {
    
    RCRNReturnIfFalse(self.hasListener)
    
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setValue:fromCallIWUserProfile(user) forKey:@"user"];
    [arguments setValue:@(enable) forKey:@"enable"];
    [self sendEventWithName:kRCRNEventName body:arguments];
}

- (void)remoteUserDidChangeCameraState:(RCCallIWUserProfile *)user
                                enable:(BOOL)enable {
    
    RCRNReturnIfFalse(self.hasListener)
    
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setValue:fromCallIWUserProfile(user) forKey:@"user"];
    [arguments setValue:@(enable) forKey:@"enable"];
    [self sendEventWithName:kRCRNEventName body:arguments];
}

- (void)user:(RCCallIWUserProfile *)user networkQuality:(RCCallIWNetworkQuality)quality {
    
    RCRNReturnIfFalse(self.hasListener)
    
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setValue:fromCallIWUserProfile(user) forKey:@"user"];
    [arguments setValue:@(fromCallIWNetworkQuality(quality)) forKey:@"quality"];
    [self sendEventWithName:kRCRNEventName body:arguments];
}

- (void)user:(RCCallIWUserProfile *)user audioVolume:(int)volume {
    
    RCRNReturnIfFalse(self.hasListener)
    
    NSMutableDictionary *arguments = [NSMutableDictionary dictionary];
    [arguments setValue:fromCallIWUserProfile(user) forKey:@"user"];
    [arguments setValue:@(volume) forKey:@"volume"];
    [self sendEventWithName:kRCRNEventName body:arguments];
}

- (NSDictionary<NSString *, NSString *> *)mapEvents {
    if (!_mapEvents) {
        _mapEvents = @{
            NSStringFromSelector(@selector(didReceiveCall:)): @"Engine:OnReceiveCall",
            NSStringFromSelector(@selector(callDidConnect)): @"Engine:OnCallConnect",
            NSStringFromSelector(@selector(callDidDisconnect:)): @"Engine:OnCallDisconnect",
            NSStringFromSelector(@selector(remoteUserDidJoin:)): @"Engine:OnRemoteUserJoin",
            NSStringFromSelector(@selector(remoteUserDidLeave:reason:)): @"Engine:OnRemoteUserLeave",
            NSStringFromSelector(@selector(didReceiveCallRemoteNotification:inviterUserId:mediaType:userIdList:userDict:isVoIPPush:pushConfig:)): @"Engine:OnReceiveCallRemoteNotification",
            NSStringFromSelector(@selector(didCancelCallRemoteNotification:inviterUserId:mediaType:userIdList:pushConfig:isRemoteCancel:)): @"Engine:OnCancelCallRemoteNotification",
            NSStringFromSelector(@selector(didEnableCamera:enable:)): @"Engine:OnEnableCamera",
            NSStringFromSelector(@selector(didSwitchCamera:)): @"Engine:OnSwitchCamera",
            NSStringFromSelector(@selector(callDidError:)): @"Engine:OnCallError",
            NSStringFromSelector(@selector(callDidMake)): @"Engine:OnCallMake",
            NSStringFromSelector(@selector(remoteUserDidRing:)): @"Engine:OnRemoteUserRing",
            NSStringFromSelector(@selector(remoteUserDidInvite:mediaType:)): @"Engine:OnRemoteUserInvite",
            NSStringFromSelector(@selector(remoteUserDidChangeMediaType:mediaType:)): @"Engine:OnRemoteUserChangeMediaType",
            NSStringFromSelector(@selector(remoteUserDidChangeMicrophoneState:enable:)): @"Engine:OnRemoteUserChangeMicrophoneState",
            NSStringFromSelector(@selector(remoteUserDidChangeCameraState:enable:)): @"Engine:OnRemoteUserChangeCameraState",
            NSStringFromSelector(@selector(user:networkQuality:)): @"Engine:OnUserNetworkQuality:",
            NSStringFromSelector(@selector(user:audioVolume:)): @"Engine:OnUserAudioVolume:"
        };
    }
    return _mapEvents;
}

@end

