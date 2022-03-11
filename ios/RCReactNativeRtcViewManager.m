//
//  RCReactNativeRtcViewManager.m
//  RCReactNativeRtc
//
//  Created by 潘铭达 on 2021/7/13.
//

#import "RCReactNativeRtcViewManager.h"
#import <RongRTCLibWrapper/RongRTCLibWrapper.h>

@implementation RCReactNativeRtcViewManager

RCT_EXPORT_MODULE(RCReactNativeRtcView)

RCT_EXPORT_VIEW_PROPERTY(fitType, int);

RCT_EXPORT_VIEW_PROPERTY(mirror, BOOL);

- (UIView *)view {
    RCRTCIWView *view = [RCRTCIWView create];
    return view;
}

@end
