
import {
  RCReactNativeRtcEventEmitter
} from 'rc-react-native-rtc'

export const users = new Map();

let listeners = [];

let onUserJoined = null;
let onUserLeft = null;
let onUserAudioStateChanged = null;
let onUserVideoStateChanged = null;

export const init = () => {
  listeners.push(
    RCReactNativeRtcEventEmitter.addListener('Engine:OnUserJoined', (id) => {
      users.delete(id);
      users.set(id, {
        id: id,
        audioPublished: false,
        videoPublished: false,
        audioSubscribed: false,
        videoSubscribed: false,
      });
      if (onUserJoined != null) {
        onUserJoined();
      }
    })
  );

  listeners.push(
    RCReactNativeRtcEventEmitter.addListener('Engine:OnUserOffline', (id) => {
      users.delete(id);
      if (onUserLeft != null) {
        onUserLeft();
      }
    })
  );

  listeners.push(
    RCReactNativeRtcEventEmitter.addListener('Engine:OnUserLeft', (id) => {
      users.delete(id);
      if (onUserLeft != null) {
        onUserLeft();
      }
    })
  );

  listeners.push(
    RCReactNativeRtcEventEmitter.addListener('Engine:OnRemotePublished', (event) => {
      let id = event.id;
      let type = event.type;
      let user = users.get(id);
      if (!isNull(user)) {
        switch (type) {
          case 0:
            user.audioPublished = true;
            if (onUserAudioStateChanged != null) {
              onUserAudioStateChanged(id, true);
            }
            break;
          case 1:
            user.videoPublished = true;
            if (onUserVideoStateChanged != null) {
              onUserVideoStateChanged(id, true);
            }
            break;
          default:
            user.audioPublished = true;
            user.videoPublished = true;
            if (onUserAudioStateChanged != null) {
              onUserAudioStateChanged(id, true);
            }
            if (onUserVideoStateChanged != null) {
              onUserVideoStateChanged(id, true);
            }
            break;
        }
      }
    })
  );

  listeners.push(
    RCReactNativeRtcEventEmitter.addListener('Engine:OnRemoteUnpublished', (event) => {
      let id = event.id;
      let type = event.type;
      let user = users.get(id);
      if (!isNull(user)) {
        switch (type) {
          case 0:
            user.audioPublished = false;
            if (onUserAudioStateChanged != null) {
              onUserAudioStateChanged(id, false);
            }
            break;
          case 1:
            user.videoPublished = false;
            if (onUserVideoStateChanged != null) {
              onUserVideoStateChanged(id, false);
            }
            break;
          default:
            user.audioPublished = false;
            user.videoPublished = false;
            if (onUserAudioStateChanged != null) {
              onUserAudioStateChanged(id, false);
            }
            if (onUserVideoStateChanged != null) {
              onUserVideoStateChanged(id, false);
            }
            break;
        }
      }
    })
  );
}

export const setListeners = (joined, left, audioChanged, videoChanged) => {
  onUserJoined = joined;
  onUserLeft = left;
  onUserAudioStateChanged = audioChanged;
  onUserVideoStateChanged = videoChanged;
}

export const unInit = () => {
  listeners.map((listener) => {
    listener.remove();
  });
  listeners.length = 0;
  users.clear();
  onUserJoined = null;
  onUserLeft = null;
  onUserAudioStateChanged = null;
  onUserVideoStateChanged = null;
}

export const isNull = (obj) => {
  return typeof obj == "undefined" || obj == null;
}

export const isEmpty = (str) => {
  return isNull(str) || str.length == 0 || str == '';
}

export const post = (url, params, success, error) => {
  let json = JSON.stringify(params);
  let init = {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: json
  };
  fetch(url, init)
    .then((response) => response.json())
    .then((json) => {
      success(json);
    })
    .catch((exception) => {
      error(exception);
    });
}

