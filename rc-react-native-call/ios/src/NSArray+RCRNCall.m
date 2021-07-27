//
//  NSArray+RCRNCall.m
//  CocoaAsyncSocket
//
//  Created by joyoki on 2021/7/26.
//

#import "NSArray+RCRNCall.h"

@implementation NSArray (RCRNCall)

- (NSDictionary *)indexDictionary {
    NSMutableDictionary *dictionary = [NSMutableDictionary dictionaryWithCapacity:self.count];
    [self enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        [dictionary setObject:obj forKey:@(idx)];
    }];
    return dictionary;
}

- (NSArray *)mapTo:(id(^)(id obj))block {
    NSMutableArray *newArray = [NSMutableArray arrayWithCapacity:self.count];
    [self enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        [newArray addObject:block(obj)];
    }];
    return newArray;
}

@end
