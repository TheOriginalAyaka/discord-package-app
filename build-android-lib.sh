#!/bin/bash

echo "Building dpkg-rs for Android..."
cd dpkg-rs

android_targets=("aarch64-linux-android" "armv7-linux-androideabi" "i686-linux-android" "x86_64-linux-android")
android_abis=("arm64-v8a" "armeabi-v7a" "x86" "x86_64")

for i in "${!android_targets[@]}"; do
    target="${android_targets[$i]}"
    abi="${android_abis[$i]}"

    echo "Building library for $target (ABI: $abi)..."
    cargo ndk --target $target --platform 21 -- build --release --lib

    if [ $? -ne 0 ]; then
        echo "Failed to build for $target"
        continue
    fi

    echo "Creating directory for $abi..."
    mkdir -p ../modules/dpkg-module/android/src/main/jniLibs/$abi/

    echo "Copying library file for $abi..."
    cp target/$target/release/libdpkg_rs.so ../modules/dpkg-module/android/src/main/jniLibs/$abi/
done

echo "Generating Kotlin bindings (using aarch64 build)..."
cargo run --features=uniffi/cli --bin uniffi-bindgen generate --library target/aarch64-linux-android/release/libdpkg_rs.so --out-dir generated/kotlin/ --language kotlin

echo "Copying Kotlin bindings..."
cp -r generated/kotlin/* ../modules/dpkg-module/android/src/main/java/

echo "Build and copy completed successfully for all targets!"