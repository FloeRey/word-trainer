import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmSwitchComponent } from '@spartan-ng/ui-switch-helm';

import { StatusService } from '../../services/status.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [HlmLabelDirective, HlmSwitchComponent, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  statusService = inject(StatusService);
  config = this.statusService.config;
  loading = signal(false);

  check(lang: string, e: any) {
    this.loading.set(true);
    this.statusService.updateLanguages(lang, e);
    this.loading.set(false);
  }
}
