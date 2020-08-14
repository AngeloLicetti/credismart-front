import { Injectable } from '@angular/core';

@Injectable()
export class SesionService {
  public static obtenerElementos() {
    /* Por ahora en duro */
    return {
      seguridad: {
        // codUsuario: 'azupe@gmail.com',
        // ahuerta@gmail.com
        //codUsuario: 'JLeGzes@t-integro.com',
        codUsuario: 'farce@t-integro.com',

        token: 'e56tgh-7uhnk-l0y987-hkjhlg-klukli-j86hu9'
      },
      IPRESS: {
        idIPRESS: 'gONZnF9vN/bocT+JhfnMGw==',
        esPrivada: true
      }
    }
  }
}
