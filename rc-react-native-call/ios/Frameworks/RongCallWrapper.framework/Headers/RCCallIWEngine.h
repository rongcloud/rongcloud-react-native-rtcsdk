//
//  RCCallIWEngine.h
//  RongCallWrapper
//
//  Created by joyoki on 2021/7/14.
//

#import <UIKit/UIKit.h>
#import <RongCallWrapper/RCCallIWDefine.h>

@class RCCallIWEngineConfig;
@class RCCallIWPushConfig;
@class RCCallIWAudioConfig;
@class RCCallIWVideoConfig;
@class RCCallIWCallSession;
@class RCCallIWUserProfile;

@protocol RCCallIWEngineDelegate;

NS_ASSUME_NONNULL_BEGIN

@interface RCCallIWEngine : NSObject

/// 获取引擎实例
+ (RCCallIWEngine *)sharedInstance;

/// 引擎配置
- (void)setEngineConfig:(RCCallIWEngineConfig *)config;

/// 推送配置
- (void)setPushConfig:(RCCallIWPushConfig *)callPushConfig
     hangupPushConfig:(RCCallIWPushConfig *)hangupPushConfig;

- (void)setPushConfig:(RCCallIWPushConfig *)callPushConfig
     hangupPushConfig:(RCCallIWPushConfig *)hangupPushConfig
   enableApplePushKit:(BOOL)enableApplePushKit;

/// 音频配置
- (void)setAudioConfig:(RCCallIWAudioConfig *)config;

/// 视频配置
- (void)setVideoConfig:(RCCallIWVideoConfig *)config;

/// 监听设置
- (void)setEngineDelegate:(NSObject<RCCallIWEngineDelegate> *)delegate;

/* 拨打电话-单聊
 * 如果type为音视频，直接打开默认（前置）摄像头。
 */
- (RCCallIWCallSession *)startCall:(NSString *)userId
                              type:(RCCallIWMediaType)type;

- (RCCallIWCallSession *)startCall:(NSString *)userId
                              type:(RCCallIWMediaType)type
                             extra:(nullable NSString *)extra;

/* 拨打电话-群聊
 * 如果type为音视频，直接打开默认（前置）摄像头。
 */
- (RCCallIWCallSession *)startCall:(NSString *)groupId
                           userIds:(NSArray<NSString *> *)userIds
                              type:(RCCallIWMediaType)type;

- (RCCallIWCallSession *)startCall:(NSString *)groupId
                           userIds:(NSArray<NSString *> *)userIds
                              type:(RCCallIWMediaType)type
                             extra:(nullable NSString *)extra;

- (RCCallIWCallSession *)startCall:(NSString *)groupId
                           userIds:(NSArray<NSString *> *)userIds
                   observerUserIds:(nullable NSArray<NSString *> *)observerUserIds
                              type:(RCCallIWMediaType)type;

- (RCCallIWCallSession *)startCall:(NSString *)groupId
                           userIds:(NSArray<NSString *> *)userIds
                   observerUserIds:(nullable NSArray<NSString *> *)observerUserIds
                              type:(RCCallIWMediaType)type
                             extra:(nullable NSString *)extra;

/* 接电话
 * 如果呼入类型为语音通话，即接受语音通话，如果呼入类型为视频通话，即接受视频通话，打开默认（前置）摄像头。
 * 观察者不开启摄像头。
 */
- (void)accept;

/// 挂断电话
- (void)hangup;

/// 麦克风控制
- (void)enableMicrophone:(BOOL)enable;
- (BOOL)isEnableMicrophone;

/// 扬声器控制
- (void)enableSpeaker:(BOOL)enable;
- (BOOL)isEnableSpeaker;

/// 摄像头控制
 - (void)enableCamera:(BOOL)enable;
 - (void)enableCamera:(BOOL)enable camera:(RCCallIWCamera)camera;
 - (BOOL)isEnableCamera;
 - (RCCallIWCamera)currentCamera;
 - (void)switchCamera;

/// 设置预览窗口
- (void)setVideoView:(NSString *)userId
                view:(UIView *)view;
- (void)setVideoView:(NSString *)userId
                view:(UIView *)view
                 fit:(RCCallIWViewFitType)fit;

/// 修改通话类型
- (void)changeMediaType:(RCCallIWMediaType)type;

/// 邀请用户
- (void)inviteUsers:(NSArray<NSString *> *)userIds;
- (void)inviteUsers:(NSArray<NSString *> *)userIds
    observerUserIds:(NSArray<NSString *> *)observerUserIds;

@end


@protocol RCCallIWEngineDelegate <NSObject>

@required
- (void)didReceiveCall:(RCCallIWCallSession *)session;

- (void)callDidConnect;
- (void)callDidDisconnect:(RCCallIWCallDisconnectedReason)reason;

- (void)remoteUserDidJoin:(RCCallIWUserProfile *)user;
- (void)remoteUserDidLeave:(RCCallIWUserProfile *)user
                    reason:(RCCallIWCallDisconnectedReason)reason;

@optional
- (void)didReceiveCallRemoteNotification:(NSString *)callId
                           inviterUserId:(NSString *)inviterUserId
                               mediaType:(RCCallIWMediaType)mediaType
                              userIdList:(NSArray *)userIdList
                                userDict:(NSDictionary *)userDict
                              isVoIPPush:(BOOL)isVoIPPush
                              pushConfig:(RCCallIWPushConfig *)pushConfig;

- (void)didCancelCallRemoteNotification:(NSString *)callId
                          inviterUserId:(NSString *)inviterUserId
                              mediaType:(RCCallIWMediaType)mediaType
                             userIdList:(NSArray *)userIdList
                             pushConfig:(RCCallIWPushConfig *)pushConfig
                         isRemoteCancel:(BOOL)isRemoteCancel;
 
- (void)didEnableCamera:(RCCallIWCamera)camera
                 enable:(BOOL)enable;
- (void)didSwitchCamera:(RCCallIWCamera)camera;
- (void)callDidError:(int)code;
- (void)callDidMake;
- (void)remoteUserDidRing:(NSString *)userId;
- (void)remoteUserDidInvite:(NSString *)userId
                  mediaType:(RCCallIWMediaType)mediaType;
- (void)remoteUserDidChangeMediaType:(RCCallIWUserProfile *)user
                           mediaType:(RCCallIWMediaType)mediaType;
- (void)remoteUserDidChangeMicrophoneState:(RCCallIWUserProfile *)user
                                    enable:(BOOL)enable;
- (void)remoteUserDidChangeCameraState:(RCCallIWUserProfile *)user
                                enable:(BOOL)enable;
- (void)user:(RCCallIWUserProfile *)user networkQuality:(RCCallIWNetworkQuality)quality;
- (void)user:(RCCallIWUserProfile *)user audioVolume:(int)volume;

@end

NS_ASSUME_NONNULL_END
