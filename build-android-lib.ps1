Write-Host "Building dpkg-rs for Android..." -ForegroundColor Green
Set-Location dpkg-rs

$android_targets = @("aarch64-linux-android", "armv7-linux-androideabi", "i686-linux-android", "x86_64-linux-android")
$android_abis = @("arm64-v8a", "armeabi-v7a", "x86", "x86_64")

# Check and install missing targets
Write-Host "Checking for required Rust targets..." -ForegroundColor Cyan
foreach ($target in $android_targets) {
    $installed = rustup target list --installed | Select-String $target
    if (-not $installed) {
        Write-Host "Installing missing target: $target" -ForegroundColor Yellow
        rustup target add $target
    }
}

for ($i = 0; $i -lt $android_targets.Length; $i++) {
    $target = $android_targets[$i]
    $abi = $android_abis[$i]

    Write-Host "Building library for $target (ABI: $abi)..." -ForegroundColor Yellow
    cargo ndk --target $target --platform 21 -- build --release --lib

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to build for $target" -ForegroundColor Red
        continue
    }

    Write-Host "Creating directory for $abi..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Force -Path "../modules/dpkg-module/android/src/main/jniLibs/$abi/"

    Write-Host "Copying library file for $abi..." -ForegroundColor Yellow
    Copy-Item "target/$target/release/libdpkg_rs.so" "../modules/dpkg-module/android/src/main/jniLibs/$abi/"
}

Write-Host "Generating Kotlin bindings (using aarch64 build)..." -ForegroundColor Yellow
cargo run --features=uniffi/cli --bin uniffi-bindgen generate --out-dir "generated/kotlin/" --language kotlin "target/aarch64-linux-android/release/libdpkg_rs.so"

Write-Host "Copying Kotlin bindings..." -ForegroundColor Yellow
Copy-Item -Recurse -Force "generated/kotlin/*" "../modules/dpkg-module/android/src/main/java/"

Write-Host "Build and copy completed successfully for all targets!" -ForegroundColor Green