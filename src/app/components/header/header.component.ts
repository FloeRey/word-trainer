import { StatusService } from './../../services/status.service';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  HlmTabsComponent,
  HlmTabsContentDirective,
  HlmTabsListComponent,
  HlmTabsTriggerDirective,
} from '@spartan-ng/ui-tabs-helm';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { provideIcons } from '@ng-icons/core';

import { radixGear } from '@ng-icons/radix-icons';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    HlmTabsComponent,
    HlmTabsContentDirective,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
    RouterLink,
    RouterLinkActive,
    HlmIconComponent,
  ],
  providers: [
    provideIcons({
      radixGear,
    }),
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  tabs = [
    {
      name: 'Home',
      url: '',
    },
    {
      name: 'Training',
      url: 'training',
    },
    {
      name: 'Test',
      url: 'test',
    },
    {
      name: 'Settings',
      url: 'settings',
      icon: 'radixGear',
    },
  ];

  isOnTest = signal(false);
  statusService = inject(StatusService);

  constructor() {
    /* Variant with Subscribe */
    this.statusService.$isTestRunning_.pipe(takeUntilDestroyed()).subscribe({
      next: (e: boolean) => {
        this.isOnTest.set(e);
      },
    });
  }
}
