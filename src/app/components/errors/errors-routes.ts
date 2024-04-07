import { Error404Component } from "./error404/error404.component";
import { Error500Component } from "./error500/error500.component";
import { ErrorsComponent } from "./errors.component";

export const errorsChildrenRoutes: any[] = [
  { path: '', redirectTo: '/errors/404', pathMatch: 'full' },
  {
    path: '404',
    component: Error404Component,
    pathMatch: 'full'
  },
  {
    path: '500',
    component: Error500Component,
    pathMatch: 'full'
  },
];
