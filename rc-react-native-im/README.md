
# rc-react-native-im

## Getting started

`$ npm install rc-react-native-im --save`

### Mostly automatic installation

`$ react-native link rc-react-native-im`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `rc-react-native-im` and add `RCReactNativeIm.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRCReactNativeIm.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import cn.rongcloud.rn.test.RCReactNativeImPackage;` to the imports at the top of the file
  - Add `new RCReactNativeImPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':rc-react-native-im'
  	project(':rc-react-native-im').projectDir = new File(rootProject.projectDir, 	'../node_modules/rc-react-native-im/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':rc-react-native-im')
  	```


## Usage
```javascript
import RCReactNativeIm from 'rc-react-native-im';

// TODO: What to do with the module?
RCReactNativeIm;
```
  