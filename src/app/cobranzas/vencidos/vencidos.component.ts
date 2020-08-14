
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PrestamosService } from '../../services/prestamos.service';
import { ToastrService } from 'ngx-toastr';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { getToken } from 'src/app/shared/auth/storage/token.storage';
import { getIpress, getIdRol, getIdUsuario, getNombre, getTelefono, getLogo, getDireccion } from 'src/app/shared/auth/storage/cabecera.storage';
import { Configuration } from 'src/app/shared/configuration/app.constants';
import { TarjetaControlComponent } from 'src/app/shared/helpers/tarjeta-control/tarjeta-control.component';
import { MatDialog } from '@angular/material';
import { ClientesService } from 'src/app/services/clientes.service';
import { Observable } from 'rxjs';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { PagosService } from 'src/app/services/pagos.service';
import { MessageService } from 'src/app/services/message.service';
import { MovimientosService } from 'src/app/dashboard/services/movimientos.service';
import { EnviarMailComponent } from 'src/app/shared/helpers/enviar-mail/enviar-mail.component';
import { ModalPdfComponent } from 'src/app/shared/helpers/modal-pdf/modal-pdf.component';
declare interface DataTable { };
var oComponent: VencidosComponent;
var dtResultado;
declare const $: any;
declare var moment: any;

@Component({
  selector: 'app-vencidos-cmp',
  templateUrl: './vencidos.component.html',
  providers: [PrestamosService, ClientesService, SolicitudesService, PagosService, MessageService, MovimientosService]
})
export class VencidosComponent implements OnInit, AfterViewInit {
  public params = {
    idEmpleado2: null,
    nuDocideSolicitante: null,
    noSolicitante: null,
    idEmpleado: null,
    idTipoPrestamo: null
  }
  public dataTable: DataTable;
  public empleadoList = [];
  public listTiposPrestamos = [];
  public idRol;
  public disabledN = false;
  public disabledD = false;
  public listVencidos = [];
  public logo;
  public nombre;
  public dir;
  public tel;
  public porcentaje;
  constructor(
    public _modalDialog: MatDialog,
    public toastr: ToastrService,
    public _cliente: ClientesService,
    public _pagos: PagosService,
    public _MessageService: MessageService,
    public _solicitud: SolicitudesService,
    public _mov: MovimientosService,
    public _configuration: Configuration,
    public _prestamo: PrestamosService
  ) {
    this.idRol = Number(getIdRol());
    this.logo = getLogo();
    this.nombre = getNombre();
    this.dir = getDireccion();
    this.tel = getTelefono();
    if (window.screen.width > 1400) {
      this.porcentaje = "100%"
    }
    else {
      this.porcentaje = "120%"
    }
  }

  ngOnInit() {
    oComponent = this;
    if (Number(getIdRol()) == 1) {
      this.params.idEmpleado = null;
    }
    else {
      this.params.idEmpleado = Number(getIdUsuario());
    }
    this.getEmpleados();
    this.getTiposP();
    this.getPrestamosVencidos();
  }
  public validacion = 'Cancelado';
  clear() {
    this.params.idEmpleado2 = null;
    this.params.nuDocideSolicitante = null;
    this.params.idEmpleado = null;
    this.params.idTipoPrestamo = null;
    this.params.noSolicitante = null;
    this.empleado = null;
    this.buscar();
  }
  public empleado = null;
  public pdf;
  buscarEmpleado() {
    this.params.idEmpleado = this.params.idEmpleado2;
    this.empleadoList.forEach(element => {
      if (element.idEmpleado == this.params.idEmpleado) {
        this.empleado = element.noDescripcion;
      }
    });
    this.buscar();
  }
  openModal(mystring): void {
    const dialogRef = this._modalDialog.open(ModalPdfComponent, {
      autoFocus: false,
      maxWidth: '90%',
      width: '80%',
      maxHeight: '95%',
      height: '95%',
      disableClose: false,
      panelClass: 'pdfs'
    });
    dialogRef.componentInstance.mystring = mystring;
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  enviarMensaje(op) {
    let aux = {
      noSolicitante: this.params.noSolicitante,
      nuDocideSolicitante: this.params.nuDocideSolicitante,
      idEmpleado: this.params.idEmpleado,
      idTipoPrestamo: this.params.idTipoPrestamo,
      nuPagina: null,
      nuRegisMostrar: null,
      tipoFile: 2
    }
    this._mov.getReporteVencidos(aux)
      .toPromise().then(data => {
        if (data.estado == 1) {
          this.pdf = "data:application/pdf;base64," + data.imprimeFile;
          if (op != 1) {
            this.modalEmail(this.pdf);
          }
          else {
            this.openModal(this.pdf);
          }
        } else {
          this.toastr.warning("No se encontraron datos");
        }
        err => this.toastr.error(err);
        () => this.toastr.success('Request Complete');
      });
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

  busqueda(target) {
    this.disabledD = false;
    if (target.length > 2) {
      this.disabledD = true;
      this.buscar();

    }
    if (target.length > 0) {
      this.disabledD = true;
    }
    if (target.length == 0) {
      this.disabledD = false;
      this.buscar();

    }
  }
  busquedaDNI(target) {
    this.disabledN = false;
    if (target.length % 8 == 0) {
      this.disabledN = true;
      this.buscar();

    }
    if (target.length > 0) {
      this.disabledN = true;
    }
    if (target.length == 0) {
      this.disabledN = false;
      this.buscar();
    }
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
  public ConfigurarBuscar() {
    dtResultado = $('#dtResultado').on('init.dt', function (e, settings, json) {
    }).DataTable({
      "decimal": ",",
      "thousands": ".",
      "scrollX": true,
      responsive: false,
      processing: true,
      serverSide: true,
      ajax: {
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", 'Bearer ' + getToken());
          request.setRequestHeader("idFinanciera", getIpress());
        },
        url: oComponent._configuration.URL_PRESTAMOS_VENCIDOS,
        type: "GET",
        data: function (d) {
          d.nuDocideSolicitante = oComponent.params.nuDocideSolicitante;
          d.noSolicitante = oComponent.params.noSolicitante;
          d.idEmpleado = oComponent.params.idEmpleado;
          d.idTipoPrestamo = oComponent.params.idTipoPrestamo;
          d.nuPagina = (d.start + d.length) / d.length;
          d.nuRegisMostrar = d.length;
        }
      },
      columns: [
        { data: 'cuotasVencidas' },
        { data: 'noCliente' },
        { data: 'empresa.foto' },
        { data: 'feRegistro' },
        { data: 'monto' },
        { data: 'interes' },
        { data: 'cuota' },
        { data: 'cuotas' },
        { data: 'tipoPrestamo.noTipo' },
        { data: 'proximoPago' }
      ],
      columnDefs: [
        { 'className': 'text-center', 'targets': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        {
          render: function (data, type, row) {
            if (row.feInicio == '' || row.feInicio == null) { return "" };
            var actionsHtml = moment(row.feInicio).format("DD-MM-YYYY");
            return actionsHtml;
          },
          targets: 3
        },
        {
          render: function (data, type, row) {
            if (row.proximoPago == '' || row.proximoPago == null) { return "" };
            var actionsHtml = moment(row.proximoPago).format("DD-MM-YYYY");
            return actionsHtml;
          },
          targets: 9
        },
        {
          render: function (data, type, row) {
            if (row.monto == '' || row.monto == null) { return "" };
            var display = $.fn.dataTable.render.number(',', '.', 2, 'S/').display;
            var formattedNumber = display(row.monto);
            return formattedNumber;
          },
          targets: 4
        },
        {
          render: function (data, type, row) {
            let aux = 1;
            if (row.tipoPrestamo.idTipoPrestamo == 2) {
              aux = Math.round(Number(row.nuCuotas) / 4);
            }
            else if (row.tipoPrestamo.idTipoPrestamo == 3) {
              aux = Math.round(Number(row.nuCuotas) / 2);
            }
            else {
              aux = Math.round(Number(row.nuCuotas));
            }
            var display = $.fn.dataTable.render.number(',', '.', 2, '', ' %').display;
            var formattedNumber = display(row.interes / aux);
            var formattedNumber2 = display(row.interes);
            if (row.interes == '' || row.interes == null) { return "" };
            if (row.tipoPrestamo.idTipoPrestamo == 1 && row.interes != null) { return formattedNumber2 };
            return formattedNumber;
          },
          targets: 5
        }, {
          render: function (data, type, row) {
            if (row.cuota == '' || row.cuota == null) { return "" };
            var display = $.fn.dataTable.render.number(',', '.', 2, 'S/').display;
            var formattedNumber = display(row.cuota);
            return formattedNumber;
          },
          targets: 6
        },
        {
          render: function (data, type, row) {
            if (row.cuotasVencidas == 1) {
              return '<span class="badge badge-warning" >' + row.cuotasVencidas + ' Ct Vencida</span>';
            };
            if (row.cuotasVencidas > 1) {
              return '<span class="badge badge-danger" >' + row.cuotasVencidas + ' Cts Vencidas</span>';
            };
            return '<span class="badge badge-success">Al día</span>';
          },
          targets: 0
        },
        {
          render: function (data, type, row) {
            if (row.noReferencia != null) {
              return '<div class="text-center><a class="actions" href="javascript:void(0)">' +
                '<button  class="btn-simple btn-info tarjeta btn-icon like" rel="tooltip" title="Ver Tarjeta de Control" data-placement="left" >' +
                '<i class="material-icons">chrome_reader_mode</i>' +
                '</button>' +
                '</a>' +
                '<a class="actions" href="javascript:void(0s" data="' + data + '">' +
                '<button class="btn-simple btn-info email btn-icon mail" rel="tooltip" title="Enviar Email" data-placement="left">' +
                '<i class="material-icons">email</i>' +
                '</button>' +
                '</a></div>';
            }
            else {
              return '<div class="text-center><a class="actions" href="javascript:void(0)">' +
                '<button  class="btn-simple btn-info tarjeta btn-icon like" rel="tooltip" title="Ver Tarjeta de Control" data-placement="left" >' +
                '<i class="material-icons">chrome_reader_mode</i>' +
                '</button>' +
                '</a></div>';
            }

          },
          targets: 10,
          orderable: false
        },
      ]
    });
    dtResultado.on('click', '.like', function (event) {
      const $tr = $(this).closest('tr');
      const data = dtResultado.row($tr).data();
      oComponent.tarjeta(data);
      event.preventDefault();
    });


    dtResultado.on('click', '.mail', function (event) {
      const $tr = $(this).closest('tr');
      const data = dtResultado.row($tr).data();
      oComponent.enviarMail(data);
      event.preventDefault();
    });

  }
  ngAfterViewInit(): void {
    this.ConfigurarBuscar();
  }
  public modalEmail(archivo) {
    if (archivo != null) {
      const dialogRef = this._modalDialog.open(EnviarMailComponent, {
        autoFocus: false,
        disableClose: true,
        minWidth: '30%',
        maxWidth: '86%',
      });
      dialogRef.componentInstance.archivo = archivo;
      dialogRef.componentInstance.empleado = this.empleado;
      dialogRef.componentInstance.fecha = null;
      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {
          // this.buscar();
        }
      });
    }
  }
  buscar() {
    dtResultado.ajax.reload();
    this.getPrestamosVencidos();
  }

  public asunto;
  public saludos = "";
  enviarMail(data) {
    let fechaPago = moment(data.proximoPago).format("DD-MM-YYYY");
    let cuota = (data.cuota).toFixed(2);
    if (data.cuotasVencidas == 1) {
      this.asunto = "Recuerde que tiene 1 Cuota Vencida, su fecha de pago fue el " + fechaPago + ".\n" + "El monto de su cuota es: S/" + cuota;
      this.saludos = "Saludos."
    }
    else {
      this.asunto = "Recuerde que tiene " + data.cuotasVencidas + " Cuotas Vencidas, su fecha de pago fue el " + fechaPago + ".\n" + "El monto a pagar es: S/" + Number(data.cuotasVencidas) * Number(cuota);
      this.saludos = "Por favor, comuníquese con nosotros."
    }

    this.getObtenerImpresion(data.idPrestamo, data.noReferencia);

  }
  public getObtenerImpresion(idPrestamo, noReferencia) {
    let par = {
      idPrestamo: idPrestamo
    }
    this._pagos.imprimirTarjeta(par)
      .subscribe(data => {
        if (data.estado == 0) {
          let pdf = "data:application/pdf;base64," + data.imprimeFile;
          this.contactForm(pdf, noReferencia);
        } else {
          console.log(data);
        }
      },
        err => {
          this.toastr.error(err)
        });
  }
  contactForm(archivo, noReferencia) {
    let cobranza = {
      financiera: getNombre(),
      credismart: 'credismart.peru@gmail.com',
      email: noReferencia,
      nombre: this.asunto,
      tele: getTelefono(),
      saludos: this.saludos,
      archivo: archivo,
    }
    this._MessageService.sendPrestamo(cobranza).subscribe((data) => {
      if (data.status == 200) {
        this.toastr.success("Email enviado");
      }
    });
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
    dialogRef.componentInstance.idPrestamo = e.idPrestamo;
    dialogRef.afterClosed().subscribe(result => {
      oComponent.buscar();
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
  public getPrestamosVencidos() {
    this.listVencidos = [];
    let aux = {
      nuDocideSolicitante: oComponent.params.nuDocideSolicitante,
      noSolicitante: oComponent.params.noSolicitante,
      idEmpleado: oComponent.params.idEmpleado,
      idTipoPrestamo: oComponent.params.idTipoPrestamo,
      nuPagina: 1,
      nuRegisMostrar: 1000000
    }
    this._cliente.getPrestamosVencidos(aux)
      .subscribe(data => {
        if (data.estado == 1) {
          this.listVencidos = data.data;
        } else if (data.estado == 0) {
          console.log(data.mensaje, "No tiene datos la tabla.");
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
  public fecha_str;
  public hora;
  public titulo;
  imprimir() {
    if (this.empleado == null) {
      this.titulo = "PRÉSTAMOS CON CUOTAS VENCIDAS";
    }
    else {
      this.titulo = "PRÉSTAMOS CON CUOTAS VENCIDAS DEL COBRADOR " + this.empleado
    }
    console.log(this.listVencidos)
    this.fecha_str = moment(Date.now()).format("DD-MM-YYYY");
    this.hora = moment(Date.now()).format("hh:mm A");
    $('#print-section-material').printThis({
    });
  }

}
