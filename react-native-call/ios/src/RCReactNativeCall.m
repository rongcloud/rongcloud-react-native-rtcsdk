#import "RCReactNativeCall.h"
#import <RongCallLib/RongCallLib.h>

@implementation RCReactNativeCall

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(startCall:(NSDictionary *)arguments resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    int type = [arguments[@"type"] intValue];
    NSString *target = arguments[@"target"];
    NSArray *users = @[target];
    int media = [arguments[@"media"] intValue];
    NSString *extra = arguments[@"extra"];
    RCCallSession *session = [[RCCallClient sharedRCCallClient] startCall:(RCConversationType)type
                                                                 targetId:target
                                                                       to:users
                                                                mediaType:(RCCallMediaType)media
                                                          sessionDelegate:nil
                                                                    extra:extra];
    resolve(session);
}

@end

