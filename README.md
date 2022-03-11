# 融云 React-Native RTC

本文档主要讲解了如何使用融云  React-Native RTC SDK，基于 融云 iOS/Android 平台的  RTCLib  SDK

[React-Native 官网](https://www.reactnative.com)

[融云 React-Native RTC文档](https://doc.rongcloud.cn/live/React-Native/5.X/prepare)

[融云 iOS RTC 文档](https://doc.rongcloud.cn/live/IOS/5.X/prepare)

[融云 Android RTC 文档](https://doc.rongcloud.cn/live/Android/5.X/prepare)

# 前期准备

## 1 申请开发者账号

[融云官网](https://developer.rongcloud.cn/signup/?utm_source=RTCfluttergithub&utm_term=RTCsign)申请开发者账号

通过管理后台的 "基本信息"->"App Key" 获取 AppKey

通过管理后台的 "IM 服务"—>"API 调用"->"用户服务"->"获取 Token"，通过用户 id 获取 IMToken

## 2 开通音视频服务

管理后台的 "音视频服务"->"服务设置" 开通音视频 RTC 3.0 ，开通两个小时后生效

# 依赖 RTC 插件

[请参考官方文档导入SDK教程](https://doc.rongcloud.cn/live/React-Native/5.X/import)

# 前置接口说明

## 初始化 IM SDK

```js
IMLib.init(RongAppKey);
```

## 连接 IM

```js
IMLib.connect(IMToken, (code, userId) {
});
```

## 创建 RTC 引擎

```js
RCRTCEngine.create();
```

# 音视频模式接口说明

## 用户加入房间，渲染并发布资源

### 加入 RTC 房间

```js
// 设置加入 RTC 房间事件监听
RCRTCEngine.setOnRoomJoinedListener((code: number, message: string) => {
  if (code === 0) {
    // 加入房间成功
  } else {
    // 加入房间失败
  }	
});

// 加入 RTC 房间
let roomSetup = {
      // 根据实际场景，选择音视频直播：AudioVideo 或纯音频直播：Audio
      type: RCRTCMediaType.AudioVideo
      role: RCRTCRole.MeetingMember
    };
RCRTCEngine.joinRoom('直播间 ID', roomSetup);
```

### 采集音频
引擎默认开启音频采集

```js
RCRTCEngine.enableMicrophone(true);
```

### 采集视频

```js
RCRTCEngine.enableCamera(true);
```

### 渲染视频

设置用于显示视频的 `RCReactNativeRtcView`，调用 `RCRTCEngine` 下的 `setLocalView` 方法设置本地视频的显示 view。

:::warning
RCReactNativeRtcView 内部包装的是原生提供的组件， 所以 RCRTCView 只能在 TSX或JSX 文件中使用。
:::

导入预览窗口组件

```js
// 导入 RCReactNativeRtcView
  import {RCReactNativeRtcView} from '@rongcloud/react-native-rtc';
```

添加预览窗口并获取viewTag

  ```xml
  <!-- 增加 RCReactNativeRtcView 组件, fitType: 视频填充模式, mirror: 视频是否镜像显示 -->
  <RCReactNativeRtcView 
    ref={(ref) => {
        let viewTag = findNodeHandle(ref);        
    }}
    fitType={RCRTCViewFitType.Center} 
    mirror={true}>
  </RCReactNativeRtcView>
  ```

设置预览窗口

  ```js
  // 设置预览窗口,其中viewTag为上一步获取的viewTag
  RCRTCEngine.setLocalView(viewTag).then(code=>{
    if (code === 0) {
      // 设置成功
    } else {
      // 设置失败
    }
  });
  ```

### 发布资源

```js
RCRTCEngine.publish(RCRTCMediaType.AudioVideo);
```

## 渲染远端用户

### 监听远端用户加入的回调

`当用户加入的时候，不要做订阅渲染的处理`，因为此时该用户可能刚加入房间成功，但是尚未发布资源

```js
RCRTCEngine.setOnUserJoinedListener((roomId: string, userId: string) => {
  // userId 远端用户 ID
  // roomId 房间 ID
});
```

### 监听远端用户发布资源的回调

```js
RCRTCEngine.setOnRemotePublishedListener((roomId: string, userId: string, type: RCRTCMediaType) => {
  // userId 远端用户 ID
  // roomId 房间 ID
  // type 远端用户发布的资源类型 RCRTCMediaType
});
```

### 远端用户发布资源后，订阅远端用户资源

```js
RCRTCEngine.subscribe(userId, type);
```

### 渲染远端用户资源

```js
// 导入组件 和 添加 remoteView 组件，可参考 setLocalView 部分的示例
// 设置预览窗口
    RCRTCEngine.setRemoteView(userId, viewTag).then(code=>{
      if (code === 0) {
        // 设置成功
      } else {
        // 设置失败
      }
    });
```

# 直播模式接口说明

## 主播加入房间，渲染并发布资源

### 加入 RTC 房间

```js
// 设置加入 RTC 房间事件监听
RCRTCEngine.setOnRoomJoinedListener((code: number, message: string) => {
  if (code === 0) {
    // 加入房间成功
  } else {
    // 加入房间失败
  }	
});

// 加入 RTC 房间
let roomSetup = {
    // 根据实际场景，选择音视频直播：AudioVideo 或纯音频直播：Audio
    type: RCRTCMediaType.AudioVideo
    role: RCRTCRole.LiveBroadcaster
};
RCRTCEngine.joinRoom('直播间 ID', roomSetup);
```

### 采集音频
引擎默认开启音频采集

```js
RCRTCEngine.enableMicrophone(true);
```

### 采集视频

```js
RCRTCEngine.enableCamera(true);
```

### 渲染视频

  ```js
  // 设置预览窗口,其中viewTag为RCReactNativeRtcView获取的viewTag
  RCRTCEngine.setLocalView(viewTag).then(code=>{
    if (code === 0) {
      // 设置成功
    } else {
      // 设置失败
    }
  });
  ```

### 发布资源

```js
RCRTCEngine.publish(RCRTCMediaType.AudioVideo);
```

## 渲染远端主播

### 监听远端主播加入的回调

`当主播加入的时候，不要做订阅渲染的处理`，因为此时该主播可能刚加入房间成功，但是尚未发布资源

```js
RCRTCEngine.setOnUserJoinedListener((roomId: string, userId: string) => {
  // userId 远端用户 ID
  // roomId 房间 ID
});
```

### 监听远端主播发布资源的回调

```js
RCRTCEngine.setOnRemotePublishedListener((roomId: string, userId: string, type: RCRTCMediaType) => {
  // userId 远端用户 ID
  // roomId 房间 ID
  // type 远端用户发布的资源类型 RCRTCMediaType
});
```

### 远端主播发布资源后，订阅远端主播资源

```js
RCRTCEngine.subscribe(userId, type);
```

### 渲染远端主播资源

```js
// 导入组件 和 添加 remoteView 组件，可参考 setLocalView 部分的示例
RCRTCEngine.setRemoteView(userId, viewTag).then(code=>{
  if (code === 0) {
    // 设置成功
  } else {
    // 设置失败
  }
});
```

## 观众加入房间，订阅并渲染MCU资源

### 加入 RTC 房间

```js
// 设置加入 RTC 房间事件监听
RCRTCEngine.setOnRoomJoinedListener((code: number, message: string) => {
    if (code === 0) {
    // 创建/加入房间成功
    } else {
    // 创建/加入房间失败
    }	
});

// 加入 RTC 房间
let setup = {
    type: RCRTCMediaType.AudioVideo,
    role: RCRTCRole.LiveAudience, // 观众
};
RCRTCEngine.joinRoom(roomId, setup);
```

### 监听MCU资源发布回调

```js
RCRTCEngine.setOnRemoteLiveMixPublishedListener((type: RCRTCMediaType) => {
    // type 媒体类型
});
```

### MCU资源发布后，订阅MCU资源

```js
RCRTCEngine.subscribeLiveMix(RCRTCMediaType.AudioVideo);
```

### 渲染MCU资源

```js
/// 导入组件 和 添加 liveMixView 组件，可参考 setLocalView 部分的示例
/// 设置预览窗口
RCRTCEngine.setLiveMixView(viewTag).then(code=>{
  if (code === 0) {
    // 设置成功
  } else {
    // 设置失败
  }
});
```

## 观众加入房间，订阅并渲染主播资源

### 加入 RTC 房间

```js
// 设置加入 RTC 房间事件监听
RCRTCEngine.setOnRoomJoinedListener((code: number, message: string) => {
    if (code === 0) {
    // 创建/加入房间成功
    } else {
    // 创建/加入房间失败
    }	
});

// 加入 RTC 房间
let setup = {
    type: RCRTCMediaType.AudioVideo,
    role: RCRTCRole.LiveAudience, // 观众
};
RCRTCEngine.joinRoom(roomId, setup);
```

### 监听远端主播加入的回调

`当主播加入的时候，不要做订阅渲染的处理`，因为此时该主播可能刚加入房间成功，但是尚未发布资源

```js
RCRTCEngine.setOnUserJoinedListener((roomId: string, userId: string) => {
  // userId 远端用户 ID
  // roomId 房间 ID
});
```

### 监听远端主播发布资源的回调

```js
RCRTCEngine.setOnRemotePublishedListener((roomId: string, userId: string, type: RCRTCMediaType) => {
  // userId 远端用户 ID
  // roomId 房间 ID
  // type 远端用户发布的资源类型 RCRTCMediaType
});
```

### 远端主播发布资源后，订阅远端主播资源

```js
RCRTCEngine.subscribe(userId, type);
```

### 渲染远端主播资源

```js
// 导入组件 和 添加 remoteView 组件，可参考 setLocalView 部分的示例
RCRTCEngine.setRemoteView(userId, viewTag).then(code=>{
  if (code === 0) {
    // 设置成功
  } else {
    // 设置失败
  }
});
```

# 其他接口

## 离开房间

```js
RCRTCEngine.leaveRoom();
```

