import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions,URLSearchParams } from '@angular/http';
import { BaseService } from '../shared/services/base.service';
import { Configuration } from '../shared/configuration/app.constants';
@Injectable()
export class CajaService extends BaseService{
  public header = new Headers();

  constructor(public _http: Http, public _configuration: Configuration) {
    super();
    this.header = super.obtenerHeaders();
   }

   public actualizarCierreAperturaCaja(data){
    return this._http.put(this._configuration.Server+"aperturaCaja/actualizar-cierre-apertura-caja", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }

  public insertarAperturaCaja(data){
    return this._http.post(this._configuration.Server+"aperturaCaja/insertar-apertura-caja", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }

  public actualizarCaja(data){
    return this._http.put(this._configuration.Server+"caja/actualizar-caja", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }

  public insertarCaja(data){
    return this._http.post(this._configuration.Server+"caja/insertar-caja", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }

  public eliminarCaja(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.append("idCaja", _params.idCaja);
      let options = new RequestOptions({
        headers: this.obtenerHeaders(),
        search: queryParams
      });
    return this._http.delete(this._configuration.Server+"caja/eliminar-caja",options).map((res: Response)=> res.json());
  }

  public obtenerComboCaja() {
    let options = new RequestOptions({
      headers: this.obtenerHeaders()
    });
      return this._http.get(this._configuration.Server + "caja/obtener-combo-caja", options).map((res: Response) => res.json());
  }

  public obtenerCajaDescripcion(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.append("estado", _params.estado);
        queryParams.append("nuPagina", _params.nuPagina);
        queryParams.append("nuRegisMostrar", _params.nuRegisMostrar);
      let options = new RequestOptions({
        headers: this.obtenerHeaders(),
       search: queryParams
      });
      return this._http.get(this._configuration.Server + "caja/obtener-caja-descripcion", options).map((res: Response) => res.json());
  }

  public obtenerComboEmpleados() {
    let options = new RequestOptions({
      headers: this.obtenerHeaders()
    });
    return this._http.get(this._configuration.Server+"empleados/obtener-combo-empleados",options).map((res: Response)=> res.json());
  }

  public insertarGastos(data){
    return this._http.post(this._configuration.Server+"caja/insertar-gastos", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }

  public obtenerGastos() {
    let options = new RequestOptions({
      headers: this.obtenerHeaders()
    });
    return this._http.get(this._configuration.Server+"caja/obtener-gastos",options).map((res: Response)=> res.json());
  }
  
  public obtenerMonto(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.append("idAperturaCaja", _params.idAperturaCaja);
      let options = new RequestOptions({
        headers: this.obtenerHeaders(),
       search: queryParams
      });
      return this._http.get(this._configuration.Server + "aperturaCaja/obtener-monto-cierre", options).map((res: Response) => res.json());
  }


  public obtenerMontoCierre(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.append("idAperturaCaja", _params.idAperturaCaja);
      let options = new RequestOptions({
        headers: this.obtenerHeaders(),
       search: queryParams
      });
      return this._http.get(this._configuration.Server + "aperturaCaja/obtener-monto-cierre", options).map((res: Response) => res.json());
  }

  public obtenerPGC(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.append("idAperturaCaja", _params.idAperturaCaja);
        queryParams.append("nuPagina", _params.nuPagina);
        queryParams.append("nuRegisMostrar", _params.nuRegisMostrar);
      let options = new RequestOptions({
        headers: this.obtenerHeaders(),
       search: queryParams
      });
      return this._http.get(this._configuration.Server + "aperturaCaja/obtener-p-g-c", options).map((res: Response) => res.json());
  }

  public obtenerPDFPGC(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.append("idAperturaCaja", _params.idAperturaCaja);
        queryParams.append("nuPagina", _params.nuPagina);
        queryParams.append("nuRegisMostrar", _params.nuRegisMostrar);
      let options = new RequestOptions({
        headers: this.obtenerHeaders(),
       search: queryParams
      });
      return this._http.get(this._configuration.Server + "aperturaCaja/obtener-reporte-p-g-c", options).map((res: Response) => res.json());
  }

  public obtenerReporteCierreCaja(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.append("idAperturaCaja", _params.idAperturaCaja);
      let options = new RequestOptions({
        headers: this.obtenerHeaders(),
       search: queryParams
      });
      return this._http.get(this._configuration.Server + "aperturaCaja/obtener-reporte-cierre", options).map((res: Response) => res.json());
  }

  public obtenerComboCajaEmpleado() {
    let options = new RequestOptions({
      headers: this.obtenerHeaders()
    });
      return this._http.get(this._configuration.Server + "caja/obtener-caja-empleado", options).map((res: Response) => res.json());
  }

}
