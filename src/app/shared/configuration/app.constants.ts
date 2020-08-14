import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
  public Server: string = '  http://credismarttest-env.eba-bm5vtbug.us-east-1.elasticbeanstalk.com/';
  // public Server: string = 'http://localhost:9090/sigs-commons-ws/';
  public URL_CLIENTE = this.Server + 'clientes/obtener-cliente';
  public URL_PRESTAMO_HISTORIAL = this.Server + 'prestamos/obtener-historial';
  public URL_PRESTAMOS = this.Server + 'prestamos/obtener-prestamo';
  public URL_COBRANZA= this.Server + 'clientes/obtener-cliente-cobranza';
  public URL_PAGOS= this.Server + 'comprobantePago/obtener-pagos';
  public URL_CAJAS= this.Server + 'caja/obtener-caja-descripcion';
  public URL_SOLICITUDES= this.Server + 'solicitudPrestamo/obtener-solicitudes';
  public URL_GASTOS= this.Server + 'caja/obtener-gastos';
  public URL_PRESTAMOS_VENCIDOS = this.Server + 'prestamos/obtener-prestamos-vencidos';
  public URL_MIS_PRESTAMOS= this.Server + 'clientes/obtener-prestamo-cliente';
  public URL_MIS_PAGOS= this.Server + 'comprobantePago/obtener-pagos-cliente';
  public URL_MIS_SOLICITUDES= this.Server + 'solicitudPrestamo/obtener-solicitudes-cliente';
  constructor() {

  }
}
