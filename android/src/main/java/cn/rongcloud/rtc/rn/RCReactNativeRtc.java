package cn.rongcloud.rtc.rn;

import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.PointF;
import android.net.Uri;
import android.provider.MediaStore;
import android.widget.FrameLayout;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import cn.rongcloud.rtc.wrapper.RCRTCIWEngine;
import cn.rongcloud.rtc.wrapper.RCRTCIWView;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWCamera;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWLocalAudioStats;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWLocalVideoStats;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWMediaType;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWNetworkProbeStats;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWNetworkStats;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWRemoteAudioStats;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWRemoteVideoStats;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWRole;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWVideoFps;
import cn.rongcloud.rtc.wrapper.listener.RCRTCIWListener;
import cn.rongcloud.rtc.wrapper.listener.RCRTCIWNetworkProbeListener;
import cn.rongcloud.rtc.wrapper.listener.RCRTCIWOnReadableAudioFrameListener;
import cn.rongcloud.rtc.wrapper.listener.RCRTCIWOnReadableVideoFrameListener;
import cn.rongcloud.rtc.wrapper.listener.RCRTCIWOnWritableAudioFrameListener;
import cn.rongcloud.rtc.wrapper.listener.RCRTCIWOnWritableVideoFrameListener;
import cn.rongcloud.rtc.wrapper.listener.RCRTCIWStatusListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableNativeMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;
import io.rong.imlib.model.Message;
import io.rong.message.utils.BitmapUtil;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class RCReactNativeRtc extends ReactContextBaseJavaModule {
  private static RCReactNativeRtc _instance = null;

  protected static RCReactNativeRtc getInstance(ReactApplicationContext reactContext) {
    if (_instance == null) _instance = new RCReactNativeRtc(reactContext);
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

  private boolean check_engine(Promise promise) {
    if (engine == null) {
      promise.reject(String.valueOf(-1), "engine is null");
      return false;
    }

    return true;
  }

  @ReactMethod
  public void create(ReadableMap setup, Promise promise) {
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
  public void destroy() {
    if (engine != null) {
      engine.destroy();
      engine = null;
    }
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
      code =
          engine.setCameraCaptureOrientation(
              ArgumentAdapter.toCameraCaptureOrientation(orientation));
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setLocalView(final int tag, final Promise promise) {
    UIManagerModule manager = context.getNativeModule(UIManagerModule.class);
    assert manager != null;
    manager.addUIBlock(
        new UIBlock() {
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
    manager.addUIBlock(
        new UIBlock() {
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
    manager.addUIBlock(
        new UIBlock() {
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
  public void setLiveMixVideoResolution(
      Integer width, Integer height, Boolean tiny, Promise promise) {
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
  public void startAudioMixing(
      String path, Integer mode, Boolean playback, Integer loop, Promise promise) {
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
  public void createCustomStreamFromFile(
      String path, String tag, Boolean replace, Boolean playback, Promise promise) {
    int code = -1;
    if (engine != null) {
      if (path.startsWith("content://") || path.startsWith("file://")) path = getRealPath(path);
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
    manager.addUIBlock(
        new UIBlock() {
          @Override
          public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
            int code = -1;
            // View nativeView = nativeViewHierarchyManager.resolveView(view);
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
  public void muteRemoteCustomStream(
      String userId, String tag, int type, Boolean mute, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.muteRemoteCustomStream(userId, tag, ArgumentAdapter.toMediaType(type), mute);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void setRemoteCustomStreamView(
      String userId, String tag, final int view, Promise promise) {
    UIManagerModule manager = context.getNativeModule(UIManagerModule.class);
    assert manager != null;
    manager.addUIBlock(
        new UIBlock() {
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
  public void subscribeCustomStream(
      String userId, String tag, int type, Boolean tiny, Promise promise) {
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
  public void requestJoinSubRoom(
      String roomId, String userId, Boolean autoLayout, String extra, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.requestJoinSubRoom(roomId, userId, autoLayout, extra);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void cancelJoinSubRoomRequest(
      String roomId, String userId, String extra, Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.cancelJoinSubRoomRequest(roomId, userId, extra);
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void responseJoinSubRoomRequest(
      String roomId,
      String userId,
      Boolean agree,
      Boolean autoLayout,
      String extra,
      Promise promise) {
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

  @ReactMethod
  public void setLiveMixInnerCdnStreamView(final int tag, final Promise promise) {
    UIManagerModule manager = context.getNativeModule(UIManagerModule.class);
    assert manager != null;
    manager.addUIBlock(
        new UIBlock() {
          @Override
          public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
            int code = -1;

            FrameLayout layout = (FrameLayout) nativeViewHierarchyManager.resolveView(tag);
            RCRTCIWView nativeView = (RCRTCIWView) layout.getChildAt(0);

            if (engine != null) {
              code = engine.setLiveMixInnerCdnStreamView(nativeView);
            }
            promise.resolve(code);
          }
        });
  }

  @ReactMethod
  public void setWatermark(String imagePath, ReadableMap position, Double zoom, Promise promise) {
    int code = -1;
    if (engine != null) {
      if (!imagePath.startsWith("file://")) {
        imagePath = "file://" + imagePath;
      }
      Bitmap imageBitMap = BitmapUtil.getFactoryBitmap(context, Uri.parse(imagePath));
      ReadableNativeMap map = (ReadableNativeMap) position;
      HashMap hashMap = map.toHashMap();
      PointF point = new PointF();
      Double x = (Double) hashMap.get("x");
      Double y = (Double) hashMap.get("y");
      point.x = x.floatValue();
      point.y = y.floatValue();
      code = engine.setWatermark(imageBitMap, point, zoom.floatValue());
    }
    promise.resolve(code);
  }

  @ReactMethod
  public void startNetworkProbe(Promise promise) {
    int code = -1;
    if (engine != null) {
      code = engine.startNetworkProbe(new NetworkProbeListenerImpl());
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

  public int setRemoteAudioReceivedListener(
      String userId, RCRTCIWOnWritableAudioFrameListener listener) {
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

  public int setRemoteVideoProcessedListener(
      String userId, RCRTCIWOnReadableVideoFrameListener listener) {
    int code = -1;
    if (engine != null) {
      code = engine.setRemoteVideoProcessedListener(userId, listener);
    }
    return code;
  }

  public int setLocalCustomVideoProcessedListener(
      String tag, RCRTCIWOnWritableVideoFrameListener listener) {
    int code = -1;
    if (engine != null) {
      code = engine.setLocalCustomVideoProcessedListener(tag, listener);
    }
    return code;
  }

  public int setRemoteCustomVideoProcessedListener(
      String userId, String tag, RCRTCIWOnReadableVideoFrameListener listener) {
    int code = -1;
    if (engine != null) {
      code = engine.setRemoteCustomVideoProcessedListener(userId, tag, listener);
    }
    return code;
  }

  public int setRemoteCustomAudioReceivedListener(
      String userId, String tag, RCRTCIWOnReadableAudioFrameListener listener) {
    int code = -1;
    if (engine != null) {
      code = engine.setRemoteCustomAudioReceivedListener(userId, tag, listener);
    }
    return code;
  }

  @ReactMethod
  public void muteAllRemoteAudioStreams(boolean mute, Promise promise) {
    if (!check_engine(promise)) return;
    int r = engine.muteAllRemoteAudioStreams(mute);
    promise.resolve(r);
  }

  @ReactMethod
  public void switchLiveRole(int role, Promise promise) {
    RCRTCIWRole _role = RCRTCIWRole.values()[role];
    if (!check_engine(promise)) return;
    int r = engine.switchLiveRole(_role);
    promise.resolve(r);
  }

  @ReactMethod
  public void enableLiveMixInnerCdnStream(boolean enable, Promise promise) {
    if (!check_engine(promise)) return;
    int r = engine.enableLiveMixInnerCdnStream(enable);
    promise.resolve(r);
  }

  @ReactMethod
  public void subscribeLiveMixInnerCdnStream(Promise promise) {
    if (!check_engine(promise)) return;
    int r = engine.subscribeLiveMixInnerCdnStream();
    promise.resolve(r);
  }

  @ReactMethod
  public void unsubscribeLiveMixInnerCdnStream(Promise promise) {
    if (!check_engine(promise)) return;
    int r = engine.unsubscribeLiveMixInnerCdnStream();
    promise.resolve(r);
  }

  @ReactMethod
  public void removeLiveMixInnerCdnStreamView(Promise promise) {
    if (!check_engine(promise)) return;
    int r = engine.removeLiveMixInnerCdnStreamView();
    promise.resolve(r);
  }

  @ReactMethod
  public void setLocalLiveMixInnerCdnVideoResolution(int width, int height, Promise promise) {
    if (!check_engine(promise)) return;
    int r = engine.setLocalLiveMixInnerCdnVideoResolution(width, height);
    promise.resolve(r);
  }

  @ReactMethod
  public void setLocalLiveMixInnerCdnVideoFps(int fps, Promise promise) {
    RCRTCIWVideoFps _fps = RCRTCIWVideoFps.values()[fps];
    if (!check_engine(promise)) return;
    int r = engine.setLocalLiveMixInnerCdnVideoFps(_fps);
    promise.resolve(r);
  }

  @ReactMethod
  public void muteLiveMixInnerCdnStream(boolean mute, Promise promise) {
    if (!check_engine(promise)) return;
    int r = engine.muteLiveMixInnerCdnStream(mute);
    promise.resolve(r);
  }

  @ReactMethod
  public void removeWatermark(Promise promise) {
    if (!check_engine(promise)) return;
    int r = engine.removeWatermark();
    promise.resolve(r);
  }

  @ReactMethod
  public void stopNetworkProbe(Promise promise) {
    if (!check_engine(promise)) return;
    int r = engine.stopNetworkProbe();
    promise.resolve(r);
  }

  @ReactMethod
  public void startEchoTest(int timeInterval, Promise promise) {
    if (!check_engine(promise)) return;
    int r = engine.startEchoTest(timeInterval);
    promise.resolve(r);
  }

  @ReactMethod
  public void stopEchoTest(Promise promise) {
    if (!check_engine(promise)) return;
    int r = engine.stopEchoTest();
    promise.resolve(r);
  }

  @ReactMethod
  public void enableSei(boolean enable, Promise promise) {
    if (!check_engine(promise)) return;
    int r = engine.enableSei(enable);
    promise.resolve(r);
  }

  @ReactMethod
  public void sendSei(String sei, Promise promise) {
    if (!check_engine(promise)) return;
    int r = engine.sendSei(sei);
    promise.resolve(r);
  }

  @ReactMethod
  public void preconnectToMediaServer(Promise promise) {
    if (!check_engine(promise)) return;
    int r = engine.preconnectToMediaServer();
    promise.resolve(r);
  }

  private class ListenerImpl extends RCRTCIWListener {
    @Override
    public void onError(int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onError", arguments);
    }

    @Override
    public void onKicked(String id, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("id", id);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onKicked", arguments);
    }

    @Override
    public void onRoomJoined(int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onRoomJoined", arguments);
    }

    @Override
    public void onRoomLeft(int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onRoomLeft", arguments);
    }

    @Override
    public void onPublished(RCRTCIWMediaType type, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("type", type.ordinal());
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onPublished", arguments);
    }

    @Override
    public void onUnpublished(RCRTCIWMediaType type, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("type", type.ordinal());
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onUnpublished", arguments);
    }

    @Override
    public void onSubscribed(String userId, RCRTCIWMediaType type, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("userId", userId);
      arguments.putInt("type", type.ordinal());
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onSubscribed", arguments);
    }

    @Override
    public void onUnsubscribed(String userId, RCRTCIWMediaType type, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("userId", userId);
      arguments.putInt("type", type.ordinal());
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onUnsubscribed", arguments);
    }

    @Override
    public void onLiveMixSubscribed(RCRTCIWMediaType type, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("type", type.ordinal());
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onLiveMixSubscribed", arguments);
    }

    @Override
    public void onLiveMixUnsubscribed(RCRTCIWMediaType type, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("type", type.ordinal());
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onLiveMixUnsubscribed", arguments);
    }

    @Override
    public void onCameraEnabled(boolean enable, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putBoolean("enable", enable);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onCameraEnabled", arguments);
    }

    @Override
    public void onCameraSwitched(RCRTCIWCamera camera, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("camera", camera.ordinal());
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onCameraSwitched", arguments);
    }

    @Override
    public void onLiveCdnAdded(String url, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("url", url);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onLiveCdnAdded", arguments);
    }

    @Override
    public void onLiveCdnRemoved(String url, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("url", url);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onLiveCdnRemoved", arguments);
    }

    @Override
    public void onLiveMixLayoutModeSet(int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onLiveMixLayoutModeSet", arguments);
    }

    @Override
    public void onLiveMixRenderModeSet(int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onLiveMixRenderModeSet", arguments);
    }

    @Override
    public void onLiveMixCustomLayoutsSet(int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onLiveMixCustomLayoutsSet", arguments);
    }

    @Override
    public void onLiveMixCustomAudiosSet(int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onLiveMixCustomAudiosSet", arguments);
    }

    @Override
    public void onLiveMixAudioBitrateSet(int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onLiveMixAudioBitrateSet", arguments);
    }

    @Override
    public void onLiveMixVideoBitrateSet(boolean tiny, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putBoolean("tiny", tiny);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onLiveMixVideoBitrateSet", arguments);
    }

    @Override
    public void onLiveMixVideoResolutionSet(boolean tiny, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putBoolean("tiny", tiny);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onLiveMixVideoResolutionSet", arguments);
    }

    @Override
    public void onLiveMixVideoFpsSet(boolean tiny, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putBoolean("tiny", tiny);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onLiveMixVideoFpsSet", arguments);
    }

    @Override
    public void onAudioEffectCreated(int id, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("id", id);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onAudioEffectCreated", arguments);
    }

    @Override
    public void onAudioEffectFinished(final int id) {
      sendEvent("IRCRTCIWListener:onAudioEffectFinished", id);
    }

    @Override
    public void onAudioMixingStarted() {
      sendEvent("IRCRTCIWListener:onAudioMixingStarted", null);
    }

    @Override
    public void onAudioMixingPaused() {
      sendEvent("IRCRTCIWListener:onAudioMixingPaused", null);
    }

    @Override
    public void onAudioMixingStopped() {
      sendEvent("IRCRTCIWListener:onAudioMixingStopped", null);
    }

    @Override
    public void onAudioMixingFinished() {
      sendEvent("IRCRTCIWListener:onAudioMixingFinished", null);
    }

    @Override
    public void onUserJoined(String roomId, final String userId) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      sendEvent("IRCRTCIWListener:onUserJoined", arguments);
    }

    @Override
    public void onUserOffline(String roomId, final String userId) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      sendEvent("IRCRTCIWListener:onUserOffline", arguments);
    }

    @Override
    public void onUserLeft(String roomId, final String userId) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      sendEvent("IRCRTCIWListener:onUserLeft", arguments);
    }

    @Override
    public void onRemotePublished(String roomId, String userId, RCRTCIWMediaType type) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putInt("type", type.ordinal());
      sendEvent("IRCRTCIWListener:onRemotePublished", arguments);
    }

    @Override
    public void onRemoteUnpublished(String roomId, String userId, RCRTCIWMediaType type) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putInt("type", type.ordinal());
      sendEvent("IRCRTCIWListener:onRemoteUnpublished", arguments);
    }

    @Override
    public void onRemoteLiveMixPublished(final RCRTCIWMediaType type) {
      sendEvent("IRCRTCIWListener:onRemoteLiveMixPublished", type.ordinal());
    }

    @Override
    public void onRemoteLiveMixUnpublished(final RCRTCIWMediaType type) {
      sendEvent("IRCRTCIWListener:onRemoteLiveMixUnpublished", type.ordinal());
    }

    @Override
    public void onRemoteStateChanged(
        String roomId, String userId, RCRTCIWMediaType type, boolean disabled) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putInt("type", type.ordinal());
      arguments.putBoolean("disabled", disabled);
      sendEvent("IRCRTCIWListener:onRemoteStateChanged", arguments);
    }

    @Override
    public void onRemoteFirstFrame(String roomId, String userId, RCRTCIWMediaType type) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putInt("type", type.ordinal());
      sendEvent("IRCRTCIWListener:onRemoteFirstFrame", arguments);
    }

    @Override
    public void onRemoteLiveMixFirstFrame(final RCRTCIWMediaType type) {
      sendEvent("IRCRTCIWListener:onRemoteLiveMixFirstFrame", type.ordinal());
    }

    @Override
    public void onMessageReceived(String roomId, Message message) {
      // TODO sendEvent("IRCRTCIWListener:onMessageReceived", argument);
    }

    @Override
    public void onLiveMixBackgroundColorSet(int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onLiveMixBackgroundColorSet", arguments);
    }

    @Override
    public void onCustomStreamPublished(String tag, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("tag", tag);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onCustomStreamPublished", arguments);
    }

    @Override
    public void onCustomStreamPublishFinished(String tag) {
      sendEvent("IRCRTCIWListener:onCustomStreamPublishFinished", tag);
    }

    @Override
    public void onCustomStreamUnpublished(String tag, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("tag", tag);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onCustomStreamUnpublished", arguments);
    }

    @Override
    public void onRemoteCustomStreamPublished(
        String roomId, String userId, String tag, RCRTCIWMediaType type) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putString("tag", tag);
      arguments.putInt("type", type.ordinal());
      sendEvent("IRCRTCIWListener:onRemoteCustomStreamPublished", arguments);
    }

    @Override
    public void onRemoteCustomStreamUnpublished(
        String roomId, String userId, String tag, RCRTCIWMediaType type) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putString("tag", tag);
      arguments.putInt("type", type.ordinal());
      sendEvent("IRCRTCIWListener:onRemoteCustomStreamUnpublished", arguments);
    }

    @Override
    public void onRemoteCustomStreamStateChanged(
        String roomId, String userId, String tag, RCRTCIWMediaType type, boolean disabled) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putString("tag", tag);
      arguments.putInt("type", type.ordinal());
      arguments.putBoolean("disabled", disabled);
      sendEvent("IRCRTCIWListener:onRemoteCustomStreamStateChanged", arguments);
    }

    @Override
    public void onRemoteCustomStreamFirstFrame(
        String roomId, String userId, String tag, RCRTCIWMediaType type) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putString("tag", tag);
      arguments.putInt("type", type.ordinal());
      sendEvent("IRCRTCIWListener:onRemoteCustomStreamFirstFrame", arguments);
    }

    @Override
    public void onCustomStreamSubscribed(
        String userId, String tag, RCRTCIWMediaType type, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("userId", userId);
      arguments.putString("tag", tag);
      arguments.putInt("type", type.ordinal());
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onCustomStreamSubscribed", arguments);
    }

    @Override
    public void onCustomStreamUnsubscribed(
        String userId, String tag, RCRTCIWMediaType type, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("userId", userId);
      arguments.putString("tag", tag);
      arguments.putInt("type", type.ordinal());
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onCustomStreamUnsubscribed", arguments);
    }

    @Override
    public void onJoinSubRoomRequested(String roomId, String userId, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onJoinSubRoomRequested", arguments);
    }

    @Override
    public void onJoinSubRoomRequestCanceled(
        String roomId, String userId, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onJoinSubRoomRequestCanceled", arguments);
    }

    @Override
    public void onJoinSubRoomRequestResponded(
        String roomId, String userId, boolean agree, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putInt("code", code);
      arguments.putBoolean("agree", agree);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onJoinSubRoomRequestResponded", arguments);
    }

    @Override
    public void onJoinSubRoomRequestReceived(String roomId, String userId, String extra) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putString("extra", extra);
      sendEvent("IRCRTCIWListener:onJoinSubRoomRequestReceived", arguments);
    }

    @Override
    public void onCancelJoinSubRoomRequestReceived(String roomId, String userId, String extra) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putString("extra", extra);
      sendEvent("IRCRTCIWListener:onCancelJoinSubRoomRequestReceived", arguments);
    }

    @Override
    public void onJoinSubRoomRequestResponseReceived(
        String roomId, String userId, boolean agree, String extra) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putBoolean("agree", agree);
      arguments.putString("extra", extra);
      sendEvent("IRCRTCIWListener:onJoinSubRoomRequestResponseReceived", arguments);
    }

    @Override
    public void onSubRoomJoined(String roomId, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onSubRoomJoined", arguments);
    }

    @Override
    public void onSubRoomLeft(String roomId, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onSubRoomLeft", arguments);
    }

    @Override
    public void onSubRoomBanded(String roomId) {
      sendEvent("IRCRTCIWListener:onSubRoomBanded", roomId);
    }

    @Override
    public void onSubRoomDisband(String roomId, String userId) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      sendEvent("IRCRTCIWListener:onSubRoomDisband", arguments);
    }

    @Override
    public void onLiveRoleSwitched(RCRTCIWRole current, int code, String message) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("current", current.ordinal());
      arguments.putInt("code", code);
      arguments.putString("message", message);
      sendEvent("IRCRTCIWListener:onLiveRoleSwitched", arguments);
    }

    @Override
    public void onRemoteLiveRoleSwitched(String roomId, String userId, RCRTCIWRole role) {
      String eventName = "IRCRTCIWListener:onRemoteLiveRoleSwitched";
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putInt("role", role.ordinal());
      context
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, arguments);
    }

    @Override
    public void onLiveMixInnerCdnStreamEnabled(boolean enable, int code, String errMsg) {
      String eventName = "IRCRTCIWListener:onLiveMixInnerCdnStreamEnabled";
      WritableMap arguments = Arguments.createMap();
      arguments.putBoolean("enable", enable);
      arguments.putInt("code", code);
      arguments.putString("errMsg", errMsg);
      context
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, arguments);
    }

    @Override
    public void onRemoteLiveMixInnerCdnStreamPublished() {
      String eventName = "IRCRTCIWListener:onRemoteLiveMixInnerCdnStreamPublished";
      WritableMap arguments = Arguments.createMap();
      context
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, arguments);
    }

    @Override
    public void onRemoteLiveMixInnerCdnStreamUnpublished() {
      String eventName = "IRCRTCIWListener:onRemoteLiveMixInnerCdnStreamUnpublished";
      WritableMap arguments = Arguments.createMap();
      context
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, arguments);
    }

    @Override
    public void onLiveMixInnerCdnStreamSubscribed(int code, String errMsg) {
      String eventName = "IRCRTCIWListener:onLiveMixInnerCdnStreamSubscribed";
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("errMsg", errMsg);
      context
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, arguments);
    }

    @Override
    public void onLiveMixInnerCdnStreamUnsubscribed(int code, String errMsg) {
      String eventName = "IRCRTCIWListener:onLiveMixInnerCdnStreamUnsubscribed";
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("errMsg", errMsg);
      context
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, arguments);
    }

    @Override
    public void onLocalLiveMixInnerCdnVideoResolutionSet(int code, String errMsg) {
      String eventName = "IRCRTCIWListener:onLocalLiveMixInnerCdnVideoResolutionSet";
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("errMsg", errMsg);
      context
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, arguments);
    }

    @Override
    public void onLocalLiveMixInnerCdnVideoFpsSet(int code, String errMsg) {
      String eventName = "IRCRTCIWListener:onLocalLiveMixInnerCdnVideoFpsSet";
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("errMsg", errMsg);
      context
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, arguments);
    }

    @Override
    public void onWatermarkSet(int code, String errMsg) {
      String eventName = "IRCRTCIWListener:onWatermarkSet";
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("errMsg", errMsg);
      context
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, arguments);
    }

    @Override
    public void onWatermarkRemoved(int code, String errMsg) {
      String eventName = "IRCRTCIWListener:onWatermarkRemoved";
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("errMsg", errMsg);
      context
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, arguments);
    }

    @Override
    public void onNetworkProbeStarted(int code, String errMsg) {
      String eventName = "IRCRTCIWListener:onNetworkProbeStarted";
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("errMsg", errMsg);
      context
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, arguments);
    }

    @Override
    public void onNetworkProbeStopped(int code, String errMsg) {
      String eventName = "IRCRTCIWListener:onNetworkProbeStopped";
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("errMsg", errMsg);
      context
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, arguments);
    }

    @Override
    public void onSeiEnabled(boolean enable, int code, String errMsg) {
      String eventName = "IRCRTCIWListener:onSeiEnabled";
      WritableMap arguments = Arguments.createMap();
      arguments.putBoolean("enable", enable);
      arguments.putInt("code", code);
      arguments.putString("errMsg", errMsg);
      context
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, arguments);
    }

    @Override
    public void onSeiReceived(String roomId, String userId, String sei) {
      String eventName = "IRCRTCIWListener:onSeiReceived";
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putString("sei", sei);
      context
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, arguments);
    }

    @Override
    public void onLiveMixSeiReceived(String sei) {
      String eventName = "IRCRTCIWListener:onLiveMixSeiReceived";
      WritableMap arguments = Arguments.createMap();
      arguments.putString("sei", sei);
      context
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(eventName, arguments);
    }
  }

  private class StatsListenerImpl extends RCRTCIWStatusListener {
    @Override
    public void onNetworkStats(RCRTCIWNetworkStats stats) {
      sendEvent("IRCRTCIWStatsListener:OnNetworkStats", ArgumentAdapter.fromNetworkStats(stats));
    }

    @Override
    public void onLocalAudioStats(RCRTCIWLocalAudioStats stats) {
      sendEvent(
          "IRCRTCIWStatsListener:OnLocalAudioStats", ArgumentAdapter.fromLocalAudioStats(stats));
    }

    @Override
    public void onLocalVideoStats(RCRTCIWLocalVideoStats stats) {
      sendEvent(
          "IRCRTCIWStatsListener:OnLocalVideoStats", ArgumentAdapter.fromLocalVideoStats(stats));
    }

    @Override
    public void onRemoteAudioStats(String roomId, String userId, RCRTCIWRemoteAudioStats stats) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putMap("stats", ArgumentAdapter.fromRemoteAudioStats(stats));
      sendEvent("IRCRTCIWStatsListener:OnRemoteAudioStats", arguments);
    }

    @Override
    public void onRemoteVideoStats(String roomId, String userId, RCRTCIWRemoteVideoStats stats) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putMap("stats", ArgumentAdapter.fromRemoteVideoStats(stats));
      sendEvent("IRCRTCIWStatsListener:OnRemoteVideoStats", arguments);
    }

    @Override
    public void onLiveMixAudioStats(RCRTCIWRemoteAudioStats stats) {
      sendEvent(
          "IRCRTCIWStatsListener:OnLiveMixAudioStats", ArgumentAdapter.fromRemoteAudioStats(stats));
    }

    @Override
    public void onLiveMixVideoStats(RCRTCIWRemoteVideoStats stats) {
      sendEvent(
          "IRCRTCIWStatsListener:OnLiveMixVideoStats", ArgumentAdapter.fromRemoteVideoStats(stats));
    }

    @Override
    public void onLiveMixMemberAudioStats(String userId, int volume) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("userId", userId);
      arguments.putInt("volume", volume);
      sendEvent("IRCRTCIWStatsListener:OnLiveMixMemberAudioStats", arguments);
    }

    @Override
    public void onLiveMixMemberCustomAudioStats(String userId, String tag, int volume) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("userId", userId);
      arguments.putString("tag", tag);
      arguments.putInt("volume", volume);
      sendEvent("IRCRTCIWStatsListener:OnLiveMixMemberCustomAudioStats", arguments);
    }

    @Override
    public void onLocalCustomAudioStats(String tag, RCRTCIWLocalAudioStats stats) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("tag", tag);
      arguments.putMap("stats", ArgumentAdapter.fromLocalAudioStats(stats));
      sendEvent("IRCRTCIWStatsListener:OnLocalCustomAudioStats", arguments);
    }

    @Override
    public void onLocalCustomVideoStats(String tag, RCRTCIWLocalVideoStats stats) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("tag", tag);
      arguments.putMap("stats", ArgumentAdapter.fromLocalVideoStats(stats));
      sendEvent("IRCRTCIWStatsListener:OnLocalCustomVideoStats", arguments);
    }

    @Override
    public void onRemoteCustomAudioStats(
        String roomId, String userId, String tag, RCRTCIWRemoteAudioStats stats) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putString("tag", tag);
      arguments.putMap("stats", ArgumentAdapter.fromRemoteAudioStats(stats));
      sendEvent("IRCRTCIWStatsListener:OnRemoteCustomAudioStats", arguments);
    }

    @Override
    public void onRemoteCustomVideoStats(
        String roomId, String userId, String tag, RCRTCIWRemoteVideoStats stats) {
      WritableMap arguments = Arguments.createMap();
      arguments.putString("roomId", roomId);
      arguments.putString("userId", userId);
      arguments.putString("tag", tag);
      arguments.putMap("stats", ArgumentAdapter.fromRemoteVideoStats(stats));
      sendEvent("IRCRTCIWStatsListener:OnRemoteCustomVideoStats", arguments);
    }
  }

  private class NetworkProbeListenerImpl extends RCRTCIWNetworkProbeListener {
    @Override
    public void onNetworkProbeUpLinkStats(RCRTCIWNetworkProbeStats stats) {
      WritableMap arguments = ArgumentAdapter.fromNetworkProbeStats(stats);
      sendEvent("IRCRTCIWListener:onNetworkProbeUpLinkStats", arguments);
    }

    @Override
    public void onNetworkProbeDownLinkStats(RCRTCIWNetworkProbeStats stats) {
      WritableMap arguments = ArgumentAdapter.fromNetworkProbeStats(stats);
      sendEvent("IRCRTCIWListener:onNetworkProbeDownLinkStats", arguments);
    }

    @Override
    public void onNetworkProbeFinished(int code, String errMsg) {
      WritableMap arguments = Arguments.createMap();
      arguments.putInt("code", code);
      arguments.putString("errMsg", errMsg);
      sendEvent("IRCRTCIWListener:onNetworkProbeFinished", arguments);
    }
  }

  private void sendEvent(String event, @Nullable WritableMap arguments) {
    context
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit(event, arguments);
  }

  private void sendEvent(String event, @Nullable Object object) {
    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(event, object);
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
