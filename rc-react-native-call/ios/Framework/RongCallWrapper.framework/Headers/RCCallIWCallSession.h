//
//  RCCallIWCallSession.h
//  RongCallWrapper
//
//  Created by joyoki on 2021/7/14.
//

#import <Foundation/Foundation.h>
#import <RongCallWrapper/RCCallIWUserProfile.h>
#import <RongCallWrapper/RCCallIWDefine.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCCallIWCallSession : NSObject

@property (nonatomic, readonly) RCCallIWCallType callType;
@property (nonatomic, readonly) RCCallIWMediaType mediaType;
@property (nonatomic, readonly) NSString *callId;
@property (nonatomic, readonly) NSString *targetId;
@property (nonatomic, readonly) NSString *sessionId;
@property (nonatomic, readonly) NSString *extra;
@property (nonatomic, readonly) long long startTime;
@property (nonatomic, readonly) long long connectedTime;
@property (nonatomic, readonly) long long endTime;
@property (nonatomic, readonly) RCCallIWUserProfile *caller; // 当前通话发起者
@property (nonatomic, readonly) RCCallIWUserProfile *inviter; // 邀请当前用户到当前通话的邀请者
@property (nonatomic, readonly) RCCallIWUserProfile *mine; // 当前用户
@property (nonatomic, readonly) NSArray<RCCallIWUserProfile *> *users; // 当前通话的全部用户列表

@end

NS_ASSUME_NONNULL_END
