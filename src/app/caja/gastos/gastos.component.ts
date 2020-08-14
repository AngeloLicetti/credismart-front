import { MatDialog } from '@angular/material';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CajaService } from '../../services/caja.service';
import { InsertarActualizarGastosComponent } from './insertar-actualizar-gastos/insertar-actualizar-gastos.component';
import { ToastrService } from 'ngx-toastr';
import { getToken } from 'src/app/shared/auth/storage/token.storage';
import { getIpress, getIdUsuario } from 'src/app/shared/auth/storage/cabecera.storage';
import { Configuration } from 'src/app/shared/configuration/app.constants';
declare interface DataTable { };
var oComponent: GastosComponent;
var dtResultado;
declare const $: any;
declare var moment: any;

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  providers: [CajaService]
})
export class GastosComponent implements OnInit, AfterViewInit {

  public params = { idCaja: null, fechaGasto: null, nuPagina: null, nuRegisMostrar: null };
  public feIni: Date = new Date();
  public show = 0;
  public idAperturaCaja = 0;
  public cli = {
    fechaBusqueda: null
  }
  public cajaList: any[];
  constructor(
    public _modalDialog: MatDialog,
    public toastr: ToastrService,
    public _caja: CajaService,
    public _configuration: Configuration,
  ) {

  }

  ngOnInit() {
    oComponent = this;
    this.obtenerCajaCombo();
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
        },
        url: oComponent._configuration.URL_GASTOS,
        type: "GET",
        data: function (d) {
          d.idCaja = oComponent.params.idCaja;
          d.fechaGasto = oComponent.cli.fechaBusqueda ? moment(oComponent.cli.fechaBusqueda).format("MM-DD-YYYY") : "";
          d.nuPagina = (d.start + d.length) / d.length;
          d.nuRegisMostrar = d.length;
        }
      },
      columns: [

        { data: 'descripcionCaja' },
        { data: 'descripcionGastos' },
        { data: 'monto' },
        { data: 'fechaInscripcion' }
      ],
      columnDefs: [
        { 'className': 'text-center', 'targets': [0, 1, 2, 3] },

        {
          render: function (data, type, row) {
            if (row.monto == '' || row.monto == null) { return "" };
            var display = $.fn.dataTable.render.number(',', '.', 2, 'S/').display;
            var formattedNumber = display(row.monto);
            return formattedNumber;
          },
          targets: 2
        }
      ]
    });

  }
  ngAfterViewInit(): void {
    this.ConfigurarBuscar();
  }
  buscar() {
    dtResultado.ajax.reload();
  }
  modalInsertarGastos() {
    const dialogRef = this._modalDialog.open(InsertarActualizarGastosComponent,
      {
        autoFocus: false,
        disableClose: true,
        hasBackdrop: true,
        // width: '85%',
        // maxWidth: '90%',
        // height: '80%',
        maxHeight: '95%',
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.buscar();
      }
    });
  }
  public obtenerCajaCombo() {
    this._caja.obtenerComboCajaEmpleado()
      .subscribe(data => {
        if (data.estado == 1) {
          this.cajaList = data.cajaList;
        }
      },
        error => {
          console.error(error);
        });
  }
  clear() {
    this.params.idCaja = null;
    this.cli.fechaBusqueda = null;
    this.buscar();
  }


}
