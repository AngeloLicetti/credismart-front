import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Configuration } from "../../shared/configuration/app.constants";
import { BaseService } from '../../shared/services/base.service';

@Injectable()
export class MenuPrincipalService extends BaseService {
  public header = new Headers();
  public urlOauth: string;
  constructor(public _http: Http, public _configuration: Configuration) {
    super();
    this.header = super.obtenerHeaders();
    this.urlOauth='http://oauthtest-env.eba-iahpx5vq.us-east-1.elasticbeanstalk.com/oauth/';
  }

  public updatePassword(data) {
    return this._http.put(this.urlOauth + 'usuario/updatePasswordInLogin', data).map((res: Response) => res.json());
  }

  public obtenerUsuario(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.append("idEmpleado", _params.idEmpleado);
      let options = new RequestOptions({
        headers: this.obtenerHeaders(),
       search: queryParams
      });
      return this._http.get(this._configuration.Server + "seguridad/obtener-nombre", options).map((res: Response) => res.json());
  }
  public obtenerUsuarioCliente(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.append("idCliente", _params.idCliente);
      let options = new RequestOptions({
        headers: this.obtenerHeaders(),
       search: queryParams
      });
      return this._http.get(this._configuration.Server + "seguridad/obtener-nombre-cliente", options).map((res: Response) => res.json());
  }

  public getMenuByUser(){
      let options = new RequestOptions({
        headers: this.obtenerHeaders()
      });
      return this._http.get(this._configuration.Server + "seguridad/obtener-menu-usuario", options).map((res: Response) => res.json());
  }

}
