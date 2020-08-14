import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { BaseService } from '../shared/services/base.service';
import { Configuration } from '../shared/configuration/app.constants';


@Injectable()
export class SolicitudesService extends BaseService {
  public header = new Headers();
  constructor(public _http: Http, public _configuration: Configuration) {
    super();
    this.header = super.obtenerHeaders();
  }
  public getSolicitudes(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("nuDocideSolicitante", _params.nuDocideSolicitante);
    queryParams.append("noSolicitante", _params.noSolicitante);
    queryParams.append("estado", _params.estado);
    queryParams.append("nuPagina", _params.nuPagina);
    queryParams.append("nuRegisMostrar", _params.nuRegisMostrar);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });
    return this._http.get(this._configuration.Server + "solicitudPrestamo/obtener-solicitudes", options).map((res: Response) => res.json());
  }
  public getPagare(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("idSolicitudPrestamo", _params.idSolicitudPrestamo);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });
    return this._http.get(this._configuration.Server + "solicitudPrestamo/obtener-pagare", options).map((res: Response) => res.json());
  }
  public getPagareSolo(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("idSolicitudPrestamo", _params.idSolicitudPrestamo);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });
    return this._http.get(this._configuration.Server + "solicitudPrestamo/obtener-pagare-solo", options).map((res: Response) => res.json());
  }
  public eliminarSolicitud(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("idSolicitudPrestamo", _params.idSolicitudPrestamo);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });

    return this._http.delete(this._configuration.Server + "solicitudPrestamo/eliminar-solicitud", options).map((res: Response) => res.json());
  }
  public aprobarSolicitud(data) {
    return this._http.put(this._configuration.Server + "solicitudPrestamo/aprobar-solicitud", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
  public desaprobarSolicitud(data) {
    return this._http.put(this._configuration.Server + "solicitudPrestamo/rechazar-solicitud", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
  public insertarSolicitud(data) {
    return this._http.post(this._configuration.Server + "solicitudPrestamo/insertar-solicitud", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
  public actualizarSolicitud(data) {
    return this._http.put(this._configuration.Server + "solicitudPrestamo/actualizar-solicitud", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
  public getEstadoCivil() {
    let options = new RequestOptions({
      headers: this.obtenerHeaders()
    });
    return this._http.get(this._configuration.Server + "estadoCivil/obtener-estado-civil", options).map((res: Response) => res.json());
  }
  public getSexo() {
    let options = new RequestOptions({
      headers: this.obtenerHeaders()
    });
    return this._http.get(this._configuration.Server + "sexo/obtener-sexo", options).map((res: Response) => res.json());
  }
  public getTiposPrestamos() {
    let options = new RequestOptions({
      headers: this.obtenerHeaders()
    });
    return this._http.get(this._configuration.Server + "solicitudPrestamo/obtener-tipos-prestamos", options).map((res: Response) => res.json());
  }
  public getLugares() {
    let options = new RequestOptions({
      headers: this.obtenerHeaders()
    });
    return this._http.get(this._configuration.Server + "lugar/obtener-lugar", options).map((res: Response) => res.json());
  }
  public getBancos() {
    let options = new RequestOptions({
      headers: this.obtenerHeaders()
    });
    return this._http.get(this._configuration.Server + "banco/obtener-combo-banco", options).map((res: Response) => res.json());
  }
  public getTipoDocumento() {
    let options = new RequestOptions({
      headers: this.obtenerHeaders()
    });
    return this._http.get(this._configuration.Server + "tipoDocumento/obtener-documento", options).map((res: Response) => res.json());
  }
  public getDepartamentos() {
    let options = new RequestOptions({
      headers: this.obtenerHeaders()
    });
    return this._http.get(this._configuration.Server + "tipoDocumento/obtener-departamento", options).map((res: Response) => res.json());
  }
  public getProvincias(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("idDepartamento", _params.idDepartamento);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });
    return this._http.get(this._configuration.Server + "tipoDocumento/obtener-provincia", options).map((res: Response) => res.json());
  }
  public getDistritos(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("idProvincia", _params.idProvincia);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });
    return this._http.get(this._configuration.Server + "tipoDocumento/obtener-distrito", options).map((res: Response) => res.json());
  }
  public getCajas(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("idEmpleado", _params.idEmpleado);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });
    return this._http.get(this._configuration.Server + "caja/obtener-combo-caja", options).map((res: Response) => res.json());
  }
  public insertarBancos(data) {
    return this._http.post(this._configuration.Server + "banco/insertar-banco", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
  public actualizarBanco(data) {
    return this._http.put(this._configuration.Server + "banco/actualizar-banco", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
  public insertarLugar(data) {
    return this._http.post(this._configuration.Server + "lugar/insertar-lugar", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
  public eliminarBanco(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("idBanco", _params.idBanco);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });

    return this._http.delete(this._configuration.Server + "banco/eliminar-banco", options).map((res: Response) => res.json());
  }

  public eliminarLugar(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("idLugar", _params.idLugar);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });
    return this._http.delete(this._configuration.Server + "lugar/eliminar-Lugar", options).map((res: Response) => res.json());
  }
  public actualizarLugar(data) {
    return this._http.put(this._configuration.Server + "lugar/actualizar-lugar", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
  public getSolicitudId(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("idSolicitudPrestamo", _params.idSolicitudPrestamo);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });
    return this._http.get(this._configuration.Server + "solicitudPrestamo/obtener-solicitud-id", options).map((res: Response) => res.json());
  }
  public enviarProforma(data) {
    return this._http.put(this._configuration.Server + "solicitudPrestamo/enviar-proforma", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
  public accionSolicitud(data) {
    return this._http.put(this._configuration.Server + "solicitudPrestamo/accion-solicitud", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
  public updateSolicitud(data) {
    return this._http.put(this._configuration.Server + "solicitudPrestamo/update-solicitud", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
}
