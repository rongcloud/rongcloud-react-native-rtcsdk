package cn.rongcloud.rtc.rn;

import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import cn.rongcloud.rtc.wrapper.RCRTCIWEngine;
import cn.rongcloud.rtc.wrapper.RCRTCIWView;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWCamera;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWLocalAudioStats;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWLocalVideoStats;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWMediaType;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWNetworkStats;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWRemoteAudioStats;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWRemoteVideoStats;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWRole;
import cn.rongcloud.rtc.wrapper.listener.RCRTCIWListener;
import cn.rongcloud.rtc.wrapper.listener.RCRTCIWOnReadableAudioFrameListener;
import cn.rongcloud.rtc.wrapper.listener.RCRTCIWOnReadableVideoFrameListener;
import cn.rongcloud.rtc.wrapper.listener.RCRTCIWOnWritableAudioFrameListener;
import cn.rongcloud.rtc.wrapper.listener.RCRTCIWOnWritableVideoFrameListener;
import cn.rongcloud.rtc.wrapper.listener.RCRTCIWStatusListener;
import io.rong.imlib.model.Message;

public class RCReactNativeRtc extends ReactContextBaseJavaModule {
  private static RCReactNativeRtc _instance = null;

  protected static RCReactNativeRtc getInstance(ReactApplicationContext reactContext) {
    if (_instance == null)
      _instance = new RCReactNativeRtc(reactContext);
    return _instance;
  }

  public static RCReactNativeRtc getInstance() {
    return _instance;
  }

  private RCReactNativeRtc(ReactApplicationContext reactContext) {
    super(reactContext);
    this.context = reactContext;
  }


  @Override
  @NonNull
  public String getName() {
    return "RCReactNativeRtc";
  }

  @ReactMethod
  public void init(ReadableMap setup, Promise promise) {
    if (setup != null) {
      engine = RCRTCIWEngine.create(context, ArgumentAdapter.toEngineSetup(setup));
    } else {
      engine = RCRTCIWEngine.create(context);
    }
    engine.setListener(new ListenerImpl());
    engine.setStatsListener(new StatsListenerImpl());
    promise.resolve(null);
  }

  @ReactMethod
  public void unInit(Promise promise) {
    if (engine != null) {
      engine.destroy();
      engine = null;
    }
    promise.resolve(null);
  }

  @ReactMethod
  public void joinRoom(String id, ReadableMap setup, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.joinRoom(id, ArgumentAdapter.toRoomSetup(setup));
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void leaveRoom(Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.leaveRoom();
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void publish(Integer type, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.publish(ArgumentAdapter.toMediaType(type));
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void unpublish(Integer type, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.unpublish(ArgumentAdapter.toMediaType(type));
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void subscribe(String id, Integer type, Boolean tiny, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.subscribe(id, ArgumentAdapter.toMediaType(type), tiny);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void subscribes(ReadableArray ids, Integer type, Boolean tiny, Promise promise) {
    int code = -1;
    if (engine != null) {
      List<String> strings = new ArrayList<>(ids.size());
      for (int i = 0; i < ids.size(); i++) {
        strings.add(ids.getString(i));
      }
      code = engine.subscribe(strings, ArgumentAdapter.toMediaType(type), tiny);
    }
    promise.resolve(code);
  }


  @ReactMethod
  public void unsubscribe(String id, Integer type, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.unsubscribe(id, ArgumentAdapter.toMediaType(type));
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void unsubscribes(ReadableArray ids, Integer type, Promise promise) {
    int code = -1;
    if (engine != null) {
      List<String> strings = new ArrayList<>(ids.size());
      for (int i = 0; i < ids.size(); i++) {
        strings.add(ids.getString(i));
      }
      code = engine.unsubscribe(strings, ArgumentAdapter.toMediaType(type));
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void subscribeLiveMix(Integer type, Boolean tiny, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.subscribeLiveMix(ArgumentAdapter.toMediaType(type), tiny);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void unsubscribeLiveMix(Integer type, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.unsubscribeLiveMix(ArgumentAdapter.toMediaType(type));
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setAudioConfig(ReadableMap config, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.setAudioConfig(ArgumentAdapter.toAudioConfig(config));
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setVideoConfig(ReadableMap config, Boolean tiny, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.setVideoConfig(ArgumentAdapter.toVideoConfig(config), tiny);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void enableMicrophone(Boolean enable, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.enableMicrophone(enable);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void enableSpeaker(Boolean enable, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.enableSpeaker(enable);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void adjustLocalVolume(Integer volume, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.adjustLocalVolume(volume);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void enableCamera(Boolean enable, Integer camera, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.enableCamera(enable, ArgumentAdapter.toCamera(camera));
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void switchCamera(Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.switchCamera();
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void switchToCamera(Integer camera, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.switchToCamera(ArgumentAdapter.toCamera(camera));
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void whichCamera(Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.whichCamera().getCamera();
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void isCameraFocusSupported(Promise promise) {
    boolean code = false;
    if (engine != null) {
      code = engine.isCameraFocusSupported();
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void isCameraExposurePositionSupported(Promise promise) {
    boolean code = false;
    if (engine != null) {
      code = engine.isCameraExposurePositionSupported();
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setCameraFocusPositionInPreview(Double x, Double y, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.setCameraFocusPositionInPreview(x.floatValue(), y.floatValue());
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setCameraExposurePositionInPreview(Double x, Double y, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.setCameraExposurePositionInPreview(x.floatValue(), y.floatValue());
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setCameraExposurePositionInPreview(Integer orientation, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.setCameraCaptureOrientation(ArgumentAdapter.toCameraCaptureOrientation(orientation));
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setLocalView(final int tag, final Promise promise) {
    UIManagerModule manager = context.getNativeModule(UIManagerModule.class);
    assert manager != null;
    manager.addUIBlock(new UIBlock() {
      @Override
      public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
        int code = -1;


        FrameLayout layout = (FrameLayout) nativeViewHierarchyManager.resolveView(tag);
        RCRTCIWView nativeView = (RCRTCIWView) layout.getChildAt(0);

        if (engine != null) {
          code = engine.setLocalView(nativeView);
        }
        promise.resolve(code);
      }
    });
  }

  @ReactMethod
  public void removeLocalView(Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.removeLocalView();
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setRemoteView(final String id, final int tag, final Promise promise) {
    UIManagerModule manager = context.getNativeModule(UIManagerModule.class);
    assert manager != null;
    manager.addUIBlock(new UIBlock() {
      @Override
      public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
        int code = -1;
        // View nativeView = nativeViewHierarchyManager.resolveView(tag);

        FrameLayout layout = (FrameLayout) nativeViewHierarchyManager.resolveView(tag);
        RCRTCIWView nativeView = (RCRTCIWView) layout.getChildAt(0);
        if (engine != null) {
          code = engine.setRemoteView(id, (RCRTCIWView) nativeView);
        }
        promise.resolve(code);
      }
    });
  }

  @ReactMethod
  public void removeRemoteView(String id, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.removeRemoteView(id);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setLiveMixView(final int tag, final Promise promise) {
    UIManagerModule manager = context.getNativeModule(UIManagerModule.class);
    assert manager != null;
    manager.addUIBlock(new UIBlock() {
      @Override
      public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
        int code = -1;
        FrameLayout layout = (FrameLayout) nativeViewHierarchyManager.resolveView(tag);
        RCRTCIWView nativeView = (RCRTCIWView) layout.getChildAt(0);
        if (engine != null) {
          code = engine.setLiveMixView((RCRTCIWView) nativeView);
        }
        promise.resolve(code);
      }
    });
  }

  @ReactMethod
  public void removeLiveMixView(Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.removeLiveMixView();
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void muteLocalStream(Integer type, Boolean mute, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.muteLocalStream(ArgumentAdapter.toMediaType(type), mute);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void muteRemoteStream(String id, Integer type, Boolean mute, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.muteRemoteStream(id, ArgumentAdapter.toMediaType(type), mute);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void muteLiveMixStream(int type, boolean mute, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.muteLiveMixStream(ArgumentAdapter.toMediaType(type), mute);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void addLiveCdn(String url, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.addLiveCdn(url);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void removeLiveCdn(String url, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.removeLiveCdn(url);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setLiveMixLayoutMode(Integer mode, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.setLiveMixLayoutMode(ArgumentAdapter.toLiveMixLayoutMode(mode));
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setLiveMixRenderMode(Integer mode, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.setLiveMixRenderMode(ArgumentAdapter.toLiveMixRenderMode(mode));
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setLiveMixBackgroundColor(int color, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.setLiveMixBackgroundColor(color);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setLiveMixBackgroundColorRgb(int red, int green, int blue, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.setLiveMixBackgroundColor(red, green, blue);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setLiveMixCustomLayouts(ReadableArray layouts, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.setLiveMixCustomLayouts(ArgumentAdapter.toLiveMixCustomLayouts(layouts));
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setLiveMixCustomAudios(ReadableArray ids, Promise promise) {
    int code = -1;
    if (engine != null) {
      List<String> strings = new ArrayList<>(ids.size());
      for (int i = 0; i < ids.size(); i++) {
        strings.add(ids.getString(i));
      }
      code = engine.setLiveMixCustomAudios(strings);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setLiveMixAudioBitrate(Integer bitrate, Promise promise) {
    int code = -1;
    if (engine != null) {

      code = engine.setLiveMixAudioBitrate(bitrate);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setLiveMixVideoBitrate(Integer bitrate, Boolean tiny, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.setLiveMixVideoBitrate(bitrate, tiny);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setLiveMixVideoResolution(Integer width, Integer height, Boolean tiny, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.setLiveMixVideoResolution(width, height, tiny);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setLiveMixVideoFps(Integer fps, Boolean tiny, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.setLiveMixVideoFps(ArgumentAdapter.toVideoFps(fps), tiny);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void createAudioEffect(String path, Integer id, Promise promise) {
    int code = -1;
    if (engine != null) {
      URI uri = null;
      try {
        uri = new URI(path);
      } catch (URISyntaxException e) {
        e.printStackTrace();
      }
      code = engine.createAudioEffect(uri, id);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void releaseAudioEffect(Integer id, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.releaseAudioEffect(id);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void playAudioEffect(Integer id, Integer volume, Integer loop, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.playAudioEffect(id, volume, loop);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void pauseAudioEffect(Integer id, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.pauseAudioEffect(id);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void pauseAllAudioEffects(Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.pauseAllAudioEffects();
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void resumeAudioEffect(Integer id, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.resumeAudioEffect(id);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void resumeAllAudioEffects(Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.resumeAllAudioEffects();
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void stopAudioEffect(Integer id, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.stopAudioEffect(id);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void stopAllAudioEffects(Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.stopAllAudioEffects();
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void adjustAudioEffectVolume(Integer id, Integer volume, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.adjustAudioEffectVolume(id, volume);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void getAudioEffectVolume(Integer id, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.getAudioEffectVolume(id);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void adjustAllAudioEffectsVolume(Integer volume, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.adjustAllAudioEffectsVolume(volume);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void startAudioMixing(String path, Integer mode, Boolean playback, Integer loop, Promise promise) {
    int code = -1;
    if (engine != null) {
      URI uri = null;
      try {
        uri = new URI(path);
      } catch (URISyntaxException e) {
        e.printStackTrace();
      }
      code = engine.startAudioMixing(uri, ArgumentAdapter.toAudioMixingMode(mode), playback, loop);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void stopAudioMixing(Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.stopAudioMixing();
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void pauseAudioMixing(Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.pauseAudioMixing();
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void resumeAudioMixing(Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.resumeAudioMixing();
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void adjustAudioMixingVolume(Integer volume, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.adjustAudioMixingVolume(volume);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void adjustAudioMixingPlaybackVolume(Integer volume, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.adjustAudioMixingPlaybackVolume(volume);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void getAudioMixingPlaybackVolume(Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.getAudioMixingPlaybackVolume();
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void adjustAudioMixingPublishVolume(Integer volume, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.adjustAudioMixingPublishVolume(volume);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void getAudioMixingPublishVolume(Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.getAudioMixingPublishVolume();
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setAudioMixingPosition(Double position, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.setAudioMixingPosition(position);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void getAudioMixingPosition(Promise promise) {
    double code = -1;
    if (engine != null) {
      code = engine.getAudioMixingPosition();
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void getAudioMixingDuration(Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.getAudioMixingDuration();
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void getSessionId(Promise promise) {
    String code = null;
    if (engine != null) {
      code = engine.getSessionId();
    }
    promise.resolve(code);
  }


  @ReactMethod
  public void createCustomStreamFromFile(String path, String tag, Boolean replace, Boolean playback, Promise promise) {
    int code = -1;
    if (engine != null) {
      if (path.startsWith("content://") || path.startsWith("file://"))
        path = getRealPath(path);
      URI uri = null;
      try {
        uri = new URI(path);
      } catch (URISyntaxException e) {
        e.printStackTrace();
      }
      code = engine.createCustomStreamFromFile(uri, tag, replace, playback);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setCustomStreamVideoConfig(String tag, ReadableMap config, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.setCustomStreamVideoConfig(tag, ArgumentAdapter.toVideoConfig(config));
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void muteLocalCustomStream(String tag, Boolean mute, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.muteLocalCustomStream(tag, mute);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setLocalCustomStreamView(String tag, final int view, Promise promise) {
    UIManagerModule manager = context.getNativeModule(UIManagerModule.class);
    assert manager != null;
    manager.addUIBlock(new UIBlock() {
      @Override
      public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
        int code = -1;
        //View nativeView = nativeViewHierarchyManager.resolveView(view);
        FrameLayout layout = (FrameLayout) nativeViewHierarchyManager.resolveView(view);
        RCRTCIWView nativeView = (RCRTCIWView) layout.getChildAt(0);
        if (engine != null) {
          code = engine.setLocalCustomStreamView(tag, (RCRTCIWView) nativeView);
        }
        promise.resolve(code);
      }
    });
  }

  @ReactMethod
  public void removeLocalCustomStreamView(String tag, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.removeLocalCustomStreamView(tag);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void publishCustomStream(String tag, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.publishCustomStream(tag);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void unpublishCustomStream(String tag, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.unpublishCustomStream(tag);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void muteRemoteCustomStream(String userId, String tag, int type, Boolean mute, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.muteRemoteCustomStream(userId, tag, ArgumentAdapter.toMediaType(type), mute);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setRemoteCustomStreamView(String userId, String tag, final int view, Promise promise) {
    UIManagerModule manager = context.getNativeModule(UIManagerModule.class);
    assert manager != null;
    manager.addUIBlock(new UIBlock() {
      @Override
      public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
        int code = -1;
        FrameLayout layout = (FrameLayout) nativeViewHierarchyManager.resolveView(view);
        RCRTCIWView nativeView = (RCRTCIWView) layout.getChildAt(0);
        if (engine != null) {
          code = engine.setRemoteCustomStreamView(userId, tag, (RCRTCIWView) nativeView);
        }
        promise.resolve(code);
      }
    });
  }

  @ReactMethod
  public void removeRemoteCustomStreamView(String userId, String tag, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.removeRemoteCustomStreamView(userId, tag);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void subscribeCustomStream(String userId, String tag, int type, Boolean tiny, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.subscribeCustomStream(userId, tag, ArgumentAdapter.toMediaType(type), tiny);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void unsubscribeCustomStream(String userId, String tag, int type, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.unsubscribeCustomStream(userId, tag, ArgumentAdapter.toMediaType(type));
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void requestJoinSubRoom(String roomId, String userId, Boolean autoLayout, String extra, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.requestJoinSubRoom(roomId, userId, autoLayout, extra);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void cancelJoinSubRoomRequest(String roomId, String userId, String extra, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.cancelJoinSubRoomRequest(roomId, userId, extra);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void responseJoinSubRoomRequest(String roomId, String userId, Boolean agree, Boolean autoLayout, String extra, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.responseJoinSubRoomRequest(roomId, userId, agree, autoLayout, extra);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void joinSubRoom(String roomId, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.joinSubRoom(roomId);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void leaveSubRoom(String roomId, Boolean disband, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.leaveSubRoom(roomId, disband);
    }
    promise.resolve(code);
  }


  public int setLocalAudioCapturedListener(RCRTCIWOnWritableAudioFrameListener listener) {
    int code = -1;
    if (engine != null) {
      code = engine.setLocalAudioCapturedListener(listener);
    }
    return code;
  }

  public int setLocalAudioMixedListener(RCRTCIWOnReadableAudioFrameListener listener) {
    int code = -1;
    if (engine != null) {
      code = engine.setLocalAudioMixedListener(listener);
    }
    return code;
  }

  public int setRemoteAudioReceivedListener(String userId, RCRTCIWOnReadableAudioFrameListener listener) {
    int code = -1;
    if (engine != null) {
      code = engine.setRemoteAudioReceivedListener(userId, listener);
    }
    return code;
  }

  public int setRemoteAudioMixedListener(RCRTCIWOnWritableAudioFrameListener listener) {
    int code = -1;
    if (engine != null) {
      code = engine.setRemoteAudioMixedListener(listener);
    }
    return code;
  }

  public int setLocalVideoProcessedListener(RCRTCIWOnWritableVideoFrameListener listener) {
    int code = -1;
    if (engine != null) {
      code = engine.setLocalVideoProcessedListener(listener);
    }
    return code;
  }

  public int setRemoteVideoProcessedListener(String userId, RCRTCIWOnReadableVideoFrameListener listener) {
    int code = -1;
    if (engine != null) {
      code = engine.setRemoteVideoProcessedListener(userId, listener);
    }
    return code;
  }

  public int setLocalCustomVideoProcessedListener(String tag, RCRTCIWOnWritableVideoFrameListener listener) {
    int code = -1;
    if (engine != null) {
      code = engine.setLocalCustomVideoProcessedListener(tag, listener);
    }
    return code;
  }

  public int setRemoteCustomVideoProcessedListener(String userId, String tag, RCRTCIWOnReadableVideoFrameListener listener) {
    int code = -1;
    if (engine != null) {
      code = engine.setRemoteCustomVideoProcessedListener(userId, tag, listener);
    }
    return code;
  }

  public int setRemoteCustomAudioReceivedListener(String userId, String tag, RCRTCIWOnReadableAudioFrameListener listener) {
    int code = -1;
    if (engine != null) {
      code = engine.setRemoteCustomAudioReceivedListener(userId, tag, listener);
    }
    return code;
  }

  private class ListenerImpl extends RCRTCIWListener {
    @Override
    public void onError(int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnError", arguments);
    }

    @Override
    public void onKicked(String id, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("id", id);
      arguments.putString("message", message);
      sendEvent("Engine:OnKicked", arguments);
    }

    @Override
    public void onRoomJoined(int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnRoomJoined", arguments);
    }

    @Override
    public void onRoomLeft(int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnRoomLeft", arguments);
    }

    @Override
    public void onPublished(RCRTCIWMediaType type, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("type", type.ordinal());
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnPublished", arguments);
    }

    @Override
    public void onUnpublished(RCRTCIWMediaType type, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("type", type.ordinal());
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnUnpublished", arguments);
    }

    @Override
    public void onSubscribed(String userId, RCRTCIWMediaType type, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("userId", userId);
      arguments.putInt("type", type.ordinal());
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnSubscribed", arguments);
    }

    @Override
    public void onUnsubscribed(String userId, RCRTCIWMediaType type, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("userId", userId);
      arguments.putInt("type", type.ordinal());
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnUnsubscribed", arguments);
    }

    @Override
    public void onLiveMixSubscribed(RCRTCIWMediaType type, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("type", type.ordinal());
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnLiveMixSubscribed", arguments);
    }

    @Override
    public void onLiveMixUnsubscribed(RCRTCIWMediaType type, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("type", type.ordinal());
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnLiveMixUnsubscribed", arguments);
    }

    @Override
    public void onCameraEnabled(boolean enable, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putBoolean("enable", enable);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnCameraEnabled", arguments);
    }

    @Override
    public void onCameraSwitched(RCRTCIWCamera camera, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("camera", camera.ordinal());
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnCameraSwitched", arguments);
    }

    @Override
    public void onLiveCdnAdded(String url, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("url", url);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnLiveCdnAdded", arguments);
    }

    @Override
    public void onLiveCdnRemoved(String url, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("url", url);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnLiveCdnRemoved", arguments);
    }

    @Override
    public void onLiveMixLayoutModeSet(int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnLiveMixLayoutModeSet", arguments);
    }

    @Override
    public void onLiveMixRenderModeSet(int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnLiveMixRenderModeSet", arguments);
    }

    @Override
    public void onLiveMixCustomLayoutsSet(int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnLiveMixCustomLayoutsSet", arguments);
    }

    @Override
    public void onLiveMixCustomAudiosSet(int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnLiveMixCustomAudiosSet", arguments);
    }

    @Override
    public void onLiveMixAudioBitrateSet(int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnLiveMixAudioBitrateSet", arguments);
    }

    @Override
    public void onLiveMixVideoBitrateSet(boolean tiny, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putBoolean("tiny", tiny);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnLiveMixVideoBitrateSet", arguments);
    }


    @Override
    public void onLiveMixVideoResolutionSet(boolean tiny, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putBoolean("tiny", tiny);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnLiveMixVideoResolutionSet", arguments);
    }


    @Override
    public void onLiveMixVideoFpsSet(boolean tiny, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putBoolean("tiny", tiny);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnLiveMixVideoFpsSet", arguments);
    }


    @Override
    public void onAudioEffectCreated(int id, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("id", id);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnAudioEffectCreated", arguments);
    }

    @Override
    public void onAudioEffectFinished(final int id) {
      sendEvent("Engine:OnAudioEffectFinished", id);
    }

    @Override
    public void onAudioMixingStarted() {
      sendEvent("Engine:OnAudioMixingStarted", null);
    }

    @Override
    public void onAudioMixingPaused() {
      sendEvent("Engine:OnAudioMixingPaused", null);
    }

    @Override
    public void onAudioMixingStopped() {
      sendEvent("Engine:OnAudioMixingStopped", null);
    }

    @Override
    public void onAudioMixingFinished() {
      sendEvent("Engine:OnAudioMixingFinished", null);
    }

    @Override
    public void onUserJoined(String roomId, final String userId) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      sendEvent("Engine:OnUserJoined", arguments);
    }

    @Override
    public void onUserOffline(String roomId, final String userId) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      sendEvent("Engine:OnUserOffline", arguments);
    }

    @Override
    public void onUserLeft(String roomId, final String userId) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      sendEvent("Engine:OnUserLeft", arguments);
    }

    @Override
    public void onRemotePublished(String roomId, String userId, RCRTCIWMediaType type) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putInt("type", type.ordinal());
      sendEvent("Engine:OnRemotePublished", arguments);
    }

    @Override
    public void onRemoteUnpublished(String roomId, String userId, RCRTCIWMediaType type) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putInt("type", type.ordinal());
      sendEvent("Engine:OnRemoteUnpublished", arguments);
    }

    @Override
    public void onRemoteLiveMixPublished(final RCRTCIWMediaType type) {
      sendEvent("Engine:OnRemoteLiveMixPublished", type.ordinal());
    }

    @Override
    public void onRemoteLiveMixUnpublished(final RCRTCIWMediaType type) {
      sendEvent("Engine:OnRemoteLiveMixUnpublished", type.ordinal());
    }

    @Override
    public void onRemoteStateChanged(String roomId, String userId, RCRTCIWMediaType type, boolean disabled) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putInt("type", type.ordinal());
      arguments.putBoolean("disabled", disabled);
      sendEvent("Engine:OnRemoteStateChanged", arguments);
    }

    @Override
    public void onRemoteFirstFrame(String roomId, String userId, RCRTCIWMediaType type) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putInt("type", type.ordinal());
      sendEvent("Engine:OnRemoteFirstFrame", arguments);
    }

    @Override
    public void onRemoteLiveMixFirstFrame(final RCRTCIWMediaType type) {
      sendEvent("Engine:OnRemoteLiveMixFirstFrame", type.ordinal());
    }

    @Override
    public void onMessageReceived(String roomId, Message message) {
      // TODO sendEvent("Engine:OnMessageReceived", argument);
    }

    @Override
    public void onLiveMixBackgroundColorSet(int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnLiveMixBackgroundColorSet", arguments);
    }

    @Override
    public void onCustomStreamPublished(String tag, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("tag", tag);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnCustomStreamPublished", arguments);
    }

    @Override
    public void onCustomStreamPublishFinished(String tag) {
      sendEvent("Engine:OnCustomStreamPublishFinished", tag);
    }

    @Override
    public void onCustomStreamUnpublished(String tag, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("tag", tag);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnCustomStreamUnpublished", arguments);
    }

    @Override
    public void onRemoteCustomStreamPublished(String roomId, String userId, String tag, RCRTCIWMediaType type) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putString("tag", tag);
      arguments.putInt("type", type.ordinal());
      sendEvent("Engine:OnRemoteCustomStreamPublished", arguments);
    }

    @Override
    public void onRemoteCustomStreamUnpublished(String roomId, String userId, String tag, RCRTCIWMediaType type) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putString("tag", tag);
      arguments.putInt("type", type.ordinal());
      sendEvent("Engine:OnRemoteCustomStreamUnpublished", arguments);
    }

    @Override
    public void onRemoteCustomStreamStateChanged(String roomId, String userId, String tag, RCRTCIWMediaType type, boolean disabled) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putString("tag", tag);
      arguments.putInt("type", type.ordinal());
      arguments.putBoolean("disabled", disabled);
      sendEvent("Engine:OnRemoteCustomStreamStateChanged", arguments);
    }

    @Override
    public void onRemoteCustomStreamFirstFrame(String roomId, String userId, String tag, RCRTCIWMediaType type) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putString("tag", tag);
      arguments.putInt("type", type.ordinal());
      sendEvent("Engine:OnRemoteCustomStreamFirstFrame", arguments);
    }

    @Override
    public void onCustomStreamSubscribed(String userId, String tag, RCRTCIWMediaType type, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("userId", userId);
      arguments.putString("tag", tag);
      arguments.putInt("type", type.ordinal());
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnCustomStreamSubscribed", arguments);
    }

    @Override
    public void onCustomStreamUnsubscribed(String userId, String tag, RCRTCIWMediaType type, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("userId", userId);
      arguments.putString("tag", tag);
      arguments.putInt("type", type.ordinal());
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnCustomStreamUnsubscribed", arguments);
    }

    @Override
    public void onJoinSubRoomRequested(String roomId, String userId, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnJoinSubRoomRequested", arguments);
    }

    @Override
    public void onJoinSubRoomRequestCanceled(String roomId, String userId, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnJoinSubRoomRequestCanceled", arguments);
    }

    @Override
    public void onJoinSubRoomRequestResponded(String roomId, String userId, boolean agree, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putInt("code", code);
      arguments.putBoolean("agree", agree);
      arguments.putString("message", message);
      sendEvent("Engine:OnJoinSubRoomRequestResponded", arguments);
    }

    @Override
    public void onJoinSubRoomRequestReceived(String roomId, String userId, String extra) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putString("extra", extra);
      sendEvent("Engine:OnJoinSubRoomRequestReceived", arguments);
    }

    @Override
    public void onCancelJoinSubRoomRequestReceived(String roomId, String userId, String extra) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putString("extra", extra);
      sendEvent("Engine:OnCancelJoinSubRoomRequestReceived", arguments);
    }

    @Override
    public void onJoinSubRoomRequestResponseReceived(String roomId, String userId, boolean agree, String extra) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putBoolean("agree", agree);
      arguments.putString("extra", extra);
      sendEvent("Engine:OnJoinSubRoomRequestResponseReceived", arguments);
    }

    @Override
    public void onSubRoomJoined(String roomId, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnSubRoomJoined", arguments);
    }

    @Override
    public void onSubRoomLeft(String roomId, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnSubRoomLeft", arguments);
    }

    @Override
    public void onSubRoomBanded(String roomId) {
      sendEvent("Engine:OnSubRoomBanded", roomId);
    }

    @Override
    public void onSubRoomDisband(String roomId, String userId) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      sendEvent("Engine:OnSubRoomDisband", arguments);
    }

    @Override
    public void onLiveRoleSwitched(RCRTCIWRole current, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("current", current.ordinal());
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("Engine:OnLiveRoleSwitched", arguments);
    }

    @Override
    public void onRemoteLiveRoleSwitched(String roomId, String userId, RCRTCIWRole role) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putInt("role", role.ordinal());
      sendEvent("Engine:OnRemoteLiveRoleSwitched", arguments);
    }
  }

  private class StatsListenerImpl extends RCRTCIWStatusListener {
    @Override
    public void onNetworkStats(RCRTCIWNetworkStats stats) {
      sendEvent("Stats:OnNetworkStats", ArgumentAdapter.fromNetworkStats(stats));
    }

    @Override
    public void onLocalAudioStats(RCRTCIWLocalAudioStats stats) {
      sendEvent("Stats:OnLocalAudioStats", ArgumentAdapter.fromLocalAudioStats(stats));
    }

    @Override
    public void onLocalVideoStats(RCRTCIWLocalVideoStats stats) {
      sendEvent("Stats:OnLocalVideoStats", ArgumentAdapter.fromLocalVideoStats(stats));
    }


    @Override
    public void onRemoteAudioStats(String roomId, String userId, RCRTCIWRemoteAudioStats stats) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putMap("stats", ArgumentAdapter.fromRemoteAudioStats(stats));
      sendEvent("Stats:OnRemoteAudioStats", arguments);
    }

    @Override
    public void onRemoteVideoStats(String roomId, String userId, RCRTCIWRemoteVideoStats stats) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putMap("stats", ArgumentAdapter.fromRemoteVideoStats(stats));
      sendEvent("Stats:OnRemoteVideoStats", arguments);
    }

    @Override
    public void onLiveMixAudioStats(RCRTCIWRemoteAudioStats stats) {
      sendEvent("Stats:OnLiveMixAudioStats", ArgumentAdapter.fromRemoteAudioStats(stats));
    }

    @Override
    public void onLiveMixVideoStats(RCRTCIWRemoteVideoStats stats) {
      sendEvent("Stats:OnLiveMixVideoStats", ArgumentAdapter.fromRemoteVideoStats(stats));
    }

    @Override
    public void onLiveMixMemberAudioStats(String userId, int volume) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("userId", userId);
      arguments.putInt("volume", volume);
      sendEvent("Stats:OnLiveMixMemberAudioStats", arguments);
    }

    @Override
    public void onLiveMixMemberCustomAudioStats(String userId, String tag, int volume) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("userId", userId);
      arguments.putString("tag", tag);
      arguments.putInt("volume", volume);
      sendEvent("Stats:OnLiveMixMemberCustomAudioStats", arguments);
    }

    @Override
    public void onLocalCustomAudioStats(String tag, RCRTCIWLocalAudioStats stats) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("tag", tag);
      arguments.putMap("stats", ArgumentAdapter.fromLocalAudioStats(stats));
      sendEvent("Stats:OnLocalCustomAudioStats", arguments);
    }

    @Override
    public void onLocalCustomVideoStats(String tag, RCRTCIWLocalVideoStats stats) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("tag", tag);
      arguments.putMap("stats", ArgumentAdapter.fromLocalVideoStats(stats));
      sendEvent("Stats:OnLocalCustomVideoStats", arguments);
    }

    @Override
    public void onRemoteCustomAudioStats(String roomId, String userId, String tag, RCRTCIWRemoteAudioStats stats) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putString("tag", tag);
      arguments.putMap("stats", ArgumentAdapter.fromRemoteAudioStats(stats));
      sendEvent("Stats:OnRemoteCustomAudioStats", arguments);
    }

    @Override
    public void onRemoteCustomVideoStats(String roomId, String userId, String tag, RCRTCIWRemoteVideoStats stats) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putString("tag", tag);
      arguments.putMap("stats", ArgumentAdapter.fromRemoteVideoStats(stats));
      sendEvent("Stats:OnRemoteCustomVideoStats", arguments);
    }
  }

  private void sendEvent(String event, @Nullable WritableMap arguments) {
    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(event, arguments);
  }

  private void sendEvent(String event, @Nullable Object object) {
    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(event, object);
  }

  private String getRealPath(String file) {
    String fileName = null;
    Uri uri = Uri.parse(file);
    String scheme = uri.getScheme();

    if (scheme.equals("content")) {
      Cursor cursor = this.context.getContentResolver().query(uri, null, null, null, null);
      if (cursor != null && cursor.moveToFirst()) {
        try {
          int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
          fileName = cursor.getString(column_index);
        } catch (IllegalArgumentException e) {
          e.printStackTrace();
        } finally {
          cursor.close();
        }
      }
    } else if (scheme.equals("file")) {
      fileName = uri.getPath();
    }
    return fileName;
  }

  private final ReactApplicationContext context;
  private RCRTCIWEngine engine;
}
