import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule, MarkdownModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  message = '';
  messages: { source: 'from' | 'to'; message: string }[] = [];
  clientId = 'demo-client';

  constructor(
    private websocketService: WebsocketService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit', this.constructor.name);
    this.websocketService.connect(this.clientId);

    this.websocketService.onResponse().subscribe((response) => {
      this.messages.push({ source: 'from', message: response });
      this.changeDetectorRef.detectChanges();
      this.scrollToBottom();
    });

    this.websocketService.onError().subscribe((error) => {
      this.messages.push({ source: 'from', message: error });
      this.changeDetectorRef.detectChanges();
      this.scrollToBottom();
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

  private scrollToBottom(): void {
    setTimeout(() => {
      this.scrollContainer?.nativeElement.scrollTo({
        top: this.scrollContainer.nativeElement.scrollHeight,
        behavior: 'smooth',
      });
    }, 0);
  }
}
