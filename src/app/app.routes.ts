import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/pages/home/home.component').then(
        (m) => m.HomeComponent
      ),
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
      import('./pages/training/training.component').then(
        (m) => m.TrainingComponent
      ),
  },
];
