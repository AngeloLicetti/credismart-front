import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PrestamosService } from '../../services/prestamos.service';
import { ToastrService } from 'ngx-toastr';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { getToken } from 'src/app/shared/auth/storage/token.storage';
import { getIpress } from 'src/app/shared/auth/storage/cabecera.storage';
import { Configuration } from 'src/app/shared/configuration/app.constants';
import { TarjetaControlComponent } from 'src/app/shared/helpers/tarjeta-control/tarjeta-control.component';
import { MatDialog } from '@angular/material';
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
var oComponent: HistorialComponent;
var dtResultado;
declare const $: any;
declare var moment, saveAs: any;

@Component({
  selector: 'app-historial-cmp',
  templateUrl: './historial.component.html',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    PrestamosService,
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class HistorialComponent implements OnInit, AfterViewInit {
  public params = {
    nuDocideSolicitante: null,
    mes: null,
    nuPagina: null,
    nuRegisMostrar: null
  }
  public dataTable: DataTable;
  date = new FormControl(moment());
  public dateHoy = new Date();
  constructor(
    public _modalDialog: MatDialog,
    public toastr: ToastrService,
    public _configuration: Configuration,
    public _prestamo: PrestamosService
  ) {
  }

  ngOnInit() {
    oComponent = this;
  }
  public validacion = 'Cancelado';
  clear() {
    this.params.nuDocideSolicitante = null;
    this.params.mes = null;
    this.date = new FormControl(moment());
    this.buscar();
  }
  busquedaDNI(target) {
    if (target.length > 7) {
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
        url: oComponent._configuration.URL_PRESTAMO_HISTORIAL,
        type: "GET",
        data: function (d) {
          d.nuDocideSolicitante = oComponent.params.nuDocideSolicitante;
          d.mes = oComponent.params.mes;
          d.nuPagina = (d.start + d.length) / d.length;
          d.nuRegisMostrar = d.length;
        }
      },
      columns: [
        { data: 'cuotas' },
        { data: 'noCliente' },
        { data: 'feRegistro' },
        { data: 'monto' },
        { data: 'interes' },
        { data: 'cuota' },
        { data: 'tipoPrestamo.noTipo' }
      ],
      columnDefs: [
        { 'className': 'text-center', 'targets': [0, 1, 2, 3, 4, 5, 6, 7] },
        {
          render: function (data, type, row) {
            if (row.cuotas == 'Cancelado') {
              return '<span class="badge badge-warning" >' + row.cuotas + '</span>';
            };
            return '<span class="badge badge-success">' + row.cuotas + '</span>';
          },
          targets: 0
        },
        {
          render: function (data, type, row) {
            if (row.feRegistro == '' || row.feRegistro == null) { return "" };
            var actionsHtml = moment(row.feRegistro).format("DD-MM-YYYY");
            return actionsHtml;
          },
          targets: 2
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
          targets: 4
        }, {
          render: function (data, type, row) {
            if (row.cuota == '' || row.cuota == null) { return "" };
            var display = $.fn.dataTable.render.number(',', '.', 2, 'S/').display;
            var formattedNumber = display(row.cuota);
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
            if (row.cuotas == 'Cancelado') { return "" }
            return '<div class="text-center><a class="actions" href="javascript:void(0)">' +
              '<button  class="btn-simple btn-info tarjeta btn-icon like" rel="tooltip" title="Ver Tarjeta de Control" data-placement="left" >' +
              '<i class="material-icons">chrome_reader_mode</i>' +
              '</button>' +
              '</a></div>';

          },
          targets: 7,
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
  buscar() {
    dtResultado.ajax.reload();
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
