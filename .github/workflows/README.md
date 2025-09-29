# GitHub Workflows for Muhasabah

This directory contains GitHub Actions workflows for the Muhasabah project.

## build-apk.yml

Automatically builds and releases Android APK files for the Muhasabah app.

### Triggers
- **Push to main branch**: Creates an automatic release with timestamped APK
- **Pull requests**: Builds APK for testing (no release)
- **Manual dispatch**: Can be triggered manually from GitHub Actions tab
- **Release creation**: Attaches APK to manual releases

### What it does
1. Sets up Node.js 20, Java 21, and Android SDK
2. Installs dependencies and builds the web application
3. Uses Capacitor to sync and build Android APK
4. Creates timestamped APK artifacts
5. Automatically creates GitHub releases with download links

### APK Naming Convention
APKs are named: `Muhasabah-YYYY-MM-DD_HH-MM-COMMITHASH.apk`

Example: `Muhasabah-2024-01-15_14-30-abc1234.apk`

### Artifacts
- APKs are stored as GitHub artifacts for 30 days
- Automatic releases are created on main branch pushes
- Release notes include installation instructions

### Requirements
- Repository must have Capacitor configured
- Android platform must be initialized
- Web build must output to `dist/` directory

### Manual Usage
To manually trigger a build:
1. Go to the "Actions" tab in GitHub
2. Select "Build and Release APK"
3. Click "Run workflow"
4. Choose the branch and click "Run workflow"

### Installation Instructions for Users
1. Download the APK from the latest release
2. Enable "Install from unknown sources" on your Android device
3. Install the downloaded APK file
4. Open the Muhasabah app and start your spiritual journey!
