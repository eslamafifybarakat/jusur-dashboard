import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { appRoutes } from "./app.routes";

const routes: Routes = appRoutes;

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      scrollPositionRestoration: 'top',
      enableTracing: false,
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
