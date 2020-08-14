import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/shared/services/base.service';
import { Configuration } from 'src/app/shared/configuration/app.constants';

@Injectable()
export class MovimientosService extends BaseService {
  public header = new Headers();

  constructor(public _http: Http, public _configuration: Configuration) {
    super();
    this.header = super.obtenerHeaders();
  }
  public getCabecera(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("año", _params.año);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });;
    return this._http.get(this._configuration.Server + "movimientos/obtener-cabecera", options).map((res: Response) => res.json());
  }
  public getGraficos(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("año", _params.año);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });;
    return this._http.get(this._configuration.Server + "movimientos/obtener-grafico", options).map((res: Response) => res.json());
  }
  public getAños() {
    let options = new RequestOptions({
      headers: this.obtenerHeaders()
    });;
    return this._http.get(this._configuration.Server + "seguridad/obtener-años", options).map((res: Response) => res.json());
  }
  getUsuariosInternos() {
    let queryParams: URLSearchParams = new URLSearchParams();
    let opciones = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });
    return this._http.get(this._configuration.Server + "seguridad/obtener-usuarios-interno", opciones).map((res: Response) => res.json()).catch((error => Observable.throw(error.json.error) || "Server error"));
  }
  public getEmpresas(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("razonSocial", _params.razonSocial);
    queryParams.append("idFinanciera", _params.idFinanciera);
    let options = new RequestOptions({
      search: queryParams
    });;
    return this._http.get(this._configuration.Server + "seguridad/obtener-empresas", options).map((res: Response) => res.json());
  }
  public insertarEmpresa(data) {
    return this._http.post(this._configuration.Server + "seguridad/insertar-empresas", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
  public actualizarEmpresa(data) {
    return this._http.put(this._configuration.Server + "seguridad/actualizar-empresas", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
  public getUsuarioFinan(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("idFinanciera", _params.idFinanciera);
    let options = new RequestOptions({
      search: queryParams
    });;
    return this._http.get(this._configuration.Server + "seguridad/obtener-usuario-financiera", options).map((res: Response) => res.json());
  }
  public insertarUsuarioEx(data) {
    return this._http.post(this._configuration.Server + "seguridad/insertar-usuario-empresa", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
  public getRoles() {
    let options = new RequestOptions({
    });;
    return this._http.get(this._configuration.Server + "seguridad/obtener-roles", options).map((res: Response) => res.json());
  }
  public insertarUsuarioInterno(data) {
    return this._http.post(this._configuration.Server + "seguridad/insertar-usuario-interno", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
  public getPersonalUsuario() {
    let queryParams: URLSearchParams = new URLSearchParams();
    let opciones = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });
    return this._http.get(this._configuration.Server + "seguridad/obtener-combo-usuario", opciones).map((res: Response) => res.json()).catch((error => Observable.throw(error.json.error) || "Server error"));
  }
  public eliminarUsuario(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("correo", _params.correo);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });
    return this._http.delete(this._configuration.Server + "seguridad/eliminar-usuario-interno", options).map((res: Response) => res.json());
  }
  public getReporteVencidos(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("idEmpleado", _params.idEmpleado);
    queryParams.append("noSolicitante", _params.noSolicitante);
    queryParams.append("nuDocideSolicitante", _params.nuDocideSolicitante);
    queryParams.append("idTipoPrestamo", _params.idTipoPrestamo);
    queryParams.append("nuPagina", _params.nuPagina);
    queryParams.append("nuRegisMostrar", _params.nuRegisMostrar);
    queryParams.append("tipoFile", _params.tipoFile);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });
    return this._http.get(this._configuration.Server + "movimientos/obtener-prestamos-vencidos-reporte", options).map((res: Response) => res.json());
  }

  public getPastel(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("año", _params.año);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });;
    return this._http.get(this._configuration.Server + "movimientos/obtener-pastel", options).map((res: Response) => res.json());
  }
  public getDepartamentos(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("año", _params.año);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });;
    return this._http.get(this._configuration.Server + "movimientos/obtener-departamento", options).map((res: Response) => res.json());
  }
  public getDistritos(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("año", _params.año);
    queryParams.append("idProvincia", _params.idProvincia);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });;
    return this._http.get(this._configuration.Server + "movimientos/obtener-distrito", options).map((res: Response) => res.json());
  }

  public getPrestamos(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("mes", _params.mes);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });;
    return this._http.get(this._configuration.Server + "movimientos/reporte-prestamos", options).map((res: Response) => res.json());
  }
  public getCobranzas(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("mes", _params.mes);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });;
    return this._http.get(this._configuration.Server + "movimientos/reporte-cobranzas", options).map((res: Response) => res.json());
  }
  public getGastos(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("mes", _params.mes);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });;
    return this._http.get(this._configuration.Server + "movimientos/reporte-gastos", options).map((res: Response) => res.json());
  }
}
