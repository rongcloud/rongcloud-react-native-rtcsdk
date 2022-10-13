
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

#if __has_include("RCTEventEmitter.h")
#import "RCTEventEmitter.h"
#else
#import <React/RCTEventEmitter.h>
#endif

#import "Macros.h"
#import <RongRTCLibWrapper/RCRTCIWEngine.h>

@interface RCReactNativeRCVersion : NSObject

@end

@interface RCReactNativeRtc : RCTEventEmitter <RCTBridgeModule>
SingleInstanceH(Instance);

- (NSInteger)setLocalAudioCapturedDelegate:(id<RCRTCIWAudioFrameDelegate> _Nullable)delegate;

- (NSInteger)setLocalAudioMixedDelegate:(id<RCRTCIWAudioFrameDelegate> _Nullable)delegate;

- (NSInteger)setRemoteAudioReceivedDelegate:(id<RCRTCIWAudioFrameDelegate> _Nullable)delegate
                                     userId:(NSString *)userId;

- (NSInteger)setRemoteAudioMixedDelegate:(id<RCRTCIWAudioFrameDelegate> _Nullable)delegate;

- (NSInteger)setLocalVideoProcessedDelegate:(id<RCRTCIWSampleBufferVideoFrameDelegate> _Nullable)delegate;

- (NSInteger)setRemoteVideoProcessedDelegate:(id<RCRTCIWPixelBufferVideoFrameDelegate> _Nullable)delegate
                                      userId:(NSString *)userId;

- (NSInteger)setLocalCustomVideoProcessedDelegate:(id<RCRTCIWSampleBufferVideoFrameDelegate> _Nullable)delegate
                                              tag:(NSString *)tag;

- (NSInteger)setRemoteCustomVideoProcessedDelegate:(id<RCRTCIWPixelBufferVideoFrameDelegate> _Nullable)delegate
                                            userId:(NSString *)userId
                                               tag:(NSString *)tag;


- (NSInteger)setRemoteCustomAudioReceivedDelegate:(id<RCRTCIWAudioFrameDelegate> _Nullable)delegate
                                           userId:(NSString *)userId
                                              tag:(NSString *)tag;

@end
  
