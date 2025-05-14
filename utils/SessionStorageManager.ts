import { DatabaseItem } from '@/types/types';

export class SessionStorageManager {
  static storeDecryptedItem(item: DatabaseItem) {
    if (!item._id) return;
    sessionStorage.setItem(item._id, JSON.stringify(item));
  }

  static getDecryptedItem(itemId?: string) {
    return sessionStorage.getItem(itemId || '');
  }
}
