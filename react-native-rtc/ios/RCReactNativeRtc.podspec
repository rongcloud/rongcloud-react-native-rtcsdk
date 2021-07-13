require "json"

package = JSON.parse(File.read(File.join(__dir__, "..", "package.json")))

Pod::Spec.new do |s|
  s.name         = "RCReactNativeRtc"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platform     = :ios, "9.0"
  s.source       = { :git => "https://github.com/author/RCReactNativeRtc.git", :tag => "master" }
  
  s.source_files  = "src/**/*.{h,m}"

  s.vendored_frameworks = 'Frameworks/*.framework'
  s.frameworks = "AssetsLibrary","VideoToolbox", "GLKit", "MapKit", "ImageIO", "CoreLocation", "SystemConfiguration", "QuartzCore", "OpenGLES", "CoreVideo", "CoreTelephony", "CoreMedia", "CoreAudio", "CFNetwork", "AudioToolbox", "AVFoundation", "UIKit", "CoreGraphics"
  s.libraries = "c++","z","sqlite3","bz2"

  s.dependency "React"
  s.dependency 'RongCloudIM/IMLib', '5.1.3.1'
  s.dependency 'RongCloudRTC/RongRTCLib', '5.1.4'

end

  
