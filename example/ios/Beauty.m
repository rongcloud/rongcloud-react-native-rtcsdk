//
//  Beauty.m
//  ReactNativeRtcExample
//
//  Created by 廖坤 on 2022/2/28.
//

#import "Beauty.h"
#import <rongcloud-react-native-rtc/RCReactNativeRtc.h>
#import "GPUImageHandle.h"
#import <React/RCTBridge.h>
@interface Beauty () <RCRTCIWSampleBufferVideoFrameDelegate,RCTBridgeModule>
@property (nonatomic, strong, nullable) GPUImageHandle *handle;
@end

@implementation Beauty

- (CMSampleBufferRef)onSampleBuffer:(CMSampleBufferRef)sampleBuffer {
    CMSampleBufferRef processedSampleBuffer = [self.handle onGPUFilterSource:sampleBuffer];
    return processedSampleBuffer ?: sampleBuffer;
}

RCT_EXPORT_MODULE();
                  
RCT_EXPORT_METHOD(openBeauty:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  if (!self.handle) {
    self.handle = [[GPUImageHandle alloc] init];
    [self.handle onlyBeauty];
  }
  [[RCReactNativeRtc sharedInstance] setLocalVideoProcessedDelegate:self];
  resolve(@(0));
}

RCT_EXPORT_METHOD(closeBeauty:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  [[RCReactNativeRtc sharedInstance] setLocalVideoProcessedDelegate:nil];
  resolve(@(0));
}
@end
