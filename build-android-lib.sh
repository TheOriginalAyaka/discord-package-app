#!/bin/bash

echo "Building dpkg-rs for Android..."
cd dpkg-rs || exit 1

android_targets=("aarch64-linux-android" "armv7-linux-androideabi" "i686-linux-android" "x86_64-linux-android")
android_abis=("arm64-v8a" "armeabi-v7a" "x86" "x86_64")

requested_abi=$1
built_library=""

for i in "${!android_targets[@]}"; do
    target="${android_targets[$i]}"
    abi="${android_abis[$i]}"

    if [ -n "$requested_abi" ] && [ "$requested_abi" != "$abi" ]; then
            continue
    fi

    echo "Building library for $target (ABI: $abi)..."
    cargo ndk --target "$target" --platform 21 -- build --release --lib

    if [ $? -ne 0 ]; then
        echo "Failed to build for $target"
        exit 1
    fi

    echo "Creating directory for $abi..."
    mkdir -p ../modules/dpkg-module/android/src/main/jniLibs/"$abi"/

    echo "Copying library file for $abi..."
    cp target/"$target"/release/libdpkg_rs.so ../modules/dpkg-module/android/src/main/jniLibs/"$abi"/

    built_library="target/$target/release/libdpkg_rs.so"
done

if [ -z "$built_library" ]; then
    echo "Error: No valid target found or built."
    exit 1
fi

echo "Generating Kotlin bindings (using aarch64 build)..."
cargo run --features=uniffi/cli --bin uniffi-bindgen generate --out-dir generated/kotlin/ --language kotlin "$built_library"

echo "Copying Kotlin bindings..."
cp -r generated/kotlin/* ../modules/dpkg-module/android/src/main/java/

echo "Build and copy completed successfully for all targets!"