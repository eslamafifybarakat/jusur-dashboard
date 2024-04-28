import { ComingSoonComponent } from './../../shared/components/coming-soon/coming-soon.component';

import { PermissionGuard } from './../../services/authentication/guards/permission.guard';
import { EditClientComponent } from "./clients/edit-client/edit-client.component";
import { clientsChildrenRoutes } from "./clients/clients-children-routes";
import { StatisticsComponent } from "./statistics/statistics.component";
import { ErrorsComponent } from "../errors/errors.component";
import { profileChildrenRoutes } from '../personal-profile/profile-children-routes';

export const dashBoardChildrenRoutes: any[] = [
  { path: '', redirectTo: 'Statistics', pathMatch: 'full' },
  {
    path: 'Clients',
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Client.List',
      title: 'Appointments'
    },
    loadComponent: () =>
      import('./clients/clients.component').then(
        (c) => c.ClientsComponent
      ),
    children: clientsChildrenRoutes
  },
  {
    path: 'Profile',
    loadComponent: () =>
      import('../personal-profile/personal-profile.component').then(
        (c) => c.PersonalProfileComponent
      ),
    children: profileChildrenRoutes
  },
  {
    path: 'Statistics',
    component: StatisticsComponent,
    pathMatch: 'full'
  },
  {
    path: 'Clients/:id',
    component: EditClientComponent,
    pathMatch: 'full'
  },
  {
    path: 'Coming-Soon/:id',
    component: ComingSoonComponent,
    pathMatch: 'full'
  },
  { path: '**', component: ErrorsComponent }
];
