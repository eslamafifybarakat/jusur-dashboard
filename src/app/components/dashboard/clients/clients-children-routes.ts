
import { PermissionGuard } from './../../../services/authentication/guards/permission.guard';
import { RecordDetailsComponent } from "../records/record-details/record-details.component";
import { ClientsListComponent } from "./clients-list/clients-list.component";
import { EditClientComponent } from "./edit-client/edit-client.component";
import { ErrorsComponent } from "../../errors/errors.component";


export const clientsChildrenRoutes: any[] = [
  { path: '', redirectTo: 'List', pathMatch: 'full' },
  {
    path: 'List',
    component: ClientsListComponent,
    // canActivate: [PermissionGuard],
    data: {
      permission: 'Pages.Client.List',
      title: 'Appointments'
    },
    pathMatch: 'full'
  },
  {
    path: 'Details/:id',
    component: EditClientComponent,
    pathMatch: 'full'
  },
  {
    path: 'RecordDetails/:id',
    component: RecordDetailsComponent,
    pathMatch: 'full'
  },
  { path: '**', component: ErrorsComponent }
];
