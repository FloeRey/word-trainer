import { StatusService } from './../../services/status.service';
import { StorageService } from './../../services/storage.service';
import { Component, inject, signal } from '@angular/core';
import { HlmInputDirective } from '../../../../libs/ui/ui-input-helm/src/lib/hlm-input.directive';
import { HlmButtonDirective } from '../../../../libs/ui/ui-button-helm/src/lib/hlm-button.directive';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HlmInputDirective, HlmButtonDirective, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  statusService = inject(StatusService);
  name?: string;

  async login() {
    if (this.name) {
      await this.statusService.username(this.name);
    }
  }
}
