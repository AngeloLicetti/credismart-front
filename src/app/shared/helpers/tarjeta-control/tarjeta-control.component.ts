import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { PagosService } from 'src/app/services/pagos.service';
import { ToastrService } from 'ngx-toastr';
import { PagoComponent } from '../pago/pago.component';
import { getNombre, getLogo, getDireccion, getTelefono } from '../../auth/storage/cabecera.storage';
declare var moment: any;
declare const $: any;
@Component({
  selector: 'app-tarjeta-control',
  templateUrl: './tarjeta-control.component.html',
  styleUrls: ['./tarjeta-control.component.scss'],
  providers: [SolicitudesService, PagosService]
})
export class TarjetaControlComponent implements OnInit {
  @Input() e;
  @Input() idPrestamo;
  @Input() idTarjetaCliente;
  public idPago = [];
  public indices = [];
  public listTiposPrestamos = [];
  public listPagos = [];
  public monto;
  public interes;
  public cuota;
  public tipoPres;
  public total;
  public show = 0;
  public disabled = true;
  public fecha: Date;
  public fechaInicio;
  public saldo;
  public logo;
  public nombre;
  public dir;
  public tel;
  constructor(
    public _modalDialog: MatDialog,
    public _solicitud: SolicitudesService,
    public dialogRef: MatDialogRef<TarjetaControlComponent>,
    public toastr: ToastrService,
    public _pagos: PagosService
  ) {
    this.logo = getLogo();
    this.nombre = getNombre();
    this.dir = getDireccion();
    this.tel = getTelefono();
  }

  ngOnInit() {
    console.log(this.e);
    
    this.getTiposP();
    var display = $.fn.dataTable.render.number(',', '.', 2, 'S/').display;
    var display2 = $.fn.dataTable.render.number(',', '.', 2, '', ' %').display;
    let aux = 1;
    if (this.e.tipoPrestamo.idTipoPrestamo == 2) {
      aux = Math.round(Number(this.e.nuCuotas) / 4);
    }
    else if (this.e.tipoPrestamo.idTipoPrestamo == 3) {
      aux = Math.round(Number(this.e.nuCuotas) / 2);
    }
    else {
      aux = Math.round(Number(this.e.nuCuotas));
    }
    var formattedNumber = display2(this.e.interes / aux);
    var formattedNumber2 = display2(this.e.interes);
    if (this.e.tipoPrestamo.idTipoPrestamo == 1) { this.interes = formattedNumber2 };
    if (this.e.tipoPrestamo.idTipoPrestamo != 1) { this.interes = formattedNumber };
     
    this.monto = display(this.e.monto);
    this.cuota = display(this.e.cuota);
    this.fecha = this.e.feInicio ? this.e.feInicio : this.e.fechaInicio
    this.fechaInicio = moment(this.fecha).format("DD-MM-YYYY");
    this.getPagos();
  }
  close(add?) {
    this.dialogRef.close(add);
  }
  getTiposP() {
    this._solicitud.getTiposPrestamos().subscribe(data => {
      if (data.estado == 1) {
        this.listTiposPrestamos = data.listTiposPrestamos;
        this.listTiposPrestamos.forEach(element => {
          if (element.idTipoPrestamo == this.e.tipoPrestamo.idTipoPrestamo) {
            this.tipoPres = element.noTipo;
          }
        });
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
  public agregarIdPago(element) {
    this.idPago = [];
    this.indices = [];
    for (let ls of this.listPagos) {
      if (ls['checked']) {
        this.indices.push(ls.indice)
        this.idPago.push(ls.idPago);
      }
    }
  }
  calcularPago(element, evnt) {
    let i = 0;
    for (let ls of this.listPagos) {
      if (ls['checked'] && ls['estado'] == 0) {
        i++;
      }
    }
    if (this.contadoVencidas == i) {
      this.disabled = false;
    }
    else {
      this.disabled = true;
    }
    this.agregarIdPago(element);
  }
  public auxPago;
  public contadoVencidas = 0;
  public auxSaldo;
  getPagos() {
    this.auxSaldo = 0;
    let par = {
      idPrestamo: this.idPrestamo
    }
    this._pagos.verPagos(par).subscribe(data => {
      if (data.estado == 1) {
        this.listPagos = data.pagosList;
        this.total = (Number(this.e.nuCuotas) * Number(this.e.cuota));
        this.show = 1;
        this.saldo = this.total;
        for (let index = 0; index < this.listPagos.length; index++) {
          if (this.listPagos[index].monto > 0) {
            this.saldo =(Number(this.saldo) - Number(this.listPagos[index].monto));
          }
          if (this.listPagos[index].estado == 0) {
            this.contadoVencidas++;
          }
        }
        if (this.contadoVencidas == 0) {
          this.disabled = false;
        }
        if (this.saldo == 0) {
          this.auxSaldo = 1;
        }
        if (this.saldo < 0) {
          this.auxSaldo = 1;
          this.saldo = 0;
        }        
      } else {
        this.show = 0;
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
  public aux2;
  public contador = 0;
  public element2;
  saldoRestante(element) {
    this.element2 = element;
    this.contador++;
    if (this.contador % 2 == 0) {
      this.aux2 = 0;
    }
    else {
      this.aux2 = 1;
    }
  }
  agregarPago2() {
    const dialogRef = this._modalDialog.open(PagoComponent, {
      autoFocus: false,
      minWidth: '30%',
      maxWidth: '86%',
      disableClose: true,
    });
    dialogRef.componentInstance.e = this.element2;
    dialogRef.componentInstance.idPago = this.element2.idPago;
    dialogRef.componentInstance.op = 2;
    dialogRef.componentInstance.i = this.element2.indice;
    dialogRef.componentInstance.idPrestamo = this.idPrestamo;
    dialogRef.componentInstance.idTarjetaCliente = this.idTarjetaCliente;
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.idPago = [];
        this.aux2 = 0;
        this.getPagos();
      }
    });

  }
  agregarPago(e, op) {
    if (this.idPago.length == 0 && op == 0) {
      this.toastr.warning("No se seleccionó cuotas a pagar ", "Advertencia")
      return;
    }
    else {
      const dialogRef = this._modalDialog.open(PagoComponent, {
        autoFocus: false,
        minWidth: '30%',
        maxWidth: '86%',
        disableClose: true,
      });
      dialogRef.componentInstance.e = e;
      dialogRef.componentInstance.idPago = this.idPago;
      dialogRef.componentInstance.op = op;
      dialogRef.componentInstance.i = this.indices.toString();
      dialogRef.componentInstance.idPrestamo = this.idPrestamo;
      dialogRef.componentInstance.idTarjetaCliente = this.idTarjetaCliente;
      dialogRef.afterClosed().subscribe(result => {
        if (result == 1) {
          this.idPago = [];
          this.getPagos();
        }
      });
    }

  }
  public fecha_str;
  public hora;
  imprimir() {
    this.fecha_str = moment(Date.now()).format("DD-MM-YYYY");
    this.hora = moment(Date.now()).format("hh:mm A");
    $('#print-tarjeta').printThis({
    });
  }
}
