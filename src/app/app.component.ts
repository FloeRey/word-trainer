import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

import { LoginComponent } from './components/login/login.component';
import { StatusService } from './services/status.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  statusService = inject(StatusService);
  title = 'wordstrainer';
  hasUser = this.statusService.user;
}
