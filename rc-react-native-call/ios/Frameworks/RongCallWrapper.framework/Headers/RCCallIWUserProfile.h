//
//  RCCallIWUserProfile.h
//  RongCallWrapper
//
//  Created by joyoki on 2021/7/14.
//

#import <Foundation/Foundation.h>
#import <RongCallWrapper/RCCallIWDefine.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCCallIWUserProfile : NSObject

@property (nonatomic, readonly) RCCallIWUserType userType;
@property (nonatomic, readonly) RCCallIWMediaType mediaType;
@property (nonatomic, readonly) NSString *userId;
@property (nonatomic, readonly) NSString *mediaId;
@property (nonatomic, readonly) BOOL enableCamera;
@property (nonatomic, readonly) BOOL enableMicrophone;

@end

NS_ASSUME_NONNULL_END
