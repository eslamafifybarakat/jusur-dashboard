import { PlaceDetailsComponent } from "./place-details/place-details.component";
import { PlacesListComponent } from "./places-list/places-list.component";
import { ErrorsComponent } from "../errors/errors.component";

export const placesChildrenRoutes: any[] = [
  { path: '', redirectTo: '/places/list', pathMatch: 'full' },
  {
    path: 'list',
    component: PlacesListComponent,
    pathMatch: 'full'
    ,
    // pathMatch: 'prefix',
    // children: [
    //   { path: 'map', component: PlaceDetailsComponent, pathMatch: 'full' }
    // ],
  },
  {
    path: 'details' + "/:slug",
    component: PlaceDetailsComponent,
    pathMatch: 'full'
  },
  { path: '**', component: ErrorsComponent }
];
