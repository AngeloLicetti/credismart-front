import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { BaseService } from '../shared/services/base.service';
import { Configuration } from '../shared/configuration/app.constants';

@Injectable()
export class PagosService extends BaseService {
  public header = new Headers();
  constructor(public _http: Http, public _configuration: Configuration) {
    super();
    this.header = super.obtenerHeaders();

  }
  public verPagos(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("idPrestamo", _params.idPrestamo);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });
    return this._http.get(this._configuration.Server + "pago/obtener-pago-detalle", options).map((res: Response) => res.json());
  }
  public verCuotasVen(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("idPrestamo", _params.idPrestamo);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });
    return this._http.get(this._configuration.Server + "pago/select-pago", options).map((res: Response) => res.json());
  }
  public insertarPago(data) {
    return this._http.post(this._configuration.Server + "pago/insertar-pago", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
  public imprimirTarjeta(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("idPrestamo", _params.idPrestamo);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });
    return this._http.get(this._configuration.Server + "pago/obtener-pago-cabecera", options).map((res: Response) => res.json());
  }
  public imprimirRecibo(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("idComprobantePago", _params.idComprobantePago);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });
    return this._http.get(this._configuration.Server + "comprobantePago/obtener-recibo", options).map((res: Response) => res.json());
  }
  public getPagos(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("feDesde", _params.feDesde);
    queryParams.append("feHasta", _params.feHasta);
    queryParams.append("idTipoPrestamo", _params.idTipoPrestamo);
    queryParams.append("idTipoPago", _params.idTipoPago);
    queryParams.append("nuPagina", _params.nuPagina);
    queryParams.append("nuRegisMostrar", _params.nuRegisMostrar);
    queryParams.append("idEmpleado", _params.idEmpleado);

    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });
    return this._http.get(this._configuration.Server + "comprobantePago/obtener-pagos", options).map((res: Response) => res.json());
  }
  public insertarComprobante(data) {
    return this._http.post(this._configuration.Server + "comprobantePago/insertar-comprobante", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
  public prestamoPagado(data) {
    return this._http.put(this._configuration.Server + "pago/prestamo-pagado", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }
}
