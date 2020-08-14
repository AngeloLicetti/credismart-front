import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { PagosService } from 'src/app/services/pagos.service';
import { ToastrService } from 'ngx-toastr';
import { getLogo, getNombre, getDireccion, getTelefono } from 'src/app/shared/auth/storage/cabecera.storage';
import { Params, ActivatedRoute } from '@angular/router';
import { PrestamosService } from 'src/app/services/prestamos.service';
import { ModalPdfComponent } from 'src/app/shared/helpers/modal-pdf/modal-pdf.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

declare var moment: any;
declare const $: any;
@Component({
  selector: 'app-tarjeta-control',
  templateUrl: './tarjeta-control.component.html',
  providers: [SolicitudesService, PagosService, PrestamosService]
})
export class TarjetaControlComponent implements OnInit {
  @ViewChild('content', { static: false }) content: ElementRef;

  public id;
  public listTiposPrestamos = [];
  public listPagos = [];
  public monto;
  public interes;
  public cuota;
  public tipoPres;
  public cliente;
  public total;
  public fechaInicio;
  public saldo;
  public logo;
  public nombre;
  public dir;
  public tel;
  public showImprimir = 0;
  constructor(
    public _modalDialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    public _prestamo: PrestamosService,
    public _solicitud: SolicitudesService,
    public toastr: ToastrService,
    public _pagos: PagosService
  ) {
    this.logo = getLogo();
    this.nombre = getNombre();
    this.dir = getDireccion();
    this.tel = getTelefono();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params['op'];
    });
    this.getPrestamo();
  }
  public nuCuotas;
  getPrestamo() {
    let par = {
      idPrestamo: this.id
    }
    this._prestamo.verPrestamo(par).subscribe(data => {
      if (data.estado == 1) {
        var display = $.fn.dataTable.render.number(',', '.', 2, 'S/').display;
        var display2 = $.fn.dataTable.render.number(',', '.', 2, '', ' %').display;
        let aux = 1;
        if (data.prestamo.tipoPrestamo.idTipoPrestamo == 2) {
          aux = Math.round(Number(data.prestamo.nuCuotas) / 4);
        }
        else if (data.prestamo.tipoPrestamo.idTipoPrestamo == 3) {
          aux = Math.round(Number(data.prestamo.nuCuotas) / 2);
        }
        else {
          aux = Math.round(Number(data.prestamo.nuCuotas));
        }
        var formattedNumber = display2(data.prestamo.interes / aux);
        var formattedNumber2 = display2(data.prestamo.interes);
        if (data.prestamo.tipoPrestamo.idTipoPrestamo == 1) { this.interes = formattedNumber2 };
        if (data.prestamo.tipoPrestamo.idTipoPrestamo != 1) { this.interes = formattedNumber };

        this.monto = display(data.prestamo.monto);
        this.cuota = display(data.prestamo.cuota);
        this.cliente = data.prestamo.noCliente;
        this.nuCuotas = data.prestamo.nuCuotas;
        this.fechaInicio = moment(data.prestamo.feInicio).format("DD-MM-YYYY");
        this.getTiposP(data.prestamo.tipoPrestamo.idTipoPrestamo);
        this.total = Math.ceil(Number(this.nuCuotas) * Number(data.prestamo.cuota));
        this.getPagos(this.total);
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
  getTiposP(ele) {
    this._solicitud.getTiposPrestamos().subscribe(data => {
      if (data.estado == 1) {
        this.listTiposPrestamos = data.listTiposPrestamos;
        this.listTiposPrestamos.forEach(element => {
          if (element.idTipoPrestamo == ele) {
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
  getPagos(total) {
    let par = {
      idPrestamo: this.id
    }
    this._pagos.verPagos(par).subscribe(data => {
      if (data.estado == 1) {
        this.listPagos = data.pagosList;
        this.saldo = total;
        for (let index = 0; index < this.listPagos.length; index++) {
          if (this.listPagos[index].monto > 0) {
            this.saldo = Math.ceil(Number(this.saldo) - Number(this.listPagos[index].monto));
          }
        }
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
  public pdf;
  public imprimir(id) {
    let par = {
      idPrestamo: this.id
    }
    this._pagos.imprimirTarjeta(par)
      .subscribe(data => {
        console.log(data);
        if (data.imprimeFile != null) {
          this.pdf = "data:application/pdf;base64," + data.imprimeFile;
          this.openModal(this.pdf);
        } else if (data.estado == -1) {
          console.log(data);
        }
      },
        err => {
          this.toastr.error(err)
        });
  }
  openModal(mystring): void {
    const dialogRef = this._modalDialog.open(ModalPdfComponent, {
      autoFocus: false,
      maxWidth: '95%',
      width: '60%',
      maxHeight: '95%',
      height: '80%',
      disableClose: false,
      panelClass: 'pdfs'
    });
    dialogRef.componentInstance.mystring = mystring;
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
