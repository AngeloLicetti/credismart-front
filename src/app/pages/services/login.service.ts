import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions } from "@angular/http";
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Configuration } from "../../shared/configuration/app.constants";
import { BaseService } from '../../shared/services/base.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { getCodUsuario } from '../../shared/auth/storage/cabecera.storage';

@Injectable()
export class LoginService extends BaseService{

  public username : string = 'financiera-frontend';
  public password : string = '123456789';
  public URLOauth: string;
  constructor(public http:HttpClient, public _http:Http, public _configuration:Configuration) { 
    super();
    this.URLOauth='http://oauthtest-env.eba-iahpx5vq.us-east-1.elasticbeanstalk.com/oauth/';
  }
  
   headers = new HttpHeaders().set("Authorization", "Basic " + btoa(this.username + ":" + this.password))
                              .set('Accept', 'application/json')
                              .set("Content-Type", "application/json");

  solicitarToken ( userDAO ){ 
   let url='http://oauthtest-env.eba-iahpx5vq.us-east-1.elasticbeanstalk.com/oauth/token?grant_type=password&username='+userDAO.usuarioID+'&password='+userDAO.contrasena;
    return this.http.post(url,null,{headers : this.headers})
  }

  getFinancieras (){
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("codUsuario", getCodUsuario());
    let opciones = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });    
    return this._http.get(this._configuration.Server+"seguridad/obtener-datos-usuario", opciones).map((res: Response) => res.json()).catch((error => Observable.throw(error.json.error) || "Server error"));
  }
  public insertarUsuarioOauth(data){
    return this._http.post(this.URLOauth+'usuario/registro-externo',data).map((res: Response) => res.json());
  }
  public eliminarUsuarioOauth(data){
    return this._http.post(this.URLOauth+'usuario/eliminar', data).map((res: Response) => res.json());
  }
}
