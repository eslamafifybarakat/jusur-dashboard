import { WelcomeComponent } from "./welcome/welcome.component";
import { ErrorsComponent } from "../errors/errors.component";

export const clientChildrenRoutes: any[] = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  {
    path: '',
    component: WelcomeComponent,
    pathMatch: 'full'
  },
  { path: '**', component: ErrorsComponent }
];
