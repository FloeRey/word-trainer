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
    // {
    //   name: 'Settings',
    //   url: 'settings',
    // },
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
