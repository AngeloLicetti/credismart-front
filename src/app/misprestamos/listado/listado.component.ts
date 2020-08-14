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
import { getIpress, getIdUsuario } from 'src/app/shared/auth/storage/cabecera.storage';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { FormControl } from '@angular/forms';
import { TarjetaControlComponent } from 'src/app/shared/helpers/tarjeta-control/tarjeta-control.component';
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
export class ListadoComponent implements AfterViewInit, OnInit {
  date = new FormControl(moment());
  public show = 0;
  public params = {
    estado: '',
    mes: '',
  }
  public dataTable: DataTable;
  public updateSubscription: Subscription;
  public listTiposPrestamos = [];
  public showPrin = 0;
  public porcentaje;
  constructor(public _modalDialog: MatDialog,
    public toastr: ToastrService,
    public _solicitud: SolicitudesService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _configuration: Configuration,
    public _prestamo: PrestamosService) {
    if (window.screen.width > 1400) {
      this.porcentaje = "100%"
    }
    else {
      this.porcentaje = "105%"
    }
  }

  ngOnInit() {
    oComponent = this;
    this.params.estado = "D";
  }
  public navigate(nav) {
    this.router.navigate(nav, { relativeTo: this.activatedRoute });
  }

  clear() {
    this.params.mes = null;
    this.params.estado = null;
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
        url: oComponent._configuration.URL_MIS_PRESTAMOS,
        type: "GET",
        data: function (d) {
          d.idCliente = Number(getIdUsuario());
          d.estado = oComponent.params.estado;
          d.mes = oComponent.params.mes;
          d.nuPagina = (d.start + d.length) / d.length;
          d.nuRegisMostrar = d.length;
        }
      },
      columns: [
        { data: 'estado' },
        { data: 'feRegistro' },
        { data: 'monto' },
        { data: 'interes' },
        { data: 'cuota' },
        { data: 'cuotas' },
        { data: 'tipoPrestamo.noTipo' },
        { data: 'proximoPago' }
      ],
      columnDefs: [
        { 'className': 'text-center', 'targets': [0, 1, 2, 3, 4, 5, 6, 7, 8] },
        {
          render: function (data, type, row) {
            if (row.feRegistro == '' || row.feRegistro == null) { return "" };
            var actionsHtml = moment(row.feRegistro).format("DD-MM-YYYY");
            return actionsHtml;
          },
          targets: 1
        },
        {
          render: function (data, type, row) {
            if (row.proximoPago == '' || row.proximoPago == null) { return "" };
            var actionsHtml = moment(row.proximoPago).format("DD-MM-YYYY");
            return actionsHtml;
          },
          targets: 7
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
          targets: 3
        }, {
          render: function (data, type, row) {
            if (row.cuota == '' || row.cuota == null) { return "" };
            var display = $.fn.dataTable.render.number(',', '.', 2, 'S/').display;
            var formattedNumber = display(row.cuota);
            return formattedNumber;
          },
          targets: 4
        },
        {
          render: function (data, type, row) {
            if (row.estado == "0 Al día" && row.proximoPago != null) {
              return '<span class="badge badge-success">Al día</span>';
            };
            if (row.proximoPago == null) {
              return '<span class="badge badge-info" >Pagado</span>';
            };
            return '<span class="badge badge-warning" >' + row.estado + ' </span>';
          },
          targets: 0
        },
        {
          render: function (data, type, row) {
            return '<div class="text-center><a class="actions" href="javascript:void(0)">' +
              '<button  class="btn-simple btn-info tarjeta btn-icon like" rel="tooltip" title="Ver Tarjeta de Control" data-placement="left" >' +
              '<i class="material-icons">chrome_reader_mode</i>' +
              '</button>' +
              '</a></div>';
          },
          targets: 8,
          orderable: false
        },
      ]
    });
    dtResultado.on('click', '.like', function (event) {
      const $tr = $(this).closest('tr');
      const data = dtResultado.row($tr).data();
      const nav = ["tarjeta", data.idPrestamo];
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
