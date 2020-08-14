import { Component, OnInit } from '@angular/core';
import { SolicitudesService } from '../../services/solicitudes.service';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { getIdUsuario, getNombre, getTelefono } from 'src/app/shared/auth/storage/cabecera.storage';
import { PrestamosService } from 'src/app/services/prestamos.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { ToastrService } from 'ngx-toastr';
import { TarjetaControlComponent } from 'src/app/shared/helpers/tarjeta-control/tarjeta-control.component';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { ActivatedRoute, Router, Params, NavigationExtras } from '@angular/router';
import { AmortizacionComponent } from 'src/app/shared/helpers/amortizacion/amortizacion.component';
import swal from 'sweetalert2';
import { MessageService } from 'src/app/services/message.service';
declare var moment: any;

var oComponent: CrudSolicitudComponent;
declare const $: any;

@Component({
  selector: 'app-crud-solicitud',
  templateUrl: './crud-solicitud.component.html',
  providers: [ClientesService, SolicitudesService, PrestamosService, MessageService]
})
export class CrudSolicitudComponent implements OnInit {
  public prestamosList = [];
  public op;
  public cliente;

  public paramsBusqueda = {
    nuDocideSolicitante: null,
    noSolicitante: null,
    idTipoPrestamo: null,
    nuPagina: null,
    nuRegisMostrar: null
  }
  public jsonPago = [
    {
      "fecha_cuota": null,
      "cuota": null
    },
  ];
  public reques = {
    noCliente: null,
    estado: 1,
    nuPagina: 1,
    nuRegisMostrar: 100000
  }
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
      empleado: { idEmpleado: Number(getIdUsuario()) },
      estadoCivil: { idEstadoCivil: null },
      tipoDoc: { idTipoDocumento: null },
      tipoPrestamo: { idTipoPrestamo: null },
      feInicio: null,
      dataPago: [],
      idCliente: null,
      opcion: null,
      detalle: null,
      foto: null,
      idEmpleado: Number(getIdUsuario())
    }
  }
  public dataPagare;
  public showAval = 0;
  public sexoList = [];
  public estadoList = [];
  public titulo;
  public fecha: String;
  public listTiposPrestamos = [];
  constructor(public _modalDialog: MatDialog,
    public toastr: ToastrService,
    public _router: Router,
    public _MessageService: MessageService,
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
    this.dataPagare = [];
    this.getTiposDocumentos();
    this.getDepartamentos();
    this.getEstadoCivil();
    this.getSexo();
    this.getTiposP();
    this.inicial();

  }
  public listTClientes = [];
  public getClientes() {
    this.reques.noCliente = this.params.solicitud.noSolicitante;
    this._cliente.getClientes(this.reques)
      .subscribe(data => {
        if (data.estado == 1) {
          if (data.data.length == 0) {
          } else {
            this.listTClientes = data.data;
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
  busqueda(target) {
    if (target.length > 1) {
      this.getClientes();
    }
    else if (target.length == 0) {
      this.listTClientes = [];
      this.params.solicitud.noSolicitante = null;
      this.params.solicitud.nuDocideSolicitante = '';
      this.params.solicitud.noDireccion = null;
      this.params.solicitud.noOcupacion = null;
      this.params.solicitud.nuCelular = null;
      this.params.solicitud.feNacimiento = null;
      this.params.solicitud.estadoCivil.idEstadoCivil = null;
      this.params.solicitud.sexo.idSexo = null;
      this.params.solicitud.nuTelefono = null;
      this.params.solicitud.idDistrito = null;
      this.params.solicitud.idProvincia = null;
      this.params.solicitud.idDepartamento = null;
      this.params.solicitud.tipoDoc.idTipoDocumento = null;

      this.showHistorial = 0;
    }
    else {
      this.listTClientes = [];
    }
  }
  tarjeta(e) {
    const dialogRef = this._modalDialog.open(TarjetaControlComponent, {
      autoFocus: false,
      maxWidth: '50%',
      width: '58%',
      maxHeight: '95%',
      height: '95%',
      disableClose: true,
    });
    dialogRef.componentInstance.e = e;
    dialogRef.componentInstance.idPrestamo = e.idPrestamo;
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  selectCliente(e) {
    this.params.solicitud.idCliente = e.idCliente;
    this.params.solicitud.tipoDoc.idTipoDocumento = e.idTipoDocide;
    this.params.solicitud.idDepartamento = e.idDepartamento;
    if (this.params.solicitud.tipoDoc.idTipoDocumento != 3) {
      this.params.solicitud.feNacimiento = e.feNacimiento;
      this.params.solicitud.estadoCivil.idEstadoCivil = e.estadoCivil.idEstadoCivil;
      this.params.solicitud.sexo.idSexo = e.sexo.idSexo;
    }
    if (e.idDepartamento != null) {
      this.getProvincias();
      this.params.solicitud.idProvincia = e.idProvincia;
      this.getDistritos();
      this.params.solicitud.idDistrito = e.idDistrito;
    }
    this.params.solicitud.noSolicitante = e.noCliente;
    this.params.solicitud.noApellidoSolicitante = e.noApellido;
    this.params.solicitud.nuDocideSolicitante = e.nuDocide;
    this.params.solicitud.noDireccion = e.noDireccion;
    this.params.solicitud.noOcupacion = e.noOcupacion;
    this.params.solicitud.nuCelular = e.nuCelular;
    this.params.solicitud.nuTelefono = e.noEmail;
    this.getPrestamos();
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
  getSexo() {
    this._solicitud.getSexo().subscribe(data => {
      if (data.estado == 1) {
        this.sexoList = data.sexoList;
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
  getEstadoCivil() {
    this._solicitud.getEstadoCivil().subscribe(data => {
      if (data.estado == 1) {
        this.estadoList = data.estadoCivilList;
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
  public botones;
  public listSolicitud = null;
  public detalle;
  public inicial() {
    if (this.op == 0) {
      this.titulo = "Registrar Solicitud"
    }

    else {
      this.titulo = "Modificar Solicitud"
      let param = {
        idSolicitudPrestamo: this.op
      }
      this._solicitud.getSolicitudId(param).subscribe(data => {
        if (data.estado == 1) {
          this.listSolicitud = data.data[0];
          this.cliente = this.listSolicitud.ingresos;
          this.detalle = this.listSolicitud.tipoDoc.nombreTipoDocumento;
          this.params.solicitud.idCliente = this.listSolicitud.opVivienda;
          this.params.solicitud.idSolicitudPrestamo = this.listSolicitud.idSolicitudPrestamo;
          this.params.solicitud.tipoDoc.idTipoDocumento = this.listSolicitud.tipoDoc.idTipoDocumento;
          this.params.solicitud.nuDocideSolicitante = this.listSolicitud.nuDocideSolicitante;
          if (this.params.solicitud.tipoDoc.idTipoDocumento != 3) {
            this.params.solicitud.feNacimiento = this.listSolicitud.feNacimiento;
            this.params.solicitud.sexo.idSexo = this.listSolicitud.sexo.idSexo;
            this.params.solicitud.estadoCivil.idEstadoCivil = this.listSolicitud.estadoCivil.idEstadoCivil;
          }
          this.params.solicitud.idDepartamento = Number(this.listSolicitud.sexo.descripcionSexo);
          if (this.params.solicitud.idDepartamento != null) {
            this.getProvincias();
            this.params.solicitud.idProvincia = Number(this.listSolicitud.estadoCivil.descripcionEstadoCivil);
            this.getDistritos();
            this.params.solicitud.idDistrito = Number(this.listSolicitud.tipoPrestamo.noTipo);
          }
          this.params.solicitud.noSolicitante = this.listSolicitud.noSolicitante;
          this.params.solicitud.noDireccion = this.listSolicitud.noDireccion;
          this.params.solicitud.noOcupacion = this.listSolicitud.noOcupacion;
          this.params.solicitud.nuCelular = this.listSolicitud.nuCelular;
          this.params.solicitud.nuTelefono = this.listSolicitud.nuTelefono;
          this.params.solicitud.monto = this.listSolicitud.monto;
          this.params.solicitud.interes = this.listSolicitud.interes;
          console.log(this.listSolicitud.dataPagoJson);
          this.botones = this.listSolicitud.interes;
          if (this.listSolicitud.interes != null) {
            let aux = 1;
            if (this.listSolicitud.tipoPrestamo.idTipoPrestamo == 2) {
              aux = Math.round(Number(this.listSolicitud.nuCuota) / 4);
            }
            else if (this.listSolicitud.tipoPrestamo.idTipoPrestamo == 3) {
              aux = Math.round(Number(this.listSolicitud.nuCuota) / 2);
            }
            else {
              aux = Math.round(Number(this.listSolicitud.nuCuota));
            }
            if (this.listSolicitud.tipoPrestamo.idTipoPrestamo == 1) {
              this.params.solicitud.interes2 = this.listSolicitud.interes;
            }
            else {
              this.params.solicitud.interes2 = this.listSolicitud.interes / aux;
            }
            this.params.solicitud.cuota = this.listSolicitud.cuota;
            this.params.solicitud.feVencimiento = this.listSolicitud.feVencimiento;
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
          if (this.listSolicitud.nuDocideSolicitante != null) {
            this.getPrestamos();
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
  }
  proforma(e) {
    const dialogRef = this._modalDialog.open(AmortizacionComponent, {
      autoFocus: false,
      maxWidth: '55%',
      width: '58%',
      maxHeight: '95%',
      height: '95%',
      disableClose: true,
    });
    dialogRef.componentInstance.e = e;
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  formatStringToDate(text) {
    var myDate = text.split('-');
    return new Date(myDate[0], myDate[1] - 1, myDate[2]);
  }
  calcular(target?) {
    let actual = new Date();
    actual.setHours(0, 0, 0, 0);
    if (this.params.solicitud.feInicio != null && this.params.solicitud.feInicio < actual) {
      this.params.solicitud.feInicio = null;
      this.toastr.info("Fecha de Inicio inválida");
      return;
    }
    if (this.params.solicitud.interes2 == null || this.params.solicitud.monto == null || this.params.solicitud.nuCuota == null) {
      this.params.solicitud.cuota = null;
    }
    if (target == null) {
      if (this.params.solicitud.interes2 != null && this.params.solicitud.monto != null && this.params.solicitud.nuCuota != null) {
        this.nuevo();
      }
    }
    else {
      if (this.params.solicitud.interes2 != null && this.params.solicitud.monto != null && this.params.solicitud.nuCuota != null && target.length > 0) {
        this.nuevo();
      }
    }

  }
  public listPagos = [];
  nuevo() {
    let aux;
    if (this.params.solicitud.tipoPrestamo.idTipoPrestamo == 1) {
      aux = Math.round(this.params.solicitud.nuCuota / 30);
      this.params.solicitud.interes = this.params.solicitud.interes2 * aux;
    }
    else if (this.params.solicitud.tipoPrestamo.idTipoPrestamo == 2) {
      aux = Math.round(this.params.solicitud.nuCuota / 4);
      this.params.solicitud.interes = this.params.solicitud.interes2 * aux;
    }
    else if (this.params.solicitud.tipoPrestamo.idTipoPrestamo == 3) {
      aux = Math.round(this.params.solicitud.nuCuota / 2);
      this.params.solicitud.interes = this.params.solicitud.interes2 * aux;
    }
    else {
      aux = Math.round(this.params.solicitud.nuCuota / 1);
      this.params.solicitud.interes = this.params.solicitud.interes2 * aux;
    }
    if (this.params.solicitud.feInicio == null) {
      return;
    }

    let param
    let arreglo = {
      nuCuotas: this.params.solicitud.nuCuota,
      feInicio: moment(this.params.solicitud.feInicio).format("YYYY-MM-DD"),
      interes: this.params.solicitud.interes,
      monto: this.params.solicitud.monto,
      idTipoPrestamo: this.params.solicitud.tipoPrestamo.idTipoPrestamo
    }
    this._pres.getProforma(arreglo)
      .subscribe(data => {
        if (data.estado == 1) {
          if (data.pagosList.length == 0) {
            this.toastr.info('Error');
          } else {
            this.listPagos = null;
            this.jsonPago = [];
            this.listPagos = data.pagosList;
            this.params.solicitud.feVencimiento = moment(this.listPagos[Number(this.params.solicitud.nuCuota) - 1].fecha_cuota).format("DD-MM-YYYY");
            this.params.solicitud.cuota = this.listPagos[0].cuota;
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
  goSolicitudes() {
    let _params: NavigationExtras = {
      queryParams: {
        nuDocideSolicitante: this.params.solicitud.nuDocideSolicitante,
      }
    }
    this._router.navigate(['/solicitudes/listado'], _params);
  }
  registrar() {
    if (this.params.solicitud.feVencimiento <= this.params.solicitud.feInicio) {
      this.toastr.info("Fecha de Vecimiento debe ser mayor a la Fecha de Inicio");
      return;
    }
    this.params.solicitud.dataPago = this.jsonPago;
    this._solicitud.insertarSolicitud(this.params).subscribe(data => {
      if (data.estado == 1) {
        if (data.confirmacion.id > 0) {
          this.toastr.success("Se registró la Solicitud", "Exitoso");
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
  actualizar() {
    this.params.solicitud.dataPago = this.jsonPago;
    if (this.params.solicitud.feVencimiento <= this.params.solicitud.feInicio) {
      this.toastr.info("Fecha de Vecimiento debe ser mayor a la Fecha de Inicio");
      return;
    }
    if (this.params.solicitud.dataPago.length == 0) {
      this.listPagos = null;
      this.jsonPago = [];
      let param
      let arreglo = {
        nuCuotas: this.params.solicitud.nuCuota,
        feInicio: this.params.solicitud.feInicio,
        interes: this.params.solicitud.interes,
        monto: this.params.solicitud.monto,
        idTipoPrestamo: this.params.solicitud.tipoPrestamo.idTipoPrestamo
      }
      this._pres.getProforma(arreglo)
        .subscribe(data => {
          if (data.estado == 1) {
            if (data.pagosList.length == 0) {
              this.toastr.info('Error');
            } else {
              this.listPagos = data.pagosList;
              for (let index = 0; index < this.listPagos.length; index++) {
                param = { fecha_cuota: this.listPagos[index].fecha_cuota, cuota: this.listPagos[index].cuota };
                this.jsonPago.push(param);
              }
              this.params.solicitud.dataPago = this.jsonPago;
              if (this.jsonPago.length != 0) {
                this.update();
              }
              console.log(this.jsonPago);
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

    else {
      this.update();
    }

  }
  update() {
    this._solicitud.actualizarSolicitud(this.params).subscribe(data => {
      if (data.confirmacion.id == 1) {
        this.toastr.success("Se modificó la Solicitud", "Exitoso");
        if (this.params.solicitud.idCliente != null) {
          this.actualizarEstado();
        }
        this.goSolicitudes();
      } else {
        this.toastr.info(data.confirmacion.mensaje);
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
  actualizarEstado() {
    this._solicitud.enviarProforma(this.params.solicitud).subscribe(data => {
      if (data.confirmacion.id == 1) {
        if (this.params.solicitud.nuTelefono != null) {
          this.contactForm();
        }
      } else {
        this.toastr.info(data.confirmacion.mensaje);
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
  contactForm() {
    let solicitud = {
      financiera: getNombre(),
      credismart: 'credismart.peru@gmail.com',
      email: this.params.solicitud.nuTelefono,
      tele: getTelefono()
    }
    this._MessageService.sendProforma(solicitud).subscribe((data) => {
      if (data.status == 200) {
        console.log("Email enviado");
      }
    });
  }
  verHistorial(target) {
    if (target.length == 8) {
      this.getPrestamos();
    }
    else {
      this.showHistorial = 0;
    }
  }
  public showHistorial = 0;
  public getPrestamos() {
    this.paramsBusqueda.nuDocideSolicitante = this.params.solicitud.nuDocideSolicitante;
    this._pres.getHistorialCliente(this.paramsBusqueda)
      .subscribe(data => {
        if (data.estado == 1) {
          if (data.data.length == 0) {
            this.showHistorial = 0;
          } else {
            this.prestamosList = data.data;
            this.prestamosList.forEach(element => {
              let aux = 1;
              if (element.tipoPrestamo.idTipoPrestamo == 2) {
                aux = Math.round(Number(element.nuCuotas) / 4);
              }
              else if (element.tipoPrestamo.idTipoPrestamo == 3) {
                aux = Math.round(Number(element.nuCuotas) / 2);
              }
              else if (element.tipoPrestamo.idTipoPrestamo == 1) {
                aux = 1;
              }
              else {
                aux = Math.round(Number(element.nuCuotas));
              }
              element['interes2'] = element.interes / aux;
            });
            console.log(this.prestamosList);

            this.showHistorial = 1;
          }

        } else if (data.estado == 0) {
          console.log(data.mensaje, "No tiene Préstamos");
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
  goPrestamos() {
    let _params: NavigationExtras = {
      queryParams: {
        nuDocideSolicitante: this.listSolicitud.nuDocideSolicitante
      }
    }
    this._router.navigate(['/prestamos/listado'], _params);
  }
  aprobarSolicitud() {
    swal({
      title: '¿Estás seguro?',
      text: 'Desea aprobar la solicitud de ' + this.listSolicitud.noSolicitante + ' !',
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
        this.accionSolicitud();
      }
    })
  }
  aprobarSolicitud2() {
    this._solicitud.aprobarSolicitud(this.params.solicitud).subscribe(data => {
      if (data.estado == 1) {
        this.goPrestamos();
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
  updateSolicitud() {
    this._solicitud.updateSolicitud(this.params.solicitud).subscribe(data => {
      if (data.estado == 1) {
        this.aprobarSolicitud2();
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
  accionSolicitud() {
    this.params.solicitud.opcion = 4;
    this._solicitud.accionSolicitud(this.params.solicitud).subscribe(data => {
      if (data.estado == 1) {
        this.updateSolicitud();
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
  public encodeImageFileAsURL(element) {
    let promise = new Promise((resolve, reject) => {
      let file = element.target.files[0];
      let reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = function () {
        resolve(reader.result);
      }
    });
    return promise;
  }
  desaprobarSolicitud() {
    swal({
      title: '¿Estás seguro?',
      text: 'Desea rechazar la solicitud de ' + this.listSolicitud.noSolicitante + ' !',
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
            swal(
              {
                title: 'Rechazada!',
                text: 'La solicitud de ' + this.listSolicitud.noSolicitante + ' ha sido rechazada !',
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
  pagare() {
    this.dataPagare = [];
    let tipoDoc;
    this.params.solicitud.idSolicitudPrestamo = this.op;
    if (this.params.solicitud.tipoDoc.idTipoDocumento == 1) {
      tipoDoc = "DNI";
    }
    else if (this.params.solicitud.tipoDoc.idTipoDocumento == 3) {
      tipoDoc = "RUC";
    }
    else {
      tipoDoc = "PASAPORTE";
    }
    this._solicitud.getPagare(this.params.solicitud)
      .subscribe(data => {
        if (data.estado == 1) {
          this.dataPagare = data.data[0];
          this.obtenerMes();
          this.dataPagare['tipoDoc'] = tipoDoc;
          this.dataPagare['anho'] = new Date().getFullYear();
          if (this.params.solicitud.noReferencia == null) {
            $('#print-pagare').printThis({
            });
          }
          else {
            this.dataPagare['aval'] = (this.params.solicitud.noReferencia).toUpperCase();
            $('#print-pagareAval').printThis({
            });
          }

        } else if (data.estado == -1) {
          console.log(data);
        }
      },
        err => {
          this.toastr.error(err)
        });
  }
  obtenerMes() {
    let mes = (new Date().getMonth() + 1);
    if (mes == 1) {
      this.dataPagare['mes'] = 'Enero';
    }
    else if (mes == 2) {
      this.dataPagare['mes'] = 'Febrero';
    }
    else if (mes == 3) {
      this.dataPagare['mes'] = 'Marzo';
    }
    else if (mes == 4) {
      this.dataPagare['mes'] = 'Abril';
    }
    else if (mes == 5) {
      this.dataPagare['mes'] = 'Mayo';
    }
    else if (mes == 6) {
      this.dataPagare['mes'] = 'Junio';
    }
    else if (mes == 7) {
      this.dataPagare['mes'] = 'Julio';
    }
    else if (mes == 8) {
      this.dataPagare['mes'] = 'Agosto';
    }
    else if (mes == 9) {
      this.dataPagare['mes'] = 'Septiembre';
    }
    else if (mes == 10) {
      this.dataPagare['mes'] = 'Octubre';
    }
    else if (mes == 11) {
      this.dataPagare['mes'] = 'Noviembre';
    }
    else {
      this.dataPagare['mes'] = 'Diciembre';
    }

  }
  esteRecibe(element) {
    this.encodeImageFileAsURL(element).then((result) => {
      this.params.solicitud.foto = result;
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
  public longitudDocumento = null;
  public tipoDoc = [];
  public departamentos = [];
  public provincias = [];
  public distritos = [];
  public changeInput(tipoDoc) {
    if (this.params.solicitud.tipoDoc.idTipoDocumento == 1) {
      this.longitudDocumento = 8;
    }
    if (this.params.solicitud.tipoDoc.idTipoDocumento == 2) {
      this.longitudDocumento = 12;
    }
    if (this.params.solicitud.tipoDoc.idTipoDocumento == 3) {
      this.longitudDocumento = 11;
    }
  }
  getTiposDocumentos() {
    this._solicitud.getTipoDocumento().subscribe(data => {
      if (data.estado == 1) {
        this.tipoDoc = data.documentoList;
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
  getDepartamentos() {
    this._solicitud.getDepartamentos().subscribe(data => {
      if (data.estado == 1) {
        this.departamentos = data.depaList;
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
  getProvincias() {
    this._solicitud.getProvincias(this.params.solicitud).subscribe(data => {
      if (data.estado == 1) {
        this.provincias = data.proList;
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
  getDistritos() {
    this._solicitud.getDistritos(this.params.solicitud).subscribe(data => {
      if (data.estado == 1) {
        this.distritos = data.disList;
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
