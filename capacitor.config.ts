import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nexavo.pos',
  appName: 'Nexavo POS',
  webDir: 'dist',
  server: {
    url: 'https://foodcourtnotify.vercel.app',
    cleartext: false,
  },
  android: {
    webContentsDebuggingEnabled: false,
  },
};

export default config;
