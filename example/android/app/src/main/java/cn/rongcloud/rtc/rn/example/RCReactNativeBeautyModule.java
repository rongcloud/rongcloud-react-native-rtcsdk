package cn.rongcloud.rtc.rn.example;

import android.content.Context;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import cn.rongcloud.rtc.rn.RCReactNativeRtc;
import cn.rongcloud.rtc.rn.beauty.BeautyVideoOutputFrameListener;

public class RCReactNativeBeautyModule extends ReactContextBaseJavaModule {
  private final Context context;
  private BeautyVideoOutputFrameListener beautyVideoOutputFrameListener;

  public RCReactNativeBeautyModule(ReactApplicationContext context) {
    super(context);
    this.context = context;
  }


  @NonNull
  @Override
  public String getName() {
    return "Beauty";
  }
  //Promise promise
  @ReactMethod
  public void openBeauty(Promise promise) {
    if (beautyVideoOutputFrameListener == null) {
      beautyVideoOutputFrameListener = new BeautyVideoOutputFrameListener();
      RCReactNativeRtc.getInstance().setLocalVideoProcessedListener(beautyVideoOutputFrameListener);
      promise.resolve(0);
      return;
    }
    promise.resolve(-1);
  }

  @ReactMethod
  public void closeBeauty(Promise promise) {
    if (beautyVideoOutputFrameListener != null) {
      RCReactNativeRtc.getInstance().getInstance().setLocalVideoProcessedListener(null);
      beautyVideoOutputFrameListener.destroy();
      beautyVideoOutputFrameListener = null;
      promise.resolve(0);
      return;
    }
    promise.resolve(-1);
  }
}
