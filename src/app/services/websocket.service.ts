import { Injectable, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { AppConfig } from '../interfaces';
import { LocalStorageService } from './local-storage.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket: Socket | null = null;
  private isBrowser: boolean;
  private appConfig!: AppConfig;
  private readonly STORAGE_KEY = 'clientId';
  private clientId!: string;

  private isBotTypingSubject = new BehaviorSubject<boolean>(false);
  public isBotTyping$ = this.isBotTypingSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private ngZone: NgZone,
    private configService: ConfigService,
    private localStorageService: LocalStorageService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.appConfig = this.configService.getConfig();
    this.clientId = this.loadOrCreateClientId();
  }

  private loadOrCreateClientId(): string {
    let storedId = this.localStorageService.get<string>(this.STORAGE_KEY);
    if (!storedId) {
      storedId = uuidv4();
      this.localStorageService.set(this.STORAGE_KEY, storedId);
    }
    return storedId;
  }

  connect() {
    if (!this.isBrowser || this.socket?.connected) return;

    this.ngZone.runOutsideAngular(() => {
      this.socket = io(this.appConfig.websocketUrl, {
        query: { clientId: this.clientId },
      });

      this.socket.emit('join-room', this.clientId);
    });
  }

  sendMessage(message: string) {
    if (this.isBrowser && this.socket?.connected) {
      this.isBotTypingSubject.next(true);
      this.socket.emit('user-message', {
        clientId: this.clientId,
        message,
      });
    }
  }

  onResponse(): Observable<string> {
    return new Observable((observer) => {
      if (this.isBrowser && this.socket) {
        this.socket.on('chat-response', (data) => {
          observer.next(data.message);
          this.isBotTypingSubject.next(false);
        });
      }
    });
  }

  onError(): Observable<string> {
    return new Observable((observer) => {
      if (this.isBrowser && this.socket) {
        this.socket.on('chat-error', (data) => {
          observer.next(data.error);
          this.isBotTypingSubject.next(false);
        });
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  resetClientId(): void {
    this.localStorageService.remove(this.STORAGE_KEY);
    this.clientId = this.loadOrCreateClientId();
  }
}
