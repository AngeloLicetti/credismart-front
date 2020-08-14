import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class FechaService {
  constructor(public _http: Http) { }

  public obtenerMeses() {
    return this._http.get('assets/data/meses.json')
      .map(result => result.json())
      .catch((error: any) => Observable.throw(error.json().error));
  }

  public obtenerAnios() {
    return this._http.get('assets/data/anios.json')
      .map(result => result.json())
      .catch((error: any) => Observable.throw(error.json().error));
  }
}
