
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions,URLSearchParams } from '@angular/http';
import { BaseService } from 'src/app/shared/services/base.service';
import { Configuration } from 'src/app/shared/configuration/app.constants';


@Injectable()
export class ClientesService extends BaseService{
  public header = new Headers();
  constructor(public _http: Http, public _configuration: Configuration) {
    super();
    this.header = super.obtenerHeaders();
  }

  public getClientes(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.append("nuDocide", _params.nuDocide);
        queryParams.append("noCliente", _params.noCliente);
        queryParams.append("estado", _params.estado);   
        queryParams.append("nuPagina", _params.nuPagina);
        queryParams.append("nuRegisMostrar", _params.nuRegisMostrar);
      let options = new RequestOptions({
        headers: this.obtenerHeaders(),
       search: queryParams
      });
      return this._http.get(this._configuration.Server + "clientes/obtener-cliente", options).map((res: Response) => res.json());
  }

  public getComboCliente(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.append("noCliente", _params.noCliente);
      let options = new RequestOptions({
        headers: this.obtenerHeaders(),
        search: queryParams
      });
    return this._http.get(this._configuration.Server+"clientes/obtener-combo-cliente",options).map((res: Response)=> res.json());
  }

  public eliminarCliente(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.append("idCliente", _params.idCliente);
      let options = new RequestOptions({
        headers: this.obtenerHeaders(),
        search: queryParams
      });

    return this._http.delete(this._configuration.Server+"clientes/eliminar-cliente",options).map((res: Response)=> res.json());
  }

  public insertarCliente(data){
    return this._http.post(this._configuration.Server+"clientes/insertar-cliente", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }

  public actualizarCliente(data){
    return this._http.put(this._configuration.Server+"clientes/actualizar-cliente", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }

  public getComboEmpleado() {
    let options = new RequestOptions({
      headers: this.obtenerHeaders()
    });
    return this._http.get(this._configuration.Server+"empleados/obtener-combo-empleados",options).map((res: Response)=> res.json());
  }

  public getClienteCobranza(_params){
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("idEmpleado", _params.idEmpleado);
    queryParams.append("idTipoPrestamo", _params.idTipoPrestamo);
    queryParams.append("fecha", _params.fecha);
    queryParams.append("nuPagina", _params.nuPagina);
    queryParams.append("nuRegisMostrar", _params.nuRegisMostrar);
  let options = new RequestOptions({
    headers: this.obtenerHeaders(),
   search: queryParams
  });
  return this._http.get(this._configuration.Server + "clientes/obtener-cliente-cobranza", options).map((res: Response) => res.json());
  }

  public getClienteCobranzaReporte(_params){
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("idEmpleado", _params.idEmpleado);
    queryParams.append("idTipoPrestamo", _params.idTipoPrestamo);
    queryParams.append("fecha", _params.fecha);
    queryParams.append("nuPagina", _params.nuPagina);
    queryParams.append("nuRegisMostrar", _params.nuRegisMostrar);
    queryParams.append("tipoFile", _params.tipoFile);
  let options = new RequestOptions({
    headers: this.obtenerHeaders(),
   search: queryParams
  });
  return this._http.get(this._configuration.Server + "clientes/reporte/obtener-cliente-cobranza", options).map((res: Response) => res.json());
  }

  public getClienteId(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.append("idCliente", _params.idCliente);
      let options = new RequestOptions({
        headers: this.obtenerHeaders(),
       search: queryParams
      });
      return this._http.get(this._configuration.Server + "clientes/obtener-cliente-id", options).map((res: Response) => res.json());
  }

  public getPrestamosVencidos(_params){
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("nuDocideSolicitante", _params.nuDocideSolicitante);
    queryParams.append("noSolicitante", _params.noSolicitante);
    queryParams.append("idEmpleado", _params.idEmpleado);
    queryParams.append("idTipoPrestamo", _params.idTipoPrestamo);
    queryParams.append("nuPagina", _params.nuPagina);
    queryParams.append("nuRegisMostrar", _params.nuRegisMostrar);
  let options = new RequestOptions({
    headers: this.obtenerHeaders(),
   search: queryParams
  });
  return this._http.get(this._configuration.Server + "prestamos/obtener-prestamos-vencidos", options).map((res: Response) => res.json());
  }

}
