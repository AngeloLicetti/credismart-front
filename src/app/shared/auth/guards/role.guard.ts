import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as PagesStorage from '../storage/pages.storage';

@Injectable()
export class RoleGuard implements CanLoad {
  constructor() { }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    console.log("RoleGuard", route);
    // PagesStorage
    return true;
  }
}
