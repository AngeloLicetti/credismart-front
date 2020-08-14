import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as TokenStorage from '../storage/token.storage';
import { getParentsRoutes } from './../../../shared/auth/storage/pages.storage';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute} from '@angular/router';

@Injectable()
export class AuthGuard implements CanLoad {
  constructor(public _router : Router) { }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    console.log("AuthGuard", route);
    // return !!(TokenStorage.getToken());
    let ruta: any;
    ruta = getParentsRoutes();
    ruta = ruta.find(obj => obj['uri'] === route.path);
    if (!ruta) {
      return true;
    }
    if (route.path == ruta.uri) {
      return true;
    } else {
      return false;
    }
  }
}
