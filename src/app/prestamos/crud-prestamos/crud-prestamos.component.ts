import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { PrestamosService } from '../../services/prestamos.service';
import { getIdUsuario } from 'src/app/shared/auth/storage/cabecera.storage';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { CajaService } from 'src/app/services/caja.service';
import { ToastrService } from 'ngx-toastr';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { Params, ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TarjetaControlComponent } from 'src/app/shared/helpers/tarjeta-control/tarjeta-control.component';

var oComponent: CrudPrestamosComponent;
declare var moment: any;

@Component({
  selector: 'app-crud-prestamos',
  templateUrl: './crud-prestamos.component.html',
  providers: [PrestamosService, CajaService, SolicitudesService, ClientesService]
})
export class CrudPrestamosComponent implements OnInit {

  public jsonPago = [
    {
      "fecha_cuota": null,
      "cuota": null
    },
  ];
  public params = {
    prestamo: {
      comentario: null,
      cuota: null,
      nuCuotas: null,
      dataPago: [],
      direccionGarante: null,
      feInicio: null,
      idCaja: null,
      aperturaCaja: null,
      idCliente: null,
      idLugar: null,
      idPrestamo: null,
      interes: null,
      interes2: null,
      monto: null,
      noGarante: null,
      nuGarante: null,
      noReferencia: null,
      parentesco: null,
      proximoPago: null,
      idEmpleado: Number(getIdUsuario()),
      tipoPrestamo: { idTipoPrestamo: null },
      noCliente: null,
      dniGarante: null
    }
  }
  public titulo;
  public op;
  public montoFinal;
  public showAval: boolean = false;
  public listTiposPrestamos = [];
  public listTClientes = [];
  public listLugares = [];
  public listCajas = [];
  public fecha: Date;
  public disable = false;
  constructor(public _modalDialog: MatDialog,
    public toastr: ToastrService,
    public _router: Router,
    public _prestamo: PrestamosService,
    public activatedRoute: ActivatedRoute,
    public _caja: CajaService,
    public _solicitud: SolicitudesService,
    public _cliente: ClientesService) {
    let actual = new Date();
    actual.setHours(0, 0, 0, 0);
    this.fecha = actual;
  }

  ngOnInit() {
    oComponent = this;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.op = params['op'];
    });
    if (this.op == 0) {
      this.titulo = "Registrar Préstamo"
    }
    else {
      this.titulo = "Modificar Préstamo"
    }
    this.getTiposP();
    this.getCajas();
    this.getLugares();
    this.inicial();
  }

  public i = 0;
  agregarAval() {
    this.i++;
    if (this.i % 2 == 0) {
      this.showAval = false;
    }
    else {
      this.showAval = true;
    }
  }
  getTiposP() {
    this._solicitud.getTiposPrestamos().subscribe(data => {
      if (data.estado == 1) {
        this.listTiposPrestamos = data.listTiposPrestamos;
      } else {
        this.toastr.info(data.mensaje);
      }
      return true;
    },
      error => {
        console.error(error);
        return Observable.throw(error);
      }
    ),
      err => console.error(err),
      () => console.log('Request Complete');
  }
  getLugares() {
    this._solicitud.getLugares().subscribe(data => {
      if (data.estado == 1) {
        this.listLugares = data.lugarList;
      } else {
        this.toastr.info(data.mensaje);
      }
      return true;
    },
      error => {
        console.error(error);
        return Observable.throw(error);
      }
    ),
      err => console.error(err),
      () => console.log('Request Complete');
  }
  getCajas() {
    let params = {
      idEmpleado: null
    }
    this._solicitud.getCajas(params).subscribe(data => {
      if (data.estado == 1) {
        console.log(data.cajaList);
        this.listCajas = data.cajaList;
      } else {
        this.toastr.info(data.mensaje);
      }
      return true;
    },
      error => {
        console.error(error);
        return Observable.throw(error);
      }
    ),
      err => console.error(err),
      () => console.log('Request Complete');
  }
  getClientes() {
    this._cliente.getComboCliente(this.params.prestamo).subscribe(data => {
      if (data.estado == 1) {
        this.listTClientes = data.data;
      } else {
        this.toastr.info(data.mensaje);
      }
      return true;
    },
      error => {
        console.error(error);
        return Observable.throw(error);
      }
    ),
      err => console.error(err),
      () => console.log('Request Complete');
  }
  busqueda(target) {
    if (target.length > 1) {
      this.getClientes();
    }
    else {
      this.listTClientes = [];
    }
  }
  public getMonto() {
    let par = {
      idAperturaCaja: null
    }
    this.listCajas.forEach(element => {
      if (element.idCaja == this.params.prestamo.aperturaCaja) {
        par.idAperturaCaja = element.idAperturaCaja;
      }
    });
    if (par.idAperturaCaja == null) {
      this.params.prestamo.aperturaCaja = null;
      this.params.prestamo.idCaja = null;
      this.toastr.warning("Caja cerrada");
      return;
    }
    else {
      this._caja.obtenerMonto(par)
        .subscribe(data => {
          if (data.estado == 1) {
            this.montoFinal = data.aperturaCajaList[0].montoFinal;
            if (this.montoFinal < this.params.prestamo.monto) {
              this.toastr.warning("No hay dinero suficiente en la caja");
              this.params.prestamo.aperturaCaja = null;
              this.params.prestamo.idCaja = null;

            }
            else {
              this.params.prestamo.idCaja = data.aperturaCajaList[0].idAperturaCaja;
            }
          } else if (data.estado == 0) {
            console.log(data.mensaje, "No tiene Clientes");
          }
          else {
            console.log(data.mensaje);
          }
          return true;
        },
          error => {
            console.error(error);
          },
          () => {
          });
    }

  }
  selectCliente(e) {
    this.params.prestamo.idCliente = e.idCliente;
  }
  calcular(target) {
    if (target.length > 4) {
      if (Number(target) > 20000) {
        this.toastr.info("El monto ingresado es mayor a S/20.000, se debe realizar una solicitud ");
        this.params.prestamo.monto = null;
      }
      if (this.params.prestamo.monto == 20000) {
        this.toastr.info("El monto ingresado es igual a S/20.000, se debe realizar una solicitud ");
        this.params.prestamo.monto = null;
      }
    }
    if (this.params.prestamo.interes == null || this.params.prestamo.monto == null || this.params.prestamo.nuCuotas == null || this.params.prestamo.feInicio == null) {
      this.params.prestamo.cuota = null;
    }
    if (this.params.prestamo.interes != null && this.params.prestamo.monto != null && this.params.prestamo.nuCuotas != null && this.params.prestamo.feInicio != null && target.length > 0) {
      this.nuevo();
    }
  }
  public idTarjetaCliente;
  public fechaPrestamo;
  getPrestamo() {
    let par = {
      idPrestamo: this.op
    }
    this._prestamo.verPrestamo(par).subscribe(data => {
      if (data.estado == 1) {
        this.idTarjetaCliente = data.prestamo.idTarjetaCliente;
        this.params.prestamo.feInicio = data.prestamo.feInicio;
        this.fechaPrestamo = data.prestamo.feInicio;
        this.params.prestamo.aperturaCaja = data.prestamo.idCaja;
        this.params.prestamo.idCliente = data.prestamo.idCliente;
        this.params.prestamo.noCliente = data.prestamo.noCliente;
        this.params.prestamo.idLugar = data.prestamo.idLugar;
        this.params.prestamo.monto = data.prestamo.monto;
        if (data.prestamo.idCaja != null) {
              this.params.prestamo.idCaja = data.prestamo.usMod;
        }
        let aux = 1;
        if (data.prestamo.tipoPrestamo.idTipoPrestamo == 2) {
          aux = Math.round(Number(data.prestamo.nuCuotas) / 4);
        }
        else if (data.prestamo.tipoPrestamo.idTipoPrestamo == 3) {
          aux = Math.round(Number(data.prestamo.nuCuotas) / 2);
        }
        else {
          aux = Math.round(Number(data.prestamo.nuCuotas));
        }
        if (data.prestamo.tipoPrestamo.idTipoPrestamo == 1) {
          this.params.prestamo.interes2 = data.prestamo.interes;
        }
        else {
          this.params.prestamo.interes2 = data.prestamo.interes / aux;
        }
        this.params.prestamo.interes = this.params.prestamo.interes;
        this.params.prestamo.cuota = data.prestamo.cuota;
        this.params.prestamo.comentario = data.prestamo.comentario;
        this.params.prestamo.nuCuotas = data.prestamo.nuCuotas;
        this.params.prestamo.noReferencia = data.prestamo.noReferencia;
        this.params.prestamo.tipoPrestamo.idTipoPrestamo = data.prestamo.tipoPrestamo.idTipoPrestamo;
        this.nuevo();
        this.jsonPago = [];
        this.disable = true;
        if (data.prestamo.noGarante != null) {
          this.showAval = true;
          this.params.prestamo.noGarante = data.prestamo.noGarante;
          this.params.prestamo.direccionGarante = data.prestamo.direccionGarante;
          this.params.prestamo.nuGarante = data.prestamo.nuGarante;
          this.params.prestamo.parentesco = data.prestamo.parentesco;
          this.params.prestamo.dniGarante = data.prestamo.dniGarante;
        }
      } else {
        this.toastr.info(data.mensaje);
      }
      return true;
    },
      error => {
        console.error(error);
        return Observable.throw(error);
      }
    ),
      err => console.error(err),
      () => console.log('Request Complete');
  }
  public inicial() {
    if (this.op > 0) {
      this.getPrestamo();
      this.listPagos = null;
      this.jsonPago = [];
    }
  }

  tarjeta(e) {
    const dialogRef = this._modalDialog.open(TarjetaControlComponent, {
      autoFocus: false,
      maxWidth: '86%',
      maxHeight: '95%',
      height: '95%',
      disableClose: true,
    });
    dialogRef.componentInstance.e = e;
    dialogRef.componentInstance.idPrestamo = this.op;
    dialogRef.componentInstance.idTarjetaCliente = this.idTarjetaCliente;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  // cancelar(e) {
  //   this.params.prestamo.idPrestamo = this.e.idPrestamo;
  //   const dialogRef = this._modalDialog.open(ModalConfirmacionComponent, {
  //     autoFocus: false,
  //     disableClose: true,
  //     // width: '75vw'
  //   });
  //   dialogRef.componentInstance.mensajeConfirmacion = '¿Desea cancelar el préstamo de ' + e.noCliente + ' ?';
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result == 1) {
  //       this._prestamo.cancelarPrestamo(this.params).subscribe(data => {
  //         if (data.estado == 1) {
  //           this.toastr.success("Se canceló el préstamo");
  //           this.regresar();

  //         } else {
  //         }
  //         return true;
  //       },
  //         error => {
  //           console.error(error);
  //           return Observable.throw(error);
  //         }
  //       ),
  //         err => console.error(err),
  //         () => console.log('Request Complete');
  //     }
  //   });
  // }
  public listPagos = [];
  registrar() {
    if (this.params.prestamo.feInicio < this.fecha) {
      this.toastr.info("Fecha de Inicio inválida");
      return;
    }
    if (this.montoFinal < this.params.prestamo.monto) {
      this.toastr.warning("No hay dinero suficiente en la caja");
      return;
    }
    this.params.prestamo.dataPago = this.jsonPago;
    console.log(this.params.prestamo);

    this._prestamo.insertarPrestamo(this.params).subscribe(data => {
      if (data.estado == 1) {
        if (data.confirmacion.id > 0) {
          this.toastr.success("Se registró el préstamo", "Exitoso");
          this.goPrestamos();
        } else {
          this.toastr.info(data.confirmacion.mensaje);
        }
      }

      return true;
    },
      error => {
        console.error(error);
        return Observable.throw(error);
      }
    ),
      err => console.error(err),
      () => console.log('Request Complete');

  }
  goPrestamos() {
    let _params: NavigationExtras = {
      queryParams: {
        noSolicitante: this.params.prestamo.noCliente,
      }
    }
    this._router.navigate(['/prestamos/listado'], _params);
  }
  actualizar() {
    if (this.fechaPrestamo != this.params.prestamo.feInicio) {
      if (this.params.prestamo.feInicio < this.fecha) {
        this.toastr.info("Fecha de Inicio inválida");
        return;
      }
    }
    this.params.prestamo.idPrestamo = this.op;
    this.params.prestamo.dataPago = this.jsonPago;
    this._prestamo.actualizarPrestamo(this.params).subscribe(data => {
      if (data.estado == 1) {
        if (data.confirmacion.id > 0) {
          this.toastr.success("Se modificó el préstamo", "Exitoso");
          this.goPrestamos();
        } else {
          this.toastr.info(data.confirmacion.mensaje);
        }
      }

      return true;
    },
      error => {
        console.error(error);
        return Observable.throw(error);
      }
    ),
      err => console.error(err),
      () => console.log('Request Complete');

  }
  fechaActual() {
    if (this.params.prestamo.feInicio < this.fecha) {
      this.params.prestamo.feInicio = null;
      this.toastr.info("Fecha de Inicio inválida");
      this.params.prestamo.proximoPago = null;
      return;
    }
    else {
      this.nuevo();
    }
  }
  nuevo() {
    let aux;
    if (this.params.prestamo.tipoPrestamo.idTipoPrestamo == 1) {
      aux = Math.round(this.params.prestamo.nuCuotas / 30);
      this.params.prestamo.interes = this.params.prestamo.interes2 * aux;
    }
    else if (this.params.prestamo.tipoPrestamo.idTipoPrestamo == 2) {
      aux = Math.round(this.params.prestamo.nuCuotas / 4);
      this.params.prestamo.interes = this.params.prestamo.interes2 * aux;
    }
    else if (this.params.prestamo.tipoPrestamo.idTipoPrestamo == 3) {
      aux = Math.round(this.params.prestamo.nuCuotas / 2);
      this.params.prestamo.interes = this.params.prestamo.interes2 * aux;
    }
    else {
      aux = Math.round(this.params.prestamo.nuCuotas / 1);
      this.params.prestamo.interes = this.params.prestamo.interes2 * aux;
    }
    if (this.params.prestamo.feInicio == null) {
      return;
    }
    this.listPagos = null;
    this.jsonPago = [];
    let param;
    let arreglo = {
      nuCuotas: this.params.prestamo.nuCuotas,
      feInicio: moment(this.params.prestamo.feInicio).format("YYYY-MM-DD"),
      interes: this.params.prestamo.interes,
      monto: this.params.prestamo.monto,
      idTipoPrestamo: this.params.prestamo.tipoPrestamo.idTipoPrestamo
    }
    if (this.params.prestamo.feInicio == null) {
      return;
    }
    else {
      if (this.op == 0 && this.params.prestamo.feInicio < this.fecha) {
        this.toastr.info("Fecha de Inicio inválida");
        this.params.prestamo.feInicio = null;
        return;
      }
    }
    this._prestamo.getProforma(arreglo)
      .subscribe(data => {
        this.params.prestamo.nuCuotas
        if (data.estado == 1) {
          if (data.pagosList.length == 0) {
            this.toastr.info('Error');
          } else {
            this.listPagos = data.pagosList;
            this.params.prestamo.proximoPago = moment(this.listPagos[0].fecha_cuota).format("DD-MM-YYYY");
            this.params.prestamo.cuota = this.listPagos[0].cuota;
            for (let index = 0; index < this.listPagos.length; index++) {
              param = { fecha_cuota: this.listPagos[index].fecha_cuota, cuota: this.listPagos[index].cuota };
              this.jsonPago.push(param);
            }
          }
        } else if (data.estado == 0) {
          console.log(data.mensaje, "Error");
        }
        else {
          console.log(data.mensaje);
        }
        return true;
      },
        error => {
          console.error(error);
        },
        () => {
        });
  }
  public isInvalid(_ngForm: any): boolean {
    return isInvalid(_ngForm);
  }
  public setInputPattern(_event: any, _pattern: any): void {
    setInputPattern(_event, _pattern);
  }
  public setValidatorPattern(_pattern: string, _quantifier: any,
    _exactStart?: boolean, _exactEnd?: boolean, _regexFlags?: string): RegExp {

    return setValidatorPattern(_pattern, _quantifier,
      _exactStart, _exactEnd, _regexFlags);
  }
  public setQuantifier(_quantifier1?: null | number | string, _quantifier2?: null | number): {} {
    return setQuantifier(_quantifier1, _quantifier2);
  }

}
