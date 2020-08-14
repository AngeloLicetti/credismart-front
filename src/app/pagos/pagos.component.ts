import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PagosService } from '../services/pagos.service';
import { Observable, Subscription } from 'rxjs';
import { SolicitudesService } from '../services/solicitudes.service';
import { getIdRol, getIdUsuario, getIpress, getLogo, getNombre, getDireccion, getTelefono } from '../shared/auth/storage/cabecera.storage';
import { ModalPdfComponent } from '../shared/helpers/modal-pdf/modal-pdf.component';
import { ToastrService } from 'ngx-toastr';
import { getToken } from '../shared/auth/storage/token.storage';
import { Configuration } from '../shared/configuration/app.constants';
declare interface DataTable { };
var oComponent: PagosComponent;
var dtResultado;
declare var moment, saveAs: any;
declare const $: any;
@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  providers: [PagosService, SolicitudesService]
})
export class PagosComponent implements OnInit, AfterViewInit {

  public pagoList = [];
  public feIni: Date = null;
  public feFin: Date = null;
  public show = 0;
  public dateHoy = new Date();

  public params = {
    feDesde: null,
    idTipoPrestamo: null,
    idTipoPago: null,
    feHasta: null,
    idEmpleado: null
  }
  public ListPagos = [
    { "idTipoPago": 1, "noTipo": "Efectivo" },
    { "idTipoPago": 2, "noTipo": "Transferencia" }
  ]
  public totalPago = 0;
  public totalMora = 0;
  public listTiposPrestamos = [];
  public porcentaje;
  public logo;
  public nombre;
  public dir;
  public tel;
  constructor(
    public _configuration: Configuration,
    public _modalDialog: MatDialog,
    public toastr: ToastrService,
    public _solicitud: SolicitudesService,
    public _pago: PagosService
  ) {
    if (window.screen.width > 1400) {
      this.porcentaje = "100%"
    }
    else {
      this.porcentaje = "110%"
    }
    this.logo = getLogo();
    this.nombre = getNombre();
    this.dir = getDireccion();
    this.tel = getTelefono();
  }
  public updateSubscription: Subscription;
  ngOnInit() {
    oComponent = this;
    if (Number(getIdRol()) == 1) {
      this.params.idEmpleado = null;
    }
    else {
      this.params.idEmpleado = Number(getIdUsuario());
    }
    this.getPagosTotal();
    this.getTiposP();
    // this.updateSubscription = interval(10000).subscribe(
    //   (val) => { this.getPagos(1); this.getPagosTotal(); })
  }
  clear() {
    this.params.idTipoPrestamo = null;
    this.feIni = null;
    this.feFin = null;
    this.params.idTipoPago = null;
    this.buscar();
    this.getPagosTotal();
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
        url: oComponent._configuration.URL_PAGOS,
        type: "GET",
        data: function (d) {
          d.idTipoPrestamo = oComponent.params.idTipoPrestamo;
          d.idTipoPago = oComponent.params.idTipoPago;
          d.feDesde = oComponent.feIni ? moment(oComponent.feIni).format("MM-DD-YYYY") : '';
          d.feHasta = oComponent.feFin ? moment(oComponent.feFin).format("MM-DD-YYYY") : '';
          d.idEmpleado = oComponent.params.idEmpleado;
          d.nuPagina = (d.start + d.length) / d.length;
          d.nuRegisMostrar = d.length;
        }
      },
      columns: [

        { data: 'cliente' },
        { data: 'fechaPago' },
        { data: 'montoPrestado' },
        { data: 'interes' },
        { data: 'tipoPrestamo' },
        { data: 'montoPagado' },
        { data: 'mora' },
        { data: 'tipoPago' },
      ],
      columnDefs: [
        { 'className': 'text-center', 'targets': [0, 1, 2, 3, 4, 5, 6, 7, 8] },
        {
          render: function (data, type, row) {
            if (row.montoPrestado == '' || row.montoPrestado == null) { return "" };
            var display = $.fn.dataTable.render.number(',', '.', 2, 'S/').display;
            var formattedNumber = display(row.montoPrestado);
            return formattedNumber;
          },
          targets: 2
        },
        {
          render: function (data, type, row) {
            let aux = 1;
            if (row.tipoPrestamo == "Semanal") {
              aux = Math.round(row.nuCuota / 4);
            }
            else if (row.tipoPrestamo == "Quincenal") {
              aux = Math.round(row.nuCuota / 2);
            }
            else {
              aux = Math.round(row.nuCuota);
            }
            var display = $.fn.dataTable.render.number(',', '.', 2, '', ' %').display;
            var formattedNumber = display(row.interes / aux);
            var formattedNumber2 = display(row.interes);
            if (row.interes == '' || row.interes == null) { return "" };
            if (row.tipoPrestamo == "Diario" && row.interes != null) { return formattedNumber2 };
            return formattedNumber;
          },
          targets: 3
        },
        {
          render: function (data, type, row) {
            if (row.montoPagado == '' || row.montoPagado == null) { return "" };
            var display = $.fn.dataTable.render.number(',', '.', 2, 'S/').display;
            var formattedNumber = display(row.montoPagado);
            return formattedNumber;
          },
          targets: 5
        },
        {
          render: function (data, type, row) {
            if (row.mora == '' || row.mora == null) { return "" };
            var display = $.fn.dataTable.render.number(',', '.', 2, 'S/').display;
            var formattedNumber = display(row.mora);
            return formattedNumber;
          },
          targets: 6
        },
        {
          render: function (data, type, row) {
            if (row.noBanco == '' || row.noBanco == null) { return '<span>' + row.tipoPago + '</span>' };
            return '<span>' + row.tipoPago + ' - ' + row.noBanco + '</span>'

          },
          targets: 7
        },
        {
          render: function (data, type, row) {
            return '<div class="text-center"><a class="actions" href="javascript:void(0)">' +
              '<button class="btn-simple btn-info print btn-icon like" rel="tooltip" title="Imprimir Recibo" data-placement="left">' +
              '<i class="material-icons">print</i>' +
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
      oComponent.imprimir(data.idComprobantePago);
      event.preventDefault();
    });

  }
  ngAfterViewInit(): void {
    this.ConfigurarBuscar();
  }
  buscar() {
    dtResultado.ajax.reload();
  }
  public listAux = [];
  public getPagosTotal() {
    this.totalMora = 0;
    this.totalPago = 0;
    this.listAux = [];
    let aux = {
      feDesde: oComponent.feIni ? moment(oComponent.feIni).format("MM-DD-YYYY") : '',
      idEmpleado: this.params.idEmpleado,
      idTipoPrestamo: this.params.idTipoPrestamo,
      idTipoPago: this.params.idTipoPago,
      feHasta: oComponent.feFin ? moment(oComponent.feFin).format("MM-DD-YYYY") : '',
      nuPagina: null,
      nuRegisMostrar: null
    }
    this._pago.getPagos(aux)
      .subscribe(data => {
        if (data.estado == 1) {
          this.listAux = data.data;
          if (this.listAux.length > 0) {
            for (let index = 0; index < this.listAux.length; index++) {
              this.totalPago = this.totalPago + Number(this.listAux[index].montoPagado);
              this.totalMora = this.totalMora + Number(this.listAux[index].mora);
            }
          }
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
  public reporte={
    numeroSerie:null,
    cliente:null,
    montoLetras:null,
    montoPagado:null,
    detalle:null,
    tipoPago:null
  };
  public imprimir(id) {
    let par = {
      idComprobantePago: id
    }
    this._pago.imprimirRecibo(par)
      .subscribe(data => {
        if (data.estado == 1) {
          this.reporte = data.data[0];
          this.imprimir2();
        } else if (data.estado == -1) {
          console.log(data);
        }
      },
        err => {
          this.toastr.error(err)
        });
  }
  public fecha_str;
  public hora;
  imprimir2() {
    this.fecha_str = moment(Date.now()).format("DD-MM-YYYY");
    this.hora = moment(Date.now()).format("hh:mm A");
    $('#print-section-material').printThis({
    });
  }

}
