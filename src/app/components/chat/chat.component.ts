import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';

export interface ChatResponse {
  message: string;
  buttons?: string[];
}

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, MarkdownModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  message: string = '';
  messages: { source: 'from' | 'to'; message: string; buttons?: string[] }[] =
    [];
  isBotTyping: boolean = false;

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    this.websocketService.connect();

    this.websocketService.isBotTyping$.subscribe((typing) => {
      this.isBotTyping = typing;
    });

    this.websocketService.onResponse().subscribe((response: ChatResponse) => {
      this.messages.push({
        source: 'from',
        message: response.message,
        buttons: response.buttons,
      });
      this.scrollToBottom();
    });

    this.websocketService.onError().subscribe((error) => {
      this.messages.push({ source: 'from', message: error });
      this.scrollToBottom();
    });
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.messages.push({ source: 'to', message: this.message });
      this.websocketService.sendMessage(this.message);
      this.message = '';
      this.scrollToBottom();
    }
  }

  ngOnDestroy(): void {}

  private scrollToBottom(): void {
    setTimeout(() => {
      this.scrollContainer?.nativeElement.scrollTo({
        top: this.scrollContainer.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 0);
  }
}
