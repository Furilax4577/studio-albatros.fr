import { Injectable, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { AppConfig } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket: Socket | null = null;
  private isBrowser: boolean;
  private appConfig!: AppConfig;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private ngZone: NgZone,
    private configService: ConfigService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.appConfig = this.configService.getConfig();
  }

  connect(clientId: string) {
    if (!this.isBrowser || this.socket?.connected) return;

    this.ngZone.runOutsideAngular(() => {
      this.socket = io(this.appConfig.websocketUrl, {
        query: { clientId },
      });

      this.socket.emit('join-room', clientId);
    });
  }

  sendMessage(message: string, clientId: string) {
    if (this.isBrowser && this.socket?.connected) {
      this.socket.emit('user-message', { clientId, message });
    }
  }

  onResponse(): Observable<string> {
    return new Observable((observer) => {
      if (this.isBrowser && this.socket) {
        this.socket.on('chat-response', (data) => observer.next(data.message));
      }
    });
  }

  onError(): Observable<string> {
    return new Observable((observer) => {
      if (this.isBrowser && this.socket) {
        this.socket.on('chat-error', (data) => observer.next(data.error));
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
