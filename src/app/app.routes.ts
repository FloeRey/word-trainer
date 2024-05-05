import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'training',
    loadComponent: () =>
      import('./pages/training/training.component').then(
        (m) => m.TrainingComponent
      ),
  },

  {
    path: 'test',
    loadComponent: () =>
      import('./pages/test/test.component').then((m) => m.TestComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
  },
];
