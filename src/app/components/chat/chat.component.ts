import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  message = '';
  messages: { source: 'from' | 'to'; message: string }[] = [];
  clientId = 'demo-client';

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    console.log('ngOnInit', this.constructor.name);
    this.websocketService.connect(this.clientId);

    this.websocketService.onResponse().subscribe((response) => {
      this.messages.push({ source: 'from', message: response });
    });

    this.websocketService.onError().subscribe((error) => {
      this.messages.push({ source: 'from', message: error });
    });
  }

  sendMessage(): void {
    console.log('sendMessage');
    if (this.message.trim()) {
      this.messages.push({ source: 'to', message: this.message });
      this.websocketService.sendMessage(this.message, this.clientId);
      this.message = '';
    }
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy', this.constructor.name);
  }
}
