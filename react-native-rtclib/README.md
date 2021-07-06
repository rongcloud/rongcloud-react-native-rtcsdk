
# rc-react-native-rtclib

## Getting started

`$ npm install rc-react-native-rtclib --save`

### Mostly automatic installation

`$ react-native link rc-react-native-rtclib`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `rc-react-native-rtclib` and add `RCReactNativeRtclib.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRCReactNativeRtclib.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import cn.rongcloud.rn.rtc.RCReactNativeRtclibPackage;` to the imports at the top of the file
  - Add `new RCReactNativeRtclibPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':rc-react-native-rtclib'
  	project(':rc-react-native-rtclib').projectDir = new File(rootProject.projectDir, 	'../node_modules/rc-react-native-rtclib/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':rc-react-native-rtclib')
  	```


## Usage
```javascript
import RCReactNativeRtclib from 'rc-react-native-rtclib';

// TODO: What to do with the module?
RCReactNativeRtclib;
```
  