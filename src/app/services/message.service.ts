import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { BaseService } from '../shared/services/base.service';
import { Configuration } from '../shared/configuration/app.constants';

@Injectable()
export class MessageService extends BaseService {
  public header = new Headers();
  constructor(public _http: Http, public _configuration: Configuration) {
    super();
    this.header = super.obtenerHeaders();
  }

  sendMessage(body) {
    return this._http.post('http://ec2-3-85-136-190.compute-1.amazonaws.com:3000/formulario', body);
  }

  sendCobranza(body) {
    return this._http.post('http://ec2-3-85-136-190.compute-1.amazonaws.com:3000/cobranza', body);
  }

  sendPrestamo(body) {
    return this._http.post('http://ec2-3-85-136-190.compute-1.amazonaws.com:3000/prestamos', body);
  }

  sendCrendenciales(body) {
    return this._http.post('http://ec2-3-85-136-190.compute-1.amazonaws.com:3000/credenciales', body);
  }

  sendProforma(body) {
    return this._http.post('http://ec2-3-85-136-190.compute-1.amazonaws.com:3000/solicitud', body);
  }
  

}
