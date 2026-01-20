#!/bin/bash

IOS_VERSION="15.1"

echo "Building dpkg-rs for iOS..."
cd dpkg-rs || exit 1

echo "Building library for aarch64-apple-ios..."
IPHONEOS_DEPLOYMENT_TARGET=$IOS_VERSION cargo build --release --target aarch64-apple-ios --lib

echo "Generating Swift bindings..."
cargo run --features=uniffi/cli --bin uniffi-bindgen generate --out-dir generated/swift/ --language swift target/aarch64-apple-ios/release/libdpkg_rs.dylib

echo "Creating dirs..."
mkdir -p ../modules/dpkg-module/ios/lib/

echo "Copying library file..."
cp target/aarch64-apple-ios/release/libdpkg_rs.a ../modules/dpkg-module/ios/lib/

echo "Copying Swift bindings..."
cp generated/swift/* ../modules/dpkg-module/ios/lib/

echo "Build and copy completed successfully!"
