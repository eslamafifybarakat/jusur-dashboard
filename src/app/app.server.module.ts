import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { TransferHttpResponseInterceptor } from './core/interceptors/server-state-interceptor.service';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,

  ],
  providers: [
    // Add universal-only providers here
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TransferHttpResponseInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule { }
