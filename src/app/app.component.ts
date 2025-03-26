import { ApplicationRef, Component } from '@angular/core';
import { ParralaxComponent } from './components/parralax/parralax.component';
import { ChatComponent } from './components/chat/chat.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [ParralaxComponent, RouterModule, ChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private appRef: ApplicationRef) {
    // Debug de appRef.isStable
    // this.appRef.isStable.subscribe((stable) => {
    //   console.log('🧪 Angular isStable =', stable);
    // });
  }
}
