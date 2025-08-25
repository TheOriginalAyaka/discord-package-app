#!/bin/bash

echo "Building dpkg-rs for Android..."
cd dpkg-rs

echo "Building library for aarch64-linux-android..."
cargo ndk --target aarch64-linux-android --platform 21 -- build --release --lib

echo "Generating Kotlin bindings..."
cargo run --features=uniffi/cli --bin uniffi-bindgen generate --library target/aarch64-linux-android/release/libdpkg_rs.so --out-dir generated/kotlin/ --language kotlin

echo "Creating dirs..."
mkdir -p ../modules/dpkg-module/android/src/main/jniLibs/arm64-v8a/

echo "Copying library file..."
cp target/aarch64-linux-android/release/libdpkg_rs.so ../modules/dpkg-module/android/src/main/jniLibs/arm64-v8a/

echo "Copying Kotlin bindings..."
cp -r generated/kotlin/* ../modules/dpkg-module/android/src/main/java/

echo "Build and copy completed successfully!"
