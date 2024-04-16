
import { PermissionGuard } from './../../services/authentication/guards/permission.guard';
import { EditClientComponent } from "./clients/edit-client/edit-client.component";
import { clientsChildrenRoutes } from "./clients/clients-children-routes";
import { StatisticsComponent } from "./statistics/statistics.component";
import { ErrorsComponent } from "../errors/errors.component";

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
    path: 'Statistics',
    component: StatisticsComponent,
    pathMatch: 'full'
  },
  {
    path: 'Clients/:id',
    component: EditClientComponent,
    pathMatch: 'full'
  },
  { path: '**', component: ErrorsComponent }
];
