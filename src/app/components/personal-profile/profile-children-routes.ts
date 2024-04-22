import { PersonalInformationComponent } from "./personal-information/personal-information.component";

export const profileChildrenRoutes: any[] = [
  { path: '', redirectTo: 'Information', pathMatch: 'full' },
  {
    path: 'Information',
    component: PersonalInformationComponent,
    pathMatch: 'full'
  },
  // { path: '**', component: ErrorsComponent }
];
