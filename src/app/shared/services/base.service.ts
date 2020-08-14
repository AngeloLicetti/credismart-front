import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { SesionService } from "./sesion.service";
import { getIpress, getCodUsuario, getIdUsuario, getIdRol} from "../auth/storage/cabecera.storage";
import { getToken} from "../auth/storage/token.storage";

@Injectable()
export abstract class BaseService {
  protected obtenerHeaders(): Headers {
    let headers = new Headers();
    let sesion = SesionService.obtenerElementos();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('codUsuario', getCodUsuario());
    headers.append('token', getToken());
    headers.append('idFinanciera', getIpress());
    headers.append('idPersonalH', getIdUsuario());
    headers.append('idRol', getIdRol());
    return headers;
  }
}
