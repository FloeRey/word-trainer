import { Component, signal } from '@angular/core';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { HlmSwitchComponent } from '@spartan-ng/ui-switch-helm';
import { config } from '../../../config/config';
import { AvailableLanguages } from '../../types/word';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [HlmLabelDirective, HlmSwitchComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  languages = signal(
    Object.entries(config.languages)
      .filter((res) => res[1])
      .map((res) => res[0] as AvailableLanguages)
  );
}
