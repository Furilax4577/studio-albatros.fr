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

  message: string = '';
  messages: { source: 'from' | 'to'; message: string }[] = [];
  isBotTyping: boolean = false;

  constructor(
    private websocketService: WebsocketService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.websocketService.connect();

    this.websocketService.isBotTyping$.subscribe((typing) => {
      this.isBotTyping = typing;
      this.changeDetectorRef.detectChanges();
    });

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
