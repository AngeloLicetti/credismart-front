import { MatDialog } from '@angular/material';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PrestamosService } from '../../services/prestamos.service';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudesService } from '../../services/solicitudes.service';
import { ToastrService } from 'ngx-toastr';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from '../../shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { Configuration } from 'src/app/shared/configuration/app.constants';
import { getToken } from 'src/app/shared/auth/storage/token.storage';
import { getIpress } from 'src/app/shared/auth/storage/cabecera.storage';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { FormControl } from '@angular/forms';
// tslint:disable-next-line:no-duplicate-imports
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
var oComponent: ListadoComponent;
var dtResultado;
declare const $: any;
declare var moment, saveAs: any;
@Component({
  selector: 'app-listado-cmp',
  templateUrl: './listado.component.html',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    PrestamosService, SolicitudesService,
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class ListadoComponent implements OnInit, AfterViewInit {
  date = new FormControl(moment());
  public show = 0;
  public params = {
    nuDocideSolicitante: null,
    noSolicitante: null,
    mes: null,
    idTipoPrestamo: null
  }
  public dataTable: DataTable;
  public updateSubscription: Subscription;
  public listTiposPrestamos = [];
  public showPrin = 0;
  public disabledN = false;
  public disabledD = false;
  public porcentaje;
  public dateHoy = new Date();
  constructor(public _modalDialog: MatDialog,
    public toastr: ToastrService,
    public _solicitud: SolicitudesService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _configuration: Configuration,
    public _prestamo: PrestamosService) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.params.nuDocideSolicitante = params.nuDocideSolicitante;
      this.params.noSolicitante = params.noSolicitante;
    }
    );
    if (window.screen.width > 1400) {
      this.porcentaje = "100%"
    }
    else {
      this.porcentaje = "118%"
    }
    console.log(this.porcentaje);

  }

  ngOnInit() {
    oComponent = this;
    this.getTiposP();
  }
  public navigate(nav) {
    this.router.navigate(nav, { relativeTo: this.activatedRoute });
  }

  clear() {
    this.params.noSolicitante = null;
    this.params.nuDocideSolicitante = null;
    this.params.mes = null;
    this.params.idTipoPrestamo = null;
    this.disabledD = false;
    this.disabledN = false;
    this.date = new FormControl(moment());
    this.buscar();
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
    if (target.length > 7) {
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
        url: oComponent._configuration.URL_PRESTAMOS,
        type: "GET",
        data: function (d) {
          d.nuDocideSolicitante = oComponent.params.nuDocideSolicitante;
          d.noSolicitante = oComponent.params.noSolicitante;
          d.mes = oComponent.params.mes;
          d.idTipoPrestamo = oComponent.params.idTipoPrestamo;
          d.nuPagina = (d.start + d.length) / d.length;
          d.nuRegisMostrar = d.length;
        }
      },
      columns: [
        { data: 'cuotasVencidas' },
        { data: 'noCliente' },
        { data: 'feRegistro' },
        { data: 'monto' },
        { data: 'interes' },
        { data: 'cuota' },
        { data: 'cuotas' },
        { data: 'tipoPrestamo.noTipo' },
        { data: 'proximoPago' }
      ],
      columnDefs: [
        { 'className': 'text-center', 'targets': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
        {
          render: function (data, type, row) {
            if (row.feInicio == '' || row.feInicio == null) { return "" };
            var actionsHtml = moment(row.feInicio).format("DD-MM-YYYY");
            return actionsHtml;
          },
          targets: 2
        },
        {
          render: function (data, type, row) {
            if (row.proximoPago == '' || row.proximoPago == null) { return "" };
            var actionsHtml = moment(row.proximoPago).format("DD-MM-YYYY");
            return actionsHtml;
          },
          targets: 8
        },
        {
          render: function (data, type, row) {
            if (row.monto == '' || row.monto == null) { return "" };
            var display = $.fn.dataTable.render.number(',', '.', 2, 'S/').display;
            var formattedNumber = display(row.monto);
            return formattedNumber;
          },
          targets: 3
        },
        {
          render: function (data, type, row) {
            let aux = 1;
            if (row.tipoPrestamo.idTipoPrestamo == 2) {
              aux = Math.round(Number(row.noReferencia) / 4);
            }
            else if (row.tipoPrestamo.idTipoPrestamo == 3) {
              aux = Math.round(Number(row.noReferencia) / 2);
            }
            else {
              aux = Math.round(Number(row.noReferencia));
            }
            var display = $.fn.dataTable.render.number(',', '.', 2, '', ' %').display;
            var formattedNumber = display(row.interes / aux);
            var formattedNumber2 = display(row.interes);
            if (row.interes == '' || row.interes == null) { return "" };
            if (row.tipoPrestamo.idTipoPrestamo == 1 && row.interes != null) { return formattedNumber2 };
            return formattedNumber;
          },
          targets: 4
        }, {
          render: function (data, type, row) {
            if (row.cuota == '' || row.cuota == null) { return "" };
            var display = $.fn.dataTable.render.number(',', '.', 2, 'S/').display;
            var formattedNumber = display(row.cuota);
            return formattedNumber;
          },
          targets: 5
        },
        {
          render: function (data, type, row) {
            if (row.nuCuotas == 1) {
              return '<span class="badge badge-warning" >' + row.nuCuotas + ' Ct Vencida</span>';
            };
            if (row.nuCuotas > 1) {
              return '<span class="badge badge-danger" >' + row.nuCuotas + ' Cts Vencidas</span>';
            };
            return '<span class="badge badge-success">Al día</span>';
          },
          targets: 0
        },
        {
          render: function (data, type, row) {
            return '<div class="text-center><a class="actions" href="javascript:void(0)">' +
              '<button  class="btn-simple btn-info tarjeta btn-icon like" rel="tooltip" title="Ver Préstamo" data-placement="left" >' +
              '<i class="material-icons">visibility</i>' +
              '</button>' +
              '</a></div>';
          },
          targets: 9,
          orderable: false
        },
      ]
    });

    dtResultado.on('click', '.like', function (event) {
      const $tr = $(this).closest('tr');
      const data = dtResultado.row($tr).data();
      const nav = ["crudprestamos", data.idPrestamo];
      oComponent.navigate(nav);
      event.preventDefault();
    });
  }
  ngAfterViewInit(): void {
    this.ConfigurarBuscar();
  }
  buscar() {
    dtResultado.ajax.reload();
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
