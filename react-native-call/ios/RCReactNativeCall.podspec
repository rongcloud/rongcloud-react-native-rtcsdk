require "json"

package = JSON.parse(File.read(File.join(__dir__, "..", "package.json")))

Pod::Spec.new do |s|
  s.name         = "RCReactNativeCall"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platform     = :ios, "9.0"
  s.source       = { :git => "https://github.com/author/RCReactNativeCall.git", :tag => "master" }
  
  s.source_files  = "src/**/*.{h,m}"

  s.dependency "React"
  s.dependency "RongCloudIM/IMLibCore", "5.1.2"
  s.dependency "RongCloudRTC/RongCallLib", "5.1.2"
  
end
