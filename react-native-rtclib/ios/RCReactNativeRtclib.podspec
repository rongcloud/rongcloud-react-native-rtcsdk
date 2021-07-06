require "json"

package = JSON.parse(File.read(File.join(__dir__, "..", "package.json")))

Pod::Spec.new do |s|
  s.name         = "rc-react-native-rtclib"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platform     = :ios, "9.0"
  s.source       = { :git => "https://github.com/author/RCReactNativeRtclib.git", :tag => "master" }
  
  s.source_files  = "RCReactNativeRtclib/**/*.{h,m}"

  s.dependency "React"
  #s.dependency "others"

end

  