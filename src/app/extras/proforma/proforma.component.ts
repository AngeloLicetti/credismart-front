import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { NavigationExtras, Router } from '@angular/router';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { PrestamosService } from 'src/app/services/prestamos.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { CajaService } from 'src/app/services/caja.service';
import { ToastrService } from 'ngx-toastr';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { getIdRol, getIdUsuario, getLogo, getNombre, getDireccion, getTelefono } from '../../shared/auth/storage/cabecera.storage';
declare var moment: any;
declare const $: any;
@Component({
  selector: 'app-proforma',
  templateUrl: './proforma.component.html',
  providers: [SolicitudesService, ClientesService, CajaService, PrestamosService]

})
export class ProformaComponent implements OnInit {
  public show = 0;
  public listTiposPrestamos = [];
  public listPagos = [];
  public vi = { op: null }
  public jsonPago = [
    {
      "fecha_cuota": null,
      "cuota": null
    },
  ];
  public params = {
    feAux: null,
    idCliente: null,
    noApellido: null,
    noDireccion: null,
    noCliente: null,
    nuCelular: null,
    nuDocide: '',
    noEmail: null,
    noReferencia: null,
    noOcupacion: null,
    opVivienda: null,
    nuCelular2: null,
    nuTelefono: null,
    idProvincia: null,
    idDepartamento: null,
    idDistrito: null,
    idSexo: null,
    idEmpleado: null,
    idEstadoCivil: null,
    idTipoDocide: null,
    nuCuotas: null,
    feInicio: null,
    interes: null,
    monto: null,
    idCaja: null,
    idTipoPrestamo: null,
    dataPago: [],
    estado: 1,
    nuPagina: 1,
    cuota: null,
    nuRegisMostrar: 100000,
    tipoPrestamo: { idTipoPrestamo: null },
    interes2: null,
    feNacimiento: null

  }
  public tipoDoc = [];
  public departamentos = [];
  public provincias = [];
  public distritos = [];
  public showDatos = 1;
  public listTClientes = [];
  public listCajas = [];
  public sexoList = [];
  public estadoList = [];
  public empleadoList = [];
  public fecha: String;
  public maxfechRN: Date = new Date();
  public total;
  public montoFinal;
  public logo;
  public nombre;
  public dir;
  public tel;
  constructor(public _solicitud: SolicitudesService,
    public _pres: PrestamosService,
    public _modalDialog: MatDialog,
    public _cliente: ClientesService,
    public _caja: CajaService,
    public toastr: ToastrService,
    public _router: Router
  ) {
    this.logo = getLogo();
    this.nombre = getNombre();
    this.dir = getDireccion();
    this.tel = getTelefono();
  }

  ngOnInit() {
    this.maxfechRN.setHours(0,0,0,0);
    this.getEstadoCivil();
    this.getSexo();
    this.getEmpleados();
    this.getTiposDocumentos();
    this.getDepartamentos();
    this.getCajas();
    this.getTiposP();
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
  getCajas() {
    let params = {
      idEmpleado: Number(getIdUsuario())
    }
    this._solicitud.getCajas(params).subscribe(data => {
      if (data.estado == 1) {
        let aux = data.cajaList
        aux.forEach(element => {
          if (element.idAperturaCaja != null) {
            this.listCajas.push(element);
          }
        });
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
  public getMonto() {
    let par = {
      idAperturaCaja: this.params.idCaja
    }
    this._caja.obtenerMonto(par)
      .subscribe(data => {
        if (data.estado == 1) {
          this.montoFinal = data.aperturaCajaList[0].montoFinal;
          if (this.montoFinal < this.params.monto) {
            this.toastr.warning("No hay dinero suficiente en la caja");
            this.params.idCaja = null;
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
  getEmpleados() {
    this._cliente.getComboEmpleado().subscribe(data => {
      if (data.estado == 1) {
        this.empleadoList = data.empleadoList;
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
  public longitudDocumento = null;
  public changeInput(tipoDoc) {
    if (this.params.idTipoDocide == 1) {
      this.longitudDocumento = 8;
    }
    if (this.params.idTipoDocide == 2) {
      this.longitudDocumento = 12;
    }
    if (this.params.idTipoDocide == 3) {
      this.longitudDocumento = 11;
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
    this._solicitud.getProvincias(this.params).subscribe(data => {
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
    this._solicitud.getDistritos(this.params).subscribe(data => {
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
  verificar() {
    this.show = 0;
    this.jsonPago = [];
  }
  public getClientes() {
    this._cliente.getClientes(this.params)
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
    this.listTClientes = [];
    if (target.length > 2) {
      this.getClientes();
    }
    else if (target.length == 0) {
      this.params.idCliente = null;
      this.params.noCliente = null;
      this.params.noApellido = null;
      this.params.nuDocide = null;
      this.params.noDireccion = null;
      this.params.nuCelular = null;
      this.vi.op = null;
      this.params.idEstadoCivil = null;
      this.params.idSexo = null
      this.params.idEmpleado = null;
    }
    else {
      this.listTClientes = [];
    }
  }
  public request = {
    prestamo: {

    }
  }

  selectCliente(e) {
    this.params.idCliente = e.idCliente;
    this.params.idTipoDocide = e.idTipoDocide;
    this.params.noCliente = e.noCliente;
    this.params.nuDocide = e.nuDocide;
    this.params.noDireccion = e.noDireccion;
    this.params.nuCelular = e.nuCelular;
    this.params.idDepartamento = e.idDepartamento;
    this.params.idEmpleado = e.idEmpleado;
    this.params.noReferencia = e.noReferencia;
    this.params.noOcupacion = e.noOcupacion;
    if (this.params.idTipoDocide != 3) {
      this.params.feNacimiento = e.feNacimiento;
      this.params.idEstadoCivil = e.estadoCivil.idEstadoCivil;
      this.params.idSexo = e.sexo.idSexo;
    }
    if (this.params.idDepartamento != null) {
      this.getProvincias();
      this.params.idProvincia = e.idProvincia;
      this.getDistritos();
      this.params.idDistrito = e.idDistrito;
    }

  }
  confirmar() {
    this.params.tipoPrestamo.idTipoPrestamo = this.params.idTipoPrestamo;
    this.request.prestamo = this.params;
    if (this.params.feInicio < this.fecha) {
      this.toastr.info("Fecha de Inicio inválida");
      return;
    }
    if (Number(this.params.monto) > 20000) {
      this.toastr.info("El monto ingresado es mayor a S/20.000, se debe realizar una solicitud ");
      return;
    }
    if (Number(this.params.monto) == 20000) {
      this.toastr.info("El monto ingresado es igual a S/20.000, se debe realizar una solicitud ");
      return;
    }
    if (this.montoFinal < this.params.monto) {
      this.toastr.warning("No hay dinero suficiente en la caja");
      return;
    }
    this.params.dataPago = this.jsonPago;
    if (this.params.idCliente == null) {
      this.registrarCliente();
    }
    if (this.params.idCliente != null) {
      this._pres.insertarPrestamo(this.request).subscribe(data => {
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
      console.log(this.params);
    }

  }
  goPrestamos() {
    if (getIdRol() != '2') {
      let _params: NavigationExtras = {
        queryParams: {
          nuDocideSolicitante: this.params.nuDocide,
        }
      }
      this._router.navigate(['/prestamos/listado'], _params);
    }

  }
  registrarCliente() {
    this._cliente.insertarCliente(this.params).subscribe(data => {
      if (data.estado == 1) {
        if (data.confirmacion.mensaje == '0') {
          this.toastr.info("Documento de Identidad ya registrado");
        } else if (data.confirmacion.id == 0) {
          this.toastr.info("Edad inválida");
        }
        else {
          this.params.idCliente = data.confirmacion.id;
          this.request.prestamo = this.params;
          this._pres.insertarPrestamo(this.request).subscribe(data => {
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
          // this.toastr.success( "Se registró el cliente","Exitoso");
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
  public importeInicial;
  public interesInical;
  public saldoInicial;
  public bloqueado = 1;
  public calcular() {
    this.bloqueado = 0;
    let aux;
    this.importeInicial = 0;
    this.interesInical = 0;
    this.saldoInicial = 0;
    this.params.feInicio = moment(this.params.feAux).format("YYYY-MM-DD");
    this.show = 0;
    let param;
    this.listPagos = [];
    this.jsonPago = [];
    // if (this.params.feInicio < this.fecha) {
    //   this.toastr.info("Fecha de Inicio inválida");
    //   this.show = 0;
    //   return;
    // }
    if (this.params.idTipoPrestamo == 1) {
      aux = Math.round(this.params.nuCuotas / 30);
      this.params.interes = this.params.interes2 * aux;
    }
    else if (this.params.idTipoPrestamo == 2) {
      aux = Math.round(this.params.nuCuotas / 4);
      this.params.interes = this.params.interes2 * aux;
    }
    else if (this.params.idTipoPrestamo == 3) {
      aux = Math.round(this.params.nuCuotas / 2);
      this.params.interes = this.params.interes2 * aux;
    }
    else {
      aux = Math.round(this.params.nuCuotas / 1);
      this.params.interes = this.params.interes2 * aux;
    }
    this._pres.getProforma(this.params)
      .subscribe(data => {
        if (data.estado == 1) {
          if (data.pagosList.length == 0) {
            this.toastr.info('Error');
          } else {
            this.listPagos = data.pagosList;
            this.importeInicial = this.params.monto - this.listPagos[0].importe;
            this.interesInical = this.listPagos[0].cuota - this.importeInicial;
            this.listPagos.forEach(element => {
              element.importe = element.importe + this.importeInicial;
              element.interes = element.interes + this.interesInical;
              element.saldo = element.saldo + this.listPagos[0].cuota;
            });
            this.total = (Number(this.params.nuCuotas) * Number(data.pagosList[0].cuota));
            this.params.cuota = data.pagosList[0].cuota;
            for (let index = 0; index < this.listPagos.length; index++) {
              param = { fecha_cuota: this.listPagos[index].fecha_cuota, cuota: this.listPagos[index].cuota };
              this.jsonPago.push(param);
            }
          }
          this.show = 1;
        } else if (data.estado == 0) {
          console.log(data.mensaje, "Error");
        }
        else {
          console.log(data.mensaje);
        }
        this.bloqueado = 1;
        return true;
      },
        error => {
          console.error(error);
        },
        () => {
        });
  }
  public fecha_str;
  public hora;
  imprimir() {
    this.fecha_str = moment(Date.now()).format("DD-MM-YYYY");
    this.hora = moment(Date.now()).format("hh:mm A");
    $('#print-section-material').printThis({
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
