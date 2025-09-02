#!/bin/bash

IOS_VERSION="15.1"

echo "Building dpkg-rs for iOS Simulator..."
cd dpkg-rs

echo "Building library for aarch64-apple-ios-sim..."
IPHONEOS_DEPLOYMENT_TARGET=$IOS_VERSION cargo build --release --target aarch64-apple-ios-sim --lib

echo "Generating Swift bindings..."
cargo run --features=uniffi/cli --bin uniffi-bindgen generate --library target/aarch64-apple-ios-sim/release/libdpkg_rs.dylib --out-dir generated/swift/ --language swift

echo "Creating dirs..."
mkdir -p ../modules/dpkg-module/ios/lib/

echo "Copying library file..."
cp target/aarch64-apple-ios-sim/release/libdpkg_rs.a ../modules/dpkg-module/ios/lib/

echo "Copying Swift bindings..."
cp generated/swift/* ../modules/dpkg-module/ios/lib/

echo "Build and copy completed successfully!"
