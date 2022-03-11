package cn.rongcloud.rtc.rn;

import android.content.Context;
import android.util.AttributeSet;
import android.view.Gravity;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import cn.rongcloud.rtc.wrapper.RCRTCIWView;
import cn.rongcloud.rtc.wrapper.constants.RCRTCIWViewFitType;


public class RCReactNativeRtcViewManager extends SimpleViewManager<FrameLayout> {
  class RCReactNativeFrameLayout extends FrameLayout {
    public RCReactNativeFrameLayout(Context context) {
      super(context);
    }

    @Override
    public void requestLayout() {
      super.requestLayout();
      post(new Runnable() {
        @Override
        public void run() {
          measure(MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY), MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
          layout(getLeft(), getTop(), getRight(), getBottom());
        }
      });
    }
  }

  @NonNull
  @Override
  public String getName() {
    return "RCReactNativeRtcView";
  }

  @NonNull
  @Override
  protected FrameLayout createViewInstance(@NonNull ThemedReactContext context) {
    FrameLayout layout = new RCReactNativeFrameLayout(context);
    RCRTCIWView view = new RCRTCIWView(context);
    FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT);
    layoutParams.gravity = Gravity.CENTER;
    layout.addView(view, layoutParams);
    return layout;
  }


  @ReactProp(name = "fitType")
  public void setFitType(FrameLayout view, int fitType) {
    RCRTCIWView _view = (RCRTCIWView) ((FrameLayout) view).getChildAt(0);
    if (view != null) {
      _view.setFitType(RCRTCIWViewFitType.values()[fitType]);
    }
    view.requestLayout();
  }

  @ReactProp(name = "mirror")
  public void setMirror(FrameLayout view, boolean mirror) {
    RCRTCIWView _view = (RCRTCIWView) ((FrameLayout) view).getChildAt(0);
    if (_view != null) {
      _view.setMirror(mirror);
    }
    view.requestLayout();
  }
}
