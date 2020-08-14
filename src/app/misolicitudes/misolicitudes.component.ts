import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog, MatDatepicker } from '@angular/material';
import { PagosService } from '../services/pagos.service';
import { Observable, Subscription } from 'rxjs';
import { SolicitudesService } from '../services/solicitudes.service';
import { getIdRol, getIdUsuario, getIpress } from '../shared/auth/storage/cabecera.storage';
import { ModalPdfComponent } from '../shared/helpers/modal-pdf/modal-pdf.component';
import { ToastrService } from 'ngx-toastr';
import { getToken } from '../shared/auth/storage/token.storage';
import { Configuration } from '../shared/configuration/app.constants';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Moment } from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { EvidenciaComponent } from './crud-solicitud/evidencia/evidencia.component';
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM-YYYY',
  },
  display: {
    dateInput: 'MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
declare interface DataTable { };
var oComponent: MiSolicitudesComponent;
var dtResultado;
declare var moment: any;
declare const $: any;
@Component({
  selector: 'app-misolicitudes',
  templateUrl: './misolicitudes.component.html',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    PagosService, SolicitudesService,
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },]
})
export class MiSolicitudesComponent implements OnInit, AfterViewInit {
  date = new FormControl(moment());

  public pagoList = [];
  public pdf: String;
  public feIni: Date = null;
  public feFin: Date = null;
  public show = 0;

  public params = {
    mes: null,
    idTipoPrestamo: null,
    idCliente: null
  }
  public totalPago = 0;
  public totalMora = 0;
  public listTiposPrestamos = [];

  constructor(
    public _route: Router,
    public _configuration: Configuration,
    public activatedRoute: ActivatedRoute,
    public _modalDialog: MatDialog,
    public toastr: ToastrService,
    public _solicitud: SolicitudesService,
    public _pago: PagosService
  ) {
    this.params.idCliente = Number(getIdUsuario());
  }
  public updateSubscription: Subscription;
  ngOnInit() {
    oComponent = this;
    this.getTiposP();
    // this.updateSubscription = interval(10000).subscribe(
    //   (val) => { this.getPagos(1); this.getPagosTotal(); })
  }
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.params.mes = moment(oComponent.date.value['_d']).format("MM-YYYY");
    this.buscar();
  }
  clear() {
    this.params.idTipoPrestamo = null;
    this.params.mes = null;
    this.date = new FormControl(moment());
    this.buscar();
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
        url: oComponent._configuration.URL_MIS_SOLICITUDES,
        type: "GET",
        data: function (d) {
          d.idTipoPrestamo = oComponent.params.idTipoPrestamo;
          d.mes = oComponent.params.mes;
          d.idCliente = Number(getIdUsuario());
          d.nuPagina = (d.start + d.length) / d.length;
          d.nuRegisMostrar = d.length;
        }
      },
      columns: [

        { data: 'nuCelular' },
        { data: 'feInicio' },
        { data: 'monto' },
        { data: 'tipoPrestamo.noTipo' },
        { data: 'nuCuota' },
      ],
      columnDefs: [
        { 'className': 'text-center', 'targets': [0, 1, 2, 3, 4, 5] },
        {
          render: function (data, type, row) {
            if (row.nuCelular == 'P') {
              return '<span class="badge badge-warning" >PENDIENTE</span>';
            };
            if (row.nuCelular == 'D') {
              return '<span class="badge badge-danger" >RECHAZADA</span>';
            };
            return '<span class="badge badge-success">APROBADA</span>';
          },
          targets: 0
        },
        {
          render: function (data, type, row) {
            if (row.feInicio == '' || row.feInicio == null) { return "" };
            var actionsHtml = moment(row.feInicio).format("DD-MM-YYYY");
            return actionsHtml;
          },
          targets: 1
        },
        {
          render: function (data, type, row) {
            if (row.monto == '' || row.monto == null) { return "" };
            var display = $.fn.dataTable.render.number(',', '.', 2, 'S/').display;
            var formattedNumber = display(row.monto);
            return formattedNumber;
          },
          targets: 2
        },
        {
          render: function (data, type, row) {
            if (row.estadoCivil.idEstadoCivil == 1 && row.nuCelular == 'P' && row.sexo.idSexo != 3) {
              return '<div class="text-center><a class="actions" href="javascript:void(0)">' +
                '<button  class="btn-simple btn-info notificacion btn-icon like" rel="tooltip" title="Notificación" data-placement="left" >' +
                '<i class="material-icons">chrome_reader_mode</i>' +
                '</button>' +
                '</a></div>';
            }
            else if (row.sexo.idSexo == 2) {
              return '<span>RECHAZADA POR EL CLIENTE</span>';
            }
            else if (row.nuCelular == 'D') {
              return '<span>RECHAZADA POR LA EMPRESA FINANCIERA</span>';
            }
            else if (row.sexo.idSexo == 4 && row.sexo.descripcionSexo != null) {
              return '<div class="text-center><a class="actions" href="javascript:void(0)">' +
                '<button  class="btn-simple btn-info eye btn-icon evi" rel="tooltip" title="Ver Evidencia" data-placement="left" >' +
                '<i class="material-icons">chrome_reader_mode</i>' +
                '</button>' +
                '</a></div>';
            }
            else {
              return '';
            }
          },
          targets: 5,
          orderable: false
        },

      ]
    });

    dtResultado.on('click', '.like', function (event) {
      const $tr = $(this).closest('tr');
      const data = dtResultado.row($tr).data();
      const nav = ["formulario", data.idSolicitudPrestamo];
      oComponent.navigate(nav);
      event.preventDefault();
    });
    dtResultado.on('click', '.evi', function (event) {
      const $tr = $(this).closest('tr');
      const data = dtResultado.row($tr).data();
      oComponent.evidencia(data);
      event.preventDefault();
    });

  }
  ngAfterViewInit(): void {
    this.ConfigurarBuscar();
  }
  public navigate(nav) {
    this._route.navigate(nav, { relativeTo: this.activatedRoute });
  }
  buscar() {
    dtResultado.ajax.reload();
  }
  evidencia(op){
    const dialogRef = this._modalDialog.open(EvidenciaComponent, {
      minWidth:'28%',
      autoFocus: false,
      disableClose: true,
    });
    dialogRef.componentInstance.e = op;
    dialogRef.afterClosed().subscribe(result => {
    });
  }


}
