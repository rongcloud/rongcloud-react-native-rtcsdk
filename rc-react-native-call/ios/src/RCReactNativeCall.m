#import "RCReactNativeCall.h"
#import <Foundation/Foundation.h>
#import <RongCallWrapper/RongCallWrapper.h>
#import <React/RCTUIManager.h>

@implementation RCReactNativeCall

@synthesize bridge = _bridge;

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(test:(nonnull NSNumber *)reactTag)
{
    UIView *uiView = [self.bridge.uiManager viewForReactTag:reactTag];
    if ([uiView isKindOfClass:[UIView class]]) {
       
    }
}
//has unspecified nullability but React requires that NSNumber ar
@end

