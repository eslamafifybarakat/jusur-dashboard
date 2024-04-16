import { ClientComponent } from './components/client/client.component';
import { Routes } from '@angular/router';

// Components

// TS Files for child routes
import { dashBoardChildrenRoutes } from './components/dashboard/dashboard-children-routes';
import { authChildrenRoutes } from './components/auth/auth-children-routes';
import { errorsChildrenRoutes } from './components/errors/errors-routes';

//Services
import { AuthGuard } from './services/authentication/guards/auth.guard';
import { clientChildrenRoutes } from './components/client/client-children-routes';


export const appRoutes: Routes = [
  { path: '', redirectTo: 'en/Auth', pathMatch: 'full' },
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
    path: ':lang/Client',
    canActivate: [AuthGuard], // Apply the guard here
    loadComponent: () =>
      import('./components/client/client.component').then(
        (c) => c.ClientComponent
      ),
    children: clientChildrenRoutes
  },
  {
    path: 'Client',
    canActivate: [AuthGuard], // Apply the guard here
    loadComponent: () =>
      import('./components/client/client.component').then(
        (c) => c.ClientComponent
      ),
    children: clientChildrenRoutes
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
