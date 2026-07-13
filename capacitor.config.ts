import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.makfit.app',
  appName: 'МојФит',
  webDir: 'dist',
  android: {
    // Force WebView to always reload assets from APK, not from cache
    // This ensures the latest build is always served after an update
    webContentsDebuggingEnabled: false,
  },
  server: {
    // Use https scheme to avoid mixed content; also helps with cache busting
    androidScheme: 'https',
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '145514988309-e1qs6ctiubml3b4cepuod5s3oudjqdiq.apps.googleusercontent.com',
      androidClientId: '145514988309-e1qs6ctiubml3b4cepuod5s3oudjqdiq.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
