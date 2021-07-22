//
//  RCCallIWEngineConfig.h
//  RongCallWrapper
//
//  Created by joyoki on 2021/7/14.
//

#import <Foundation/Foundation.h>

/*
 * 引擎配置
 */

NS_ASSUME_NONNULL_BEGIN

@interface RCCallIWEngineConfig : NSObject

/// 开启通话记录 默认NO
@property (nonatomic, assign) BOOL enableCallSummary;

@end

NS_ASSUME_NONNULL_END
