package cn.rongcloud.rn.call;

import android.widget.FrameLayout;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

/**
 * Created by wangw on 2021/7/22.
 */
public class RCReactNativeCallViewManager extends SimpleViewManager<FrameLayout> {

    @Override
    public String getName() {
        return "RCReactNativeCallView";
    }

    @Override
    protected FrameLayout createViewInstance(ThemedReactContext themedReactContext) {
        return new FrameLayout(themedReactContext);
    }
}
