//
//  RCCallIWVideoConfig.h
//  RongCallWrapper
//
//  Created by joyoki on 2021/7/14.
//

#import <Foundation/Foundation.h>
#import <RongCallWrapper/RCCallIWDefine.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCCallIWVideoConfig : NSObject
/*
 * 默认值 RCCallIW_VIDEO_PROFILE_720_1280
 */
@property (nonatomic, assign) RCCallIWVideoProfile profile;
/*
 * 默认值 RCCallIWCameraFront
 */
@property (nonatomic, assign) RCCallIWCamera defaultCamera;
/*
 * 默认值 RCCallIWCameraOrientationPortrait
 */
@property (nonatomic, assign) RCCallIWCameraOrientation cameraOrientation;

@end

NS_ASSUME_NONNULL_END
