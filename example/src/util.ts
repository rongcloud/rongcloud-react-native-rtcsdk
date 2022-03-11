import {
  RCRTCEngine, RCRTCMediaType, RCRTCRemoteAudioStats, RCRTCRemoteVideoStats, RCRTCViewFitType
} from '@rongcloud/react-native-rtc'

export interface User {
  id: string,
  customTag: string | null,
  viewTag: number | null
  audioPublished: boolean,
  videoPublished: boolean,
  audioSubscribed: boolean,
  videoSubscribed: boolean,
  subscribeTiny: boolean,
  fitType: RCRTCViewFitType,
  remoteAudioStats: RCRTCRemoteAudioStats | null,
  remoteVideoStats: RCRTCRemoteVideoStats | null
}

export const users = new Map<string, User>();
let onRefresh: Function | null = null;


export const init = () => {
  RCRTCEngine.setOnUserJoinedListener((roomId: string, userId: string) => {
    users.delete(userId);
    users.set(userId, {
      id: userId,
      customTag: null,
      viewTag: null,
      audioPublished: false,
      videoPublished: false,
      audioSubscribed: false,
      videoSubscribed: false,
      subscribeTiny: false,
      fitType: RCRTCViewFitType.Center,
      remoteAudioStats: null,
      remoteVideoStats: null
    });
    if (onRefresh != null) {
      onRefresh();
    }
  })


  RCRTCEngine.setOnUserOfflineListener((roomId: string, userId: string) => {
    users.delete(userId);
    if (onRefresh != null) {
      onRefresh();
    }
  })

  RCRTCEngine.setOnUserLeftListener((roomId: string, userId: string) => {
    users.delete(userId);
    if (onRefresh != null) {
      onRefresh();
    }
  })


  RCRTCEngine.setOnRemotePublishedListener((roomId: string, userId: string, type: RCRTCMediaType) => {
    let user = users.get(userId);
    if (user) {
      switch (type) {
        case RCRTCMediaType.Audio:
          user.audioPublished = true;
          break;
        case RCRTCMediaType.Video:
          user.videoPublished = true;
          break;
        default:
          user.audioPublished = true;
          user.videoPublished = true;
          break;
      }
    }
    if (onRefresh != null) {
      onRefresh();
    }
  })

  RCRTCEngine.setOnRemoteUnpublishedListener((roomId: string, userId: string, type: RCRTCMediaType) => {
    let user = users.get(userId);
    if (user) {
      switch (type) {
        case RCRTCMediaType.Audio:
          user.audioPublished = false;
          user.audioSubscribed = false;
          break;
        case RCRTCMediaType.Video:
          user.videoPublished = false;
          user.videoSubscribed = false;
          break;
        default:
          user.audioPublished = false;
          user.videoPublished = false;
          user.audioSubscribed = false;
          user.videoSubscribed = false;
          break;
      }
    }
    if (onRefresh != null) {
      onRefresh();
    }
  })
}

export const setOnRefreshListener = (refresh: Function) => {
  onRefresh = refresh;
}

export const unInit = () => {
  users.clear();
  onRefresh = null
}

export const isNull = (obj: any) => {
  return typeof obj == "undefined" || obj == null;
}

export const isEmpty = (str: string) => {
  return isNull(str) || str.length == 0 || str == '';
}

export const post = (url: string, params: object, success: (obj: any) => void, error: (err: any) => void) => {
  let json = JSON.stringify(params);
  let init = {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: json
  };
  fetch(url, init)
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      success(json);
    })
    .catch((exception) => {
      error(exception);
    });
}


export const get = (url: string, success: (obj: any) => void, error: (err: any) => void) => {
  let init = {
    method: 'GET',
  };
  fetch(url, init)
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      success(json);
    })
    .catch((exception) => {
      error(exception);
    });
}

