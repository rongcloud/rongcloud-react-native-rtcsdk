
# rc-react-native-call

## Getting started

`$ npm install rc-react-native-call --save`

### Mostly automatic installation

`$ react-native link rc-react-native-call`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `rc-react-native-call` and add `RCReactNativeCall.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRCReactNativeCall.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import cn.rongcloud.rn.call.RCReactNativeCallPackage;` to the imports at the top of the file
  - Add `new RCReactNativeCallPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':rc-react-native-call'
  	project(':rc-react-native-call').projectDir = new File(rootProject.projectDir, 	'../node_modules/rc-react-native-call/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':rc-react-native-call')
  	```


## Usage
```javascript
import RCReactNativeCall from 'rc-react-native-call';

// TODO: What to do with the module?
RCReactNativeCall;
```
  