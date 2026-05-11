import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { GardenComponent } from './pages/garden/garden';

export const routes: Routes = [
  { path: '',           component: HomeComponent   },
  { path: 'garden',     component: GardenComponent },
  { path: 'garden/:id', component: GardenComponent },
  { path: '**',         redirectTo: ''             },
];