import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { BaseService } from '../shared/services/base.service';
import { Configuration } from '../shared/configuration/app.constants';

@Injectable()
export class PrestamosService extends BaseService{
  public header = new Headers();
  constructor(public _http: Http, public _configuration: Configuration) {
    super();
    this.header = super.obtenerHeaders();
  }
  public getPrestamos(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.append("nuDocideSolicitante", _params.nuDocideSolicitante);
        queryParams.append("noSolicitante", _params.noSolicitante); 
        queryParams.append("mes", _params.mes); 
        queryParams.append("idTipoPrestamo", _params.idTipoPrestamo); 
        queryParams.append("nuPagina", _params.nuPagina);
        queryParams.append("nuRegisMostrar", _params.nuRegisMostrar);
      let options = new RequestOptions({
        headers: this.obtenerHeaders(),
       search: queryParams
      });
      return this._http.get(this._configuration.Server + "prestamos/obtener-prestamo", options).map((res: Response) => res.json());
  }
  public verPrestamo(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.append("idPrestamo", _params.idPrestamo);
      let options = new RequestOptions({
        headers: this.obtenerHeaders(),
       search: queryParams
      });
      return this._http.get(this._configuration.Server + "prestamos/ver-prestamo", options).map((res: Response) => res.json());
  }
  public getProforma(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.append("feInicio", _params.feInicio);
        queryParams.append("monto", _params.monto); 
        queryParams.append("interes", _params.interes);
        queryParams.append("nuCuotas", _params.nuCuotas);
        queryParams.append("idTipoPrestamo", _params.idTipoPrestamo);
      let options = new RequestOptions({
        headers: this.obtenerHeaders(),
       search: queryParams
      });
      return this._http.get(this._configuration.Server + "prestamos/obtener-proforma", options).map((res: Response) => res.json());
  }
  public imprimeProforma(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.append("feInicio", _params.feInicio);
        queryParams.append("monto", _params.monto); 
        queryParams.append("interes", _params.interes);
        queryParams.append("nuCuotas", _params.nuCuotas);
        queryParams.append("idTipoPrestamo", _params.idTipoPrestamo);
      let options = new RequestOptions({
        headers: this.obtenerHeaders(),
       search: queryParams
      });
      return this._http.get(this._configuration.Server + "prestamos/obtener-impresion-proforma", options).map((res: Response) => res.json());
  }
  public insertarPrestamo(data){
    return this._http.post(this._configuration.Server+"prestamos/insertar-prestamo", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
  public actualizarPrestamo(data){
    return this._http.put(this._configuration.Server+"prestamos/actualizar-prestamo", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
  public cancelarPrestamo(data){
    return this._http.put(this._configuration.Server+"prestamos/cancelar-prestamo", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
  public getHistorialPrestamos(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.append("nuDocideSolicitante", _params.nuDocideSolicitante);
        queryParams.append("mes", _params.mes); 
        queryParams.append("nuPagina", _params.nuPagina);
        queryParams.append("nuRegisMostrar", _params.nuRegisMostrar);
      let options = new RequestOptions({
        headers: this.obtenerHeaders(),
       search: queryParams
      });
      return this._http.get(this._configuration.Server + "prestamos/obtener-historial-prestamo", options).map((res: Response) => res.json());
  }

  public obtenerMeses() {
    return this._http.get('./../../../../.assets/data/meses.json')
    .map(result => result.json())
    .catch((error: any) => Observable.throw(error.json().error));
    }

    public getHistorialCliente(_params) {
      let queryParams: URLSearchParams = new URLSearchParams();
          queryParams.append("nuDocideSolicitante", _params.nuDocideSolicitante);
          queryParams.append("nuPagina", _params.nuPagina);
          queryParams.append("nuRegisMostrar", _params.nuRegisMostrar);
        let options = new RequestOptions({
          headers: this.obtenerHeaders(),
         search: queryParams
        });
        return this._http.get(this._configuration.Server + "prestamos/obtener-historial-cliente", options).map((res: Response) => res.json());
    }
}
