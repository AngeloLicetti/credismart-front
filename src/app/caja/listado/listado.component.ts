import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CajaService } from 'src/app/services/caja.service';
import { getIdRol, getIpress, getIdUsuario } from 'src/app/shared/auth/storage/cabecera.storage';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { ClientesService } from 'src/app/services/clientes.service';
import { getToken } from 'src/app/shared/auth/storage/token.storage';
import { Configuration } from 'src/app/shared/configuration/app.constants';
import { InsertarActualizarCajaComponent } from './formularios/insertar-actualizar-caja.component';
import { AperturarCajaComponent } from './formularios/aperturar-caja.component';
import { CierreCajaComponent } from './formularios/cierre-caja.component';
import { VerMovimientosComponent } from './formularios/ver-movimientos.component';
import { MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { Moment } from 'moment';
// tslint:disable-next-line:no-duplicate-imports
const moment = _moment;
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
@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    CajaService, ClientesService,
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class ListadoComponent implements OnInit, AfterViewInit {
  public empleadoList = [];
  public params = { estado: null, nuPagina: null, nuRegisMostrar: null, mes: null, idEmpleado: null, idEmpleado2: null };
  public cajaList: any = [];
  public idAperturaCaja = 0;
  public idRol: any;
  public updateSubscription: Subscription;
  public dataTable: DataTable;
  date = new FormControl(moment());
  public dateHoy = new Date();

  constructor(
    public _modalDialog: MatDialog,
    public _cliente: ClientesService,
    public _configuration: Configuration,
    public toastr: ToastrService,
    public _caja: CajaService
  ) {

  }

  ngOnInit() {
    oComponent = this;
    this.idRol = getIdRol();
    this.getEmpleados();
    // this.updateSubscription = interval(10000).subscribe(
    //   (val) => { this.getCaja() });
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
      "scrollX": true,
      responsive: false,
      processing: true,
      serverSide: true,
      ajax: {
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", 'Bearer ' + getToken());
          request.setRequestHeader("idFinanciera", getIpress());
          request.setRequestHeader("idPersonalH", getIdUsuario());
          request.setRequestHeader("idRol", getIdRol());
        },
        url: oComponent._configuration.URL_CAJAS,
        type: "GET",
        data: function (d) {
          d.idEmpleado2 = oComponent.params.idEmpleado2 ? oComponent.params.idEmpleado2 : '';
          d.mes = oComponent.params.mes ? oComponent.params.mes : '';
          d.estado = oComponent.params.estado;
          d.nuPagina = (d.start + d.length) / d.length;
          d.nuRegisMostrar = d.length;
        }
      },
      columns: [

        { data: 'descripcionCaja' },
        { data: 'noApellido' },
        { data: 'flEstado' }
      ],
      columnDefs: [
        { 'className': 'text-center', 'targets': [0, 1, 2] },
        {
          render: function (data, type, row) {
            if (row.flEstado == 'Cerrado') {
              return '<div class="text-center"><a class="actions" href="javascript:void(0)">' +
                '<button class="btn-simple btn-info open btn-icon open" rel="tooltip" title="Aperturar Caja" data-placement="left">' +
                '<i class="material-icons">lock_open</i>' +
                '</button>' +
                '</a>' +
                '<a class="actions" href="javascript:void(0s" data="' + data + '">' +
                '<button class="btn-simple btn-info edit btn-icon edit" rel="tooltip" title="Editar Caja" data-placement="left">' +
                '<i class="material-icons">edit</i>' +
                '</button>' +
                '</a></div>';
            }
            if (row.flEstado != 'Cerrado' && oComponent.idRol == 1) {
              return '<div class="text-center"><a class="actions" href="javascript:void(0)">' +
                '<button class="btn-simple btn-info lock btn-icon stop" rel="tooltip" title="Cerrar Caja" data-placement="left">' +
                '<i class="material-icons">lock</i>' +
                '</button>' +
                '</a>' +
                '<a class="actions" href="javascript:void(0)">' +
                '<button class="btn-simple btn-info movimientos btn-icon move" rel="tooltip" title="Ver Movimientos" data-placement="left">' +
                '<i class="material-icons">assessment</i>' +
                '</button>' +
                '</a>' +
                '<a class="actions" href="javascript:void(0s" data="' + data + '">' +
                '<button class="btn-simple btn-info edit btn-icon edit" rel="tooltip" title="Editar Caja" data-placement="left">' +
                '<i class="material-icons">edit</i>' +
                '</button>' +
                '</a></div>';
            }
            if (row.flEstado != 'Cerrado' && oComponent.idRol != 1) {
              return '<div class="text-center"><a class="actions" href="javascript:void(0)">' +
                '<button class="btn-simple btn-info lock btn-icon stop" rel="tooltip" title="Cerrar Parcialmente" data-placement="left">' +
                '<i class="material-icons">lock</i>' +
                '</button>' +
                '</a>' +
                '<a class="actions" href="javascript:void(0)">' +
                '<button class="btn-simple btn-info movimientos btn-icon move" rel="tooltip" title="Ver Movimientos" data-placement="left">' +
                '<i class="material-icons">assessment</i>' +
                '</button>' +
                '</a>' +
                '<a class="actions" href="javascript:void(0s" data="' + data + '">' +
                '<button class="btn-simple btn-info edit btn-icon edit" rel="tooltip" title="Editar Caja" data-placement="left">' +
                '<i class="material-icons">edit</i>' +
                '</button>' +
                '</a></div>';
            }
          },
          targets: 3,
          orderable: false
        },
      ]
    });

    dtResultado.on('click', '.move', function (event) {
      const $tr = $(this).closest('tr');
      const data = dtResultado.row($tr).data();
      oComponent.modalMovimientos(data);
      event.preventDefault();
    });
    dtResultado.on('click', '.edit', function (event) {
      const $tr = $(this).closest('tr');
      const data = dtResultado.row($tr).data();
      oComponent.modalInsertarCaja(1, data);
      event.preventDefault();
    });
    dtResultado.on('click', '.stop', function (event) {
      const $tr = $(this).closest('tr');
      const data = dtResultado.row($tr).data();
      oComponent.modalCierreCaja(data);
      event.preventDefault();
    });
    dtResultado.on('click', '.open', function (event) {
      const $tr = $(this).closest('tr');
      const data = dtResultado.row($tr).data();
      oComponent.modalAperturarCaja(data);
      event.preventDefault();
    });

  }
  ngAfterViewInit(): void {
    this.ConfigurarBuscar();
  }
  buscar() {
    dtResultado.ajax.reload();
  }
  clear() {
    this.params.idEmpleado = null;
    this.params.mes = null;
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

  modalInsertarCaja(op, el?) {
    const dialogRef = this._modalDialog.open(InsertarActualizarCajaComponent,
      {
        autoFocus: false,
        disableClose: true,
        hasBackdrop: true,
        maxWidth: '86%',
      });
    dialogRef.componentInstance.op = op;
    dialogRef.componentInstance.element = el;
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.buscar();
      }
    });
  }

  public modalAperturarCaja(Params?) {
    if (Params != null) {
      const dialogRef = this._modalDialog.open(AperturarCajaComponent, {
        maxWidth: '86%',
        autoFocus: false,
        disableClose: true
      });
      dialogRef.componentInstance.element = Params;
      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {
          this.buscar();
        }
      });
    }
  }

  public modalCierreCaja(Params) {
    if (Params != null) {
      const dialogRef = this._modalDialog.open(CierreCajaComponent, {
        maxWidth: '75%',
        maxHeight: '95%',
        autoFocus: false,
        disableClose: true
      });
      dialogRef.componentInstance.element = Params;
      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {
          this.buscar();
        }
      });
    }
  }

  public modalMovimientos(Params) {
    if (Params != null) {
      const dialogRef = this._modalDialog.open(VerMovimientosComponent, {
        autoFocus: false,
        maxWidth: '86%',
        height:'80%',
        disableClose: true
      });
      dialogRef.componentInstance.element = Params;
      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {
          this.buscar();
        }
      });
    }
  }

}
