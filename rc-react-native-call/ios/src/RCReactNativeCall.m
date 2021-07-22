#import "RCReactNativeCall.h"
#import <UIKit/UIKit.h>
#import <RongCallWrapper/RongCallWrapper.h>

@implementation RCReactNativeCall

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(test)
{
    UIAlertController *alert = [UIAlertController alertControllerWithTitle:@"测试" message:@"测试测试" preferredStyle:UIAlertControllerStyleAlert];
    [alert addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:nil]];
    [[UIApplication sharedApplication].keyWindow.rootViewController presentViewController:alert animated:YES completion:nil];
}

@end

