import { Settings } from '@/types/types';

export class LocalStorageManager {
  static storeAppSettings(settings: Settings) {
    localStorage.setItem('settings', JSON.stringify(settings));
  }

  static getAppSettings() {
    return localStorage.getItem('settings');
  }
}
