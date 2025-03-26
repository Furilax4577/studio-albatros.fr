import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ParralaxComponent } from './components/parralax/parralax.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ParralaxComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
