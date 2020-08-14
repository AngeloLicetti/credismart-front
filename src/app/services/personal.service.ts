import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { BaseService } from '../shared/services/base.service';
import { Configuration } from '../shared/configuration/app.constants';

@Injectable()
export class PersonalService extends BaseService {
  public header = new Headers();
  constructor(public _http: Http, public _configuration: Configuration) {
    super();
    this.header = super.obtenerHeaders();
  }

  public insertarEmpleados(data) {
    return this._http.post(this._configuration.Server + "empleados/insertar-empleado", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }

  public obtenerAllEmpleados(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("docide", _params.docide);
    queryParams.append("nombre", _params.nombre);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });
    return this._http.get(this._configuration.Server + "empleados/obtener-all-empleados", options).map((res: Response) => res.json());
  }

  public obtenerComboEmpleados() {
    let options = new RequestOptions({
      headers: this.obtenerHeaders()
    });
    return this._http.get(this._configuration.Server + "empleados/obtener-combo-empleados", options).map((res: Response) => res.json());
  }

  public eliminarEmpleados(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("idEmpleado", _params.idEmpleado);
    queryParams.append("opcion", _params.opcion);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });
    return this._http.delete(this._configuration.Server + "empleados/eliminar-empleado", options).map((res: Response) => res.json());
  }

  public actualizarEmpleados(data) {
    return this._http.put(this._configuration.Server + "empleados/actualizar-empleado", data, { headers: this.obtenerHeaders() }).map((res: Response) => res.json());
  }

  public obtenerComboBanco() {
    let options = new RequestOptions({
      headers: this.obtenerHeaders()
    });
    return this._http.get(this._configuration.Server + "banco/obtener-combo-banco", options).map((res: Response) => res.json());
  }
  public obtenerEmpleadosId(_params) {
    let queryParams: URLSearchParams = new URLSearchParams();
    queryParams.append("idEmpleado", _params.idEmpleado);
    let options = new RequestOptions({
      headers: this.obtenerHeaders(),
      search: queryParams
    });
    return this._http.get(this._configuration.Server + "empleados/obtener-empleado-id", options).map((res: Response) => res.json());
  }

}
