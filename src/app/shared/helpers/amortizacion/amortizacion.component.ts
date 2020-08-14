import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { ToastrService } from 'ngx-toastr';
import { PrestamosService } from 'src/app/services/prestamos.service';
import { getFlCliente, getLogo, getNombre, getDireccion, getTelefono } from '../../auth/storage/cabecera.storage';
import { Observable } from 'rxjs';
declare var moment: any;
declare const $: any;
@Component({
  selector: 'app-amortizacion',
  templateUrl: './amortizacion.component.html',
  styleUrls: ['./amortizacion.component.scss'],
  providers: [SolicitudesService, PrestamosService]
})
export class AmortizacionComponent implements OnInit {
  @Input() e;

  public monto;
  public interes;
  public cuota;
  public tipoPres;
  public fechaInicio;

  public params = {
    nuCuotas: null,
    feInicio: null,
    interes: null,
    monto: null,
    idTipoPrestamo: null,
    dataPago: [],
    interes2: null,
    idSolicitudPrestamo:null,
    opcion:null

  }
  public flgCliente;
  public logo;
  public nombre;
  public dir;
  public tel;
  constructor(
    public _modalDialog: MatDialog,
    public _solicitud: SolicitudesService,
    public dialogRef: MatDialogRef<AmortizacionComponent>,
    public toastr: ToastrService,
    public _pres: PrestamosService,
  ) {
    this.flgCliente = Number(getFlCliente());
    this.logo = getLogo();
    this.nombre = getNombre();
    this.dir = getDireccion();
    this.tel = getTelefono();
  }

  ngOnInit() {
    this.calcular();
    var display = $.fn.dataTable.render.number(',', '.', 2, 'S/').display;
    var display2 = $.fn.dataTable.render.number(',', '.', 2, '', ' %').display;
    this.monto = display(this.e.monto);
    this.cuota = display(this.e.cuota);
    this.interes = display2(this.e.interes2);
    this.fechaInicio = moment(this.e.feInicio).format("DD-MM-YYYY");
    if (this.e.tipoPrestamo.idTipoPrestamo == 1) {
      this.tipoPres = "Diario";
    }
    else if (this.e.tipoPrestamo.idTipoPrestamo == 2) {
      this.tipoPres = "Semanal";
    }
    else if (this.e.tipoPrestamo.idTipoPrestamo == 3) {
      this.tipoPres = "Quincenal";
    }
    else  {
      this.tipoPres = "Mensual";
    }
  }
  close(add?) {
    this.dialogRef.close(add);
  }
  public listPagos;
  public total;
  public calcular() {
    this.params.nuCuotas = this.e.nuCuota;
    this.params.monto = this.e.monto;
    this.params.idTipoPrestamo = this.e.tipoPrestamo.idTipoPrestamo;
    this.params.interes = this.e.interes;
    this.params.feInicio = moment(this.e.feInicio).format("YYYY-MM-DD");
    this.listPagos = [];
    this._pres.getProforma(this.params)
      .subscribe(data => {
        if (data.estado == 1) {
          if (data.pagosList.length == 0) {
            this.toastr.info('Error');
          } else {
            this.listPagos = data.pagosList;
            this.total = Number(this.listPagos[0].cuota * this.e.nuCuota);
          }
        } else if (data.estado == 0) {
          console.log(data.mensaje, "Error");
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
  imprimir() {
    this.fecha_str = moment(Date.now()).format("DD-MM-YYYY");
    this.hora = moment(Date.now()).format("hh:mm A");
    $('#print-section-material').printThis({
    });
  }


}
