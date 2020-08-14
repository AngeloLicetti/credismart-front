import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from '../../services/solicitudes.service';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { getIdUsuario } from 'src/app/shared/auth/storage/cabecera.storage';
import { PrestamosService } from 'src/app/services/prestamos.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { ToastrService } from 'ngx-toastr';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { ActivatedRoute, Router, Params, NavigationExtras } from '@angular/router';
import { AmortizacionComponent } from 'src/app/shared/helpers/amortizacion/amortizacion.component';

var oComponent: CrudSolicitudComponent;
import swal from 'sweetalert2';
import { ModalAceptarComponent } from './modal-aceptar/modal-aceptar.component';

@Component({
  selector: 'app-crud-solicitud',
  templateUrl: './crud-solicitud.component.html',
  providers: [ClientesService, SolicitudesService, PrestamosService]
})
export class CrudSolicitudComponent implements OnInit {
  public prestamosList = [];
  public op;
  public maxfechRN: Date = new Date();
  public fecha: String;
  public params = {
    solicitud: {
      comentario: null,
      cuota: null,
      feNacimiento: null,
      feVencimiento: null,
      idSolicitudPrestamo: null,
      ingresos: null,
      interes: null,
      interes2: null,
      monto: null,
      noApellidoSolicitante: null,
      noDireccion: null,
      noOcupacion: null,
      noReferencia: null,
      noSolicitante: null,
      nuCelular: null,
      nuDocideSolicitante: '',
      nuCuota: null,
      nuHijos: null,
      nuReferencia: null,
      nuTelefono: null,
      opVivienda: null,
      idProvincia: null,
      idDepartamento: null,
      idDistrito: null,
      sexo: { idSexo: null },
      empleado: { idEmpleado: null },
      estadoCivil: { idEstadoCivil: null },
      tipoDoc: { idTipoDocumento: null },
      tipoPrestamo: { idTipoPrestamo: null },
      feInicio: null,
      dataPago: [],
      idCliente: null,
      nuCuotas: null,
      idTipoPrestamo: null,
      opcion: null
    }
  }
  public listPagos = [];

  public showAval = 0;
  public estadoList = [];
  public titulo;
  public listTiposPrestamos = [];
  constructor(public _modalDialog: MatDialog,
    public toastr: ToastrService,
    public _router: Router,
    public activatedRoute: ActivatedRoute,
    public _solicitud: SolicitudesService,
    public _cliente: ClientesService,
    public _pres: PrestamosService,) {

  }

  ngOnInit() {
    oComponent = this;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.op = params['op'];
    });
    let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    this.fecha = ((this.maxfechRN).toLocaleDateString('zh-Hans-CN', options)).split('/').join('-');
    this.getTiposP();
    this.getCliente();
    this.inicial();
  }

  public i = 0;
  agregarAval() {
    this.i++;
    if (this.i % 2 == 0) {
      this.showAval = 0;
    }
    else {
      this.showAval = 1;
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
  public total;
  public listSolicitud;
  public inicial() {
    if (this.op == 0) {
      this.titulo = "Registrar Solicitud";
    }
    else {
      this.titulo = "Detalle Solicitud";
      let param = {
        idSolicitudPrestamo: this.op
      }
      this._solicitud.getSolicitudId(param).subscribe(data => {
        if (data.estado == 1) {
          this.listSolicitud = data.data[0];
          this.params.solicitud.idSolicitudPrestamo = this.op;
          this.params.solicitud.idCliente = this.listSolicitud.opVivienda;
          this.params.solicitud.monto = this.listSolicitud.monto;
          if (this.listSolicitud.interes != null) {
            this.params.solicitud.interes = this.listSolicitud.interes;
            if (this.listSolicitud.tipoPrestamo.idTipoPrestamo == 1) {
              this.params.solicitud.interes2 = this.listSolicitud.interes;
            }
            else {
              this.params.solicitud.interes2 = Math.round(this.listSolicitud.interes / this.listSolicitud.nuCuota);
            }
            this.params.solicitud.cuota = this.listSolicitud.cuota;
          }
          this.params.solicitud.comentario = this.listSolicitud.comentario;
          this.params.solicitud.nuCuota = this.listSolicitud.nuCuota;
          this.params.solicitud.feInicio = this.listSolicitud.feInicio;
          this.params.solicitud.tipoPrestamo.idTipoPrestamo = this.listSolicitud.tipoPrestamo.idTipoPrestamo;
          if (this.listSolicitud.noReferencia != null) {
            this.showAval = 1;
            this.params.solicitud.noReferencia = this.listSolicitud.noReferencia;
            this.params.solicitud.nuReferencia = this.listSolicitud.nuReferencia;
          }
          this.calcular(this.listSolicitud);
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
  }
  public clienteList;
  getCliente() {
    let par = {
      idCliente: Number(getIdUsuario())
    }
    this._cliente.getClienteId(par).subscribe(data => {
      if (data.estado == 1) {
        this.clienteList = data.data;
        this.params.solicitud.idCliente = this.clienteList[0].idCliente;
        this.params.solicitud.tipoDoc.idTipoDocumento = this.clienteList[0].idTipoDocide;
        if (this.params.solicitud.tipoDoc.idTipoDocumento != 3) {
          this.params.solicitud.feNacimiento = this.clienteList[0].feNacimiento;
          this.params.solicitud.estadoCivil.idEstadoCivil = this.clienteList[0].estadoCivil.idEstadoCivil;
          this.params.solicitud.sexo.idSexo = this.clienteList[0].sexo.idSexo;
        }
        this.params.solicitud.noSolicitante = this.clienteList[0].noCliente;
        this.params.solicitud.nuDocideSolicitante = this.clienteList[0].nuDocide;
        this.params.solicitud.noDireccion = this.clienteList[0].noDireccion;
        this.params.solicitud.noOcupacion = this.clienteList[0].noOcupacion;
        this.params.solicitud.nuCelular = this.clienteList[0].nuCelular;
        this.params.solicitud.nuTelefono = this.clienteList[0].noEmail;
        this.params.solicitud.idDepartamento = this.clienteList[0].idDepartamento;
        this.params.solicitud.idProvincia = this.clienteList[0].idProvincia;
        this.params.solicitud.idDistrito = this.clienteList[0].idDistrito;

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
  public calcular(e) {
    this.params.solicitud.nuCuotas = e.nuCuota;
    this.params.solicitud.idTipoPrestamo = e.tipoPrestamo.idTipoPrestamo;
    this.listPagos = [];
    this._pres.getProforma(this.params.solicitud)
      .subscribe(data => {
        if (data.estado == 1) {
          if (data.pagosList.length == 0) {
            this.toastr.info('Error');
          } else {
            this.listPagos = data.pagosList;
            this.total = Number(this.listPagos[0].cuota * e.nuCuota);
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
  desaprobarSolicitud() {
    swal({
      title: '¿Estás seguro?',
      text: 'Desea rechazar la solicitud !',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.params.solicitud.idSolicitudPrestamo = this.op;
        this._solicitud.desaprobarSolicitud(this.params.solicitud).subscribe(data => {
          if (data.estado == 1) {
            this.accionSolicitud();
            swal(
              {
                title: 'Rechazada!',
                text: 'La proforma ha sido rechazada !',
                type: 'success',
                confirmButtonClass: "btn btn-success",
                buttonsStyling: false
              }
            )
            this.goSolicitudes();
          } else {
            this.toastr.error(data.mensaje);
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
    })
  }
  accionSolicitud() {
    this.params.solicitud.opcion = 2;
    this._solicitud.accionSolicitud(this.params.solicitud).subscribe(data => {
      if (data.estado == 1) {
      } else {
        this.toastr.error(data.mensaje);
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

  goSolicitudes() {
    this._router.navigate(['/misolicitudes']);
  }
  fechaActual() {
    if (this.params.solicitud.feInicio < this.fecha) {
      this.toastr.info("Fecha de Inicio inválida");
      this.params.solicitud.feInicio = null;
      return;
    }
  }
  registrar() {
    this._solicitud.insertarSolicitud(this.params).subscribe(data => {
      if (data.estado == 1) {
        if (data.confirmacion.id > 0) {
          this.toastr.success("Se envió la Solicitud", "Exitoso");
          this.goSolicitudes();
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
  confirmar(){
    const dialogRef = this._modalDialog.open(ModalAceptarComponent, {
      autoFocus: false,
      disableClose: true,
    });
    dialogRef.componentInstance.e = this.op;
    dialogRef.afterClosed().subscribe(result => {
      this.goSolicitudes();
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
