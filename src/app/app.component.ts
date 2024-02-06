import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  template: `<router-outlet/>`,
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'test-case_1.0';

  constructor() {}

}
