#import "RCReactNativeIm.h"

#import <RongIMLib/RongIMLib.h>

@implementation RCReactNativeIm

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(init:(NSString *)key
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[RCIMClient sharedRCIMClient] initWithAppKey:key];
    resolve(nil);
}

RCT_EXPORT_METHOD(connect:(NSString *)token
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[RCIMClient sharedRCIMClient] connectWithToken:token dbOpened:^(RCDBErrorCode code) {
    } success:^(NSString *userId) {
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setObject:@(0) forKey:@"error"];
        [dic setObject:userId forKey:@"userId"];
        resolve(dic);
    } error:^(RCConnectErrorCode errorCode) {
        NSMutableDictionary *dic = [NSMutableDictionary dictionary];
        [dic setObject:@(errorCode) forKey:@"error"];
        resolve(dic);
    }];
}

RCT_EXPORT_METHOD(disconnect:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
    [[RCIMClient sharedRCIMClient] disconnect];
    resolve(nil);
}

@end
  
