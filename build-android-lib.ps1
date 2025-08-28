Write-Host "Building dpkg-rs for Android..." -ForegroundColor Green
Set-Location dpkg-rs

# only need x86_64 for the emulator for Windows
$target = "x86_64-linux-android"
$abi = "x86_64"

Write-Host "Building library for $target (ABI: $abi)..." -ForegroundColor Yellow
cargo ndk --target $target --platform 21 -- build --release --lib

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to build for $target" -ForegroundColor Red
    exit 1
}

Write-Host "Creating directory for $abi..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "../modules/dpkg-module/android/src/main/jniLibs/$abi/"

Write-Host "Copying library file for $abi..." -ForegroundColor Yellow
Copy-Item "target/$target/release/libdpkg_rs.so" "../modules/dpkg-module/android/src/main/jniLibs/$abi/"

Write-Host "Generating Kotlin bindings..." -ForegroundColor Yellow
cargo run --features=uniffi/cli --bin uniffi-bindgen generate --library "target/$target/release/libdpkg_rs.so" --out-dir "generated/kotlin/" --language kotlin

Write-Host "Copying Kotlin bindings..." -ForegroundColor Yellow
Copy-Item -Recurse -Force "generated/kotlin/*" "../modules/dpkg-module/android/src/main/java/"

Write-Host "Build and copy completed successfully!" -ForegroundColor Green