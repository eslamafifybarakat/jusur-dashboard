import { Routes } from '@angular/router';

// Components

// TS Files for child routes
import { dashBoardChildrenRoutes } from './components/dashboard/dashboard-children-routes';
import { placesChildrenRoutes } from './components/places/places-children-routes';
import { authChildrenRoutes } from './components/auth/auth-children-routes';
import { errorsChildrenRoutes } from './components/errors/errors-routes';

//Services
import { AuthGuard } from './services/authentication/guards/auth.guard';


export const appRoutes: Routes = [
  { path: '', redirectTo: 'en/Auth', pathMatch: 'full' },

  {
    path: 'places',
    loadComponent: () =>
      import('./components/places/places.component').then(
        (c) => c.PlacesComponent
      ),
    children: placesChildrenRoutes
  },
  {
    path: ':lang/places',
    loadComponent: () =>
      import('./components/places/places.component').then(
        (c) => c.PlacesComponent
      ),
    children: placesChildrenRoutes
  },
  {
    path: 'Auth',
    canActivate: [AuthGuard], // Apply the guard here
    loadComponent: () =>
      import('./components/auth/auth.component').then(
        (c) => c.AuthComponent
      ),
    children: authChildrenRoutes
  },
  {
    path: ':lang/Auth',
    canActivate: [AuthGuard], // Apply the guard here
    loadComponent: () =>
      import('./components/auth/auth.component').then(
        (c) => c.AuthComponent
      ),
    children: authChildrenRoutes
  },
  {
    path: 'Dashboard',
    canActivate: [AuthGuard], // Apply the guard here
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    children: dashBoardChildrenRoutes
  },
  {
    path: ':lang/Dashboard',
    canActivate: [AuthGuard], // Apply the guard here
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
    children: dashBoardChildrenRoutes
  },
  {
    path: 'Dashboard-V2',
    loadComponent: () =>
      import('./components/dashboard-v2/dashboard-v2.component').then(
        (c) => c.DashboardV2Component
      ),
    children: dashBoardChildrenRoutes
  },
  {
    path: ':lang/Dashboard-V2',
    loadComponent: () =>
      import('./components/dashboard-v2/dashboard-v2.component').then(
        (c) => c.DashboardV2Component
      ),
    children: dashBoardChildrenRoutes
  },
  // {
  //   path: ':lang/places',
  //   loadComponent: () => import('./components/places/places.component').then((c) => c.PlacesComponent),
  //   children: placesChildrenRoutes
  //   // canActivate: [LanguageGuard] // Optional: Use a guard to validate the language parameter
  // },
  {
    path: '**', loadComponent: () =>
      import('./components/errors/errors.component').then(
        (c) => c.ErrorsComponent
      ),
    children: errorsChildrenRoutes
  }
];
