import { WelcomeComponent } from "./welcome/welcome.component";
import { ErrorsComponent } from "../errors/errors.component";
import { ClientRecordDetailsComponent } from "./welcome/records/client-record-details/client-record-details.component";

export const clientChildrenRoutes: any[] = [
  { path: '', redirectTo: '/Client/Welcome', pathMatch: 'full' },
  {
    path: 'Welcome',
    component: WelcomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'History-Details/:id',
    component: ClientRecordDetailsComponent,
    pathMatch: 'full'
  },
  { path: '**', component: ErrorsComponent }
];
