import { NgModule, Optional, SkipSelf } from '@angular/core';

/*Libreria Http*/
import { HttpModule, Http } from '@angular/http';

//#region shared services

//#endregion

//#region classes
/*ruta principal del servidor*/
import { Configuration } from './configuration/app.constants';
//#endregion

//#region auth
import { AuthenticateHttpService } from './auth/authenticate-http/authenticate-http.service';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';
//#endregion

@NgModule({
  exports: [
    HttpModule,
        
  ],
  providers: [
    { provide: Http, useClass: AuthenticateHttpService },
    Configuration,
    AuthGuard,
    RoleGuard
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
