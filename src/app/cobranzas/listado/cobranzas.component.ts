import { MatDialog } from '@angular/material';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClientesService } from '../../services/clientes.service';
import { SolicitudesService } from '../../services/solicitudes.service';
import { ReporteService } from '../../shared/services/reporte.service';
import { getIdRol, getIdUsuario, getIpress, getLogo, getNombre, getDireccion, getTelefono } from '../../shared/auth/storage/cabecera.storage';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from '../../shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { Configuration } from '../../shared/configuration/app.constants';
import { getToken } from '../../shared/auth/storage/token.storage';
import { TarjetaControlComponent } from '../../shared/helpers/tarjeta-control/tarjeta-control.component';
import { EnviarMailComponent } from 'src/app/shared/helpers/enviar-mail/enviar-mail.component';
declare interface DataTable { };
var oComponent: CobranzasComponent;
var dtResultado;
declare var moment, saveAs: any;
declare const $: any;
@Component({
  selector: 'app-cobranzas',
  templateUrl: './cobranzas.component.html',
  providers: [ReporteService, SolicitudesService, ClientesService]


})
export class CobranzasComponent implements OnInit, AfterViewInit {

  public dataTable: DataTable;
  public clienteCobranzaList = [];
  public pdf: String;
  public disabledN = false;
  public disabledD = false;
  public show = 0;
  public updateSubscription: Subscription;
  public feIni: Date = new Date();
  public cli = {
    fechaBusqueda: null
  }
  public paramsBusqueda = {
    idEmpleado2: null,
    idEmpleado: null,
    idTipoPrestamo: null,
    fecha: null,
    nuPagina: null,
    nuRegisMostrar: null,
    tipoFile: null
  }
  public listTiposPrestamos = [];
  public empleadoList = [];
  public idRol;
  public logo;
  public nombre;
  public dir;
  public tel;
  public porcentaje;
  constructor(public _modalDialog: MatDialog,
    public toastr: ToastrService,
    public _cliente: ClientesService,
    public toast: ToastrService,
    public _solicitud: SolicitudesService,
    public _configuration: Configuration,
    public _reporte: ReporteService,
    public _route: ActivatedRoute) {
    this.idRol = Number(getIdRol());
    this.logo = getLogo();
    this.nombre = getNombre();
    this.dir = getDireccion();
    this.tel = getTelefono();
    if (window.screen.width > 1400) {
      this.porcentaje = "100%"
    }
    else {
      this.porcentaje = "110%"
    }
  }

  ngOnInit() {
    oComponent = this;
    if (Number(getIdRol()) == 1) {
      this.paramsBusqueda.idEmpleado = null;
    }
    else {
      this.paramsBusqueda.idEmpleado = Number(getIdUsuario());
    }
    // this.updateSubscription = interval(10000).subscribe(
    //   (val) => {this.getClientesCobranza(); })
    this.getTiposP();
    this.getEmpleados();
    this.getClientesCobranzaAll();

  }
  public empleado;
  buscarEmpleado() {
    this.paramsBusqueda.idEmpleado = this.paramsBusqueda.idEmpleado2;
    this.empleadoList.forEach(element => {
      if (element.idEmpleado == this.paramsBusqueda.idEmpleado) {
        this.empleado = element.noDescripcion;
      }
    });
    this.buscar();
  }

  public ConfigurarBuscar() {
    dtResultado = $('#dtResultado').on('init.dt', function (e, settings, json) {
    }).DataTable({
      "scrollX": true,
      responsive: false,
      processing: true,
      serverSide: true,
      ajax: {
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", 'Bearer ' + getToken());
          request.setRequestHeader("idFinanciera", getIpress());
        },
        url: oComponent._configuration.URL_COBRANZA,
        type: "GET",
        data: function (d) {
          d.idTipoPrestamo = oComponent.paramsBusqueda.idTipoPrestamo;
          d.idEmpleado = oComponent.paramsBusqueda.idEmpleado;
          d.fecha = oComponent.cli.fechaBusqueda ? moment(oComponent.cli.fechaBusqueda).format("DD-MM-YYYY") : moment(oComponent.feIni).format("DD-MM-YYYY");
          d.nuPagina = (d.start + d.length) / d.length;
          d.nuRegisMostrar = d.length;
        }
      },
      columns: [

        { data: 'noReferencia' },
        { data: 'cliente' },
        { data: 'nuCelular' },
        { data: 'fechaInicio' },
        { data: 'tipoPrestamo.noTipo' },
        { data: 'monto' },
        { data: 'interes' },
        { data: 'cuota' },
        { data: 'nuDocide' },
        { data: 'saldo' }
      ],
      columnDefs: [
        { 'className': 'text-center', 'targets': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        {
          render: function (data, type, row) {
            if (row.noReferencia == 1) {
              return '<span class="badge badge-warning" >' + row.noReferencia + ' Ct Vencida</span>';
            };
            if (row.noReferencia > 1) {
              return '<span class="badge badge-danger" >' + row.noReferencia + ' Cts Vencidas</span>';
            };
            return '<span class="badge badge-success">Al día</span>';
          },
          targets: 0
        },
        {
          render: function (data, type, row) {
            if (row.fechaInicio == '' || row.fechaInicio == null) { return "" };
            var actionsHtml = moment(row.fechaInicio).format("DD-MM-YYYY");
            return actionsHtml;
          },
          targets: 3
        },
        {
          render: function (data, type, row) {
            if (row.monto == '' || row.monto == null) { return "" };
            var display = $.fn.dataTable.render.number(',', '.', 2, 'S/').display;
            var formattedNumber = display(row.monto);
            return formattedNumber;
          },
          targets: 5
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
          targets: 6
        },
        {
          render: function (data, type, row) {
            if (row.cuota == '' || row.cuota == null) { return "" };
            var display = $.fn.dataTable.render.number(',', '.', 2, 'S/').display;
            var formattedNumber = display(row.cuota);
            return formattedNumber;
          },
          targets: 7
        },
        {
          render: function (data, type, row) {
            if (row.saldo == '' || row.saldo == null) { return "" };
            var display = $.fn.dataTable.render.number(',', '.', 2, 'S/').display;
            var formattedNumber = display(row.saldo);
            return formattedNumber;
          },
          targets: 9
        },
        {
          render: function (data, type, row) {
            if (row.montoPagado != null) { return '<span>Pago Registrado </span>'; }
            else {
              return '<div class="text-center"><a class="actions" href="javascript:void(0)">' +
                '<button class="btn-simple btn-info payment btn-icon like" rel="tooltip" title="Agregar Pago" data-placement="left">' +
                '<i class="material-icons">payment</i>' +
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

  }
  ngAfterViewInit(): void {
    this.ConfigurarBuscar();
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
  enviarMensaje() {
    let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    let fechaInicio = this.feIni ? ((this.feIni).toLocaleDateString('es-PE', options)).split('/').join('-') : null;
    let aux = {
      fecha: this.cli.fechaBusqueda ? moment(this.cli.fechaBusqueda).format("DD-MM-YYYY") : moment(this.feIni).format("DD-MM-YYYY"),
      idEmpleado: this.paramsBusqueda.idEmpleado,
      idTipoPrestamo: this.paramsBusqueda.idTipoPrestamo,
      nuPagina: null,
      nuRegisMostrar: null,
      tipoFile: 2
    }
    this._cliente.getClienteCobranzaReporte(aux)
      .toPromise().then(data => {
        if (data.estado == 1) {
          this.pdf = "data:application/pdf;base64," + data.imprimeFile;
          this.modalEmail(this.pdf, this.paramsBusqueda.fecha ? this.paramsBusqueda.fecha : fechaInicio);
        } else {
          this.toastr.warning("No se encontraron datos");
        }
        err => this.toastr.error(err);
        () => this.toastr.success('Request Complete');
      });
  }
  public modalEmail(archivo, fecha) {
    if (archivo != null) {
      const dialogRef = this._modalDialog.open(EnviarMailComponent, {
        autoFocus: false,
        disableClose: true,
        minWidth: '30%',
        maxWidth: '86%',
      });
      dialogRef.componentInstance.archivo = archivo;
      dialogRef.componentInstance.empleado = this.empleado;
      dialogRef.componentInstance.fecha = fecha;
      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {
          // this.buscar();
        }
      });
    }
  }
  public auxLista = [];
  public getClientesCobranzaAll() {
    this.auxLista = [];
    let aux = {
      fecha: oComponent.cli.fechaBusqueda ? moment(oComponent.cli.fechaBusqueda).format("DD-MM-YYYY") : moment(oComponent.feIni).format("DD-MM-YYYY"),
      idEmpleado: this.paramsBusqueda.idEmpleado,
      idTipoPrestamo: this.paramsBusqueda.idTipoPrestamo,
      nuPagina: null,
      nuRegisMostrar: null
    }
    this._cliente.getClienteCobranza(aux)
      .subscribe(data => {
        if (data.estado == 1) {
          this.auxLista = data.data;
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
  buscar() {
    dtResultado.ajax.reload();
  }
  clear() {
    this.paramsBusqueda.idEmpleado2 = null;
    this.paramsBusqueda.idEmpleado = null;
    this.paramsBusqueda.idTipoPrestamo = null;
    this.cli.fechaBusqueda = null;
    this.buscar();
    this.getClientesCobranzaAll();
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
      this.buscar();
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

}
