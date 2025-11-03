# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# --- React Native Core ---
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.uimanager.** { *; }
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
}
-dontwarn com.facebook.react.**

# --- Hermes (JS Engine) ---
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.react.hermes.** { *; }
-dontwarn com.facebook.hermes.**

# --- Reanimated ---
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-dontwarn com.swmansion.reanimated.**

# --- VisionCamera ---
-keep class com.mrousavy.camera.** { *; }
-dontwarn com.mrousavy.camera.**

# --- JSI / TurboModules / C++ bridges ---
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.fabric.** { *; }
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.uimanager.** { *; }
-dontwarn com.facebook.react.turbomodule.**
-dontwarn com.facebook.react.fabric.**

# --- Worklets / FrameProcessors ---
-keepclassmembers class * {
    @com.mrousavy.camera.frameprocessor.FrameProcessorPlugin <fields>;
}
-keepclassmembers class * {
    @com.mrousavy.camera.frameprocessor.FrameProcessorPlugin <methods>;
}

# --- Firebase (si utilisé) ---
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

# --- Autres précautions utiles ---
-keepattributes *Annotation*
-keep public class * extends java.lang.Exception