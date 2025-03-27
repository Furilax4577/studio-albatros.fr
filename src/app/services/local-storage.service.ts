import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  set<T>(key: string, value: T): void {
    if (!this.isBrowser) return;

    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  }

  get<T>(key: string): T | null {
    if (!this.isBrowser) return null;

    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`Erreur de parsing JSON pour la clé "${key}"`, e);
      return null;
    }
  }

  remove(key: string): void {
    if (!this.isBrowser) return;

    localStorage.removeItem(key);
  }

  clear(): void {
    if (!this.isBrowser) return;

    localStorage.clear();
  }
}
