import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from '../custom-validators/validators-messages/validators-messages.component';
import { ModalPdfComponent } from '../modal-pdf/modal-pdf.component';
import { getIdUsuario } from '../../auth/storage/cabecera.storage';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { PagosService } from 'src/app/services/pagos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.scss'],
  providers: [SolicitudesService, PagosService]
})
export class PagoComponent implements OnInit {
  @Input() e;
  @Input() op;
  @Input() i;
  @Input() idPrestamo;
  @Input() idPago;
  @Input() idTarjetaCliente;
  public listCajas = [];
  public monto = 0;
  public showBanco = 0
  public showDetalle = 0;
  public cuota: number = 0;
  public tipo = {
    idTipo: null
  }
  public jsonPago = [
    {
      "idPago": null,
      "monto": null,
      "mora": null
    },
  ];
  public params = {
    prestamo: {
      idTarjetaCliente: null,
      monto: null,
      mora: null,
      idBanco: null,
      pagoList: [],
      idTipoPago: null,
      comentarioDeposito: null,
      idCaja: null,
      detalle: null,
      idEmpleado: Number(getIdUsuario())
    }
  }
  public insert = {
    comprobante: {
      idPrestamo: null,
      idTipoPago: null,
      detalle: null,
      montoPagado: null,
      mora: null,
      idCaja: null,
      idBanco: null,
      idEmpleado: Number(getIdUsuario())
    }
  }
  public opcionCuotas = null;
  public opcionTipoPago = null;
  public listBancos = [];
  public pdf: String;
  public showTotal = 0;
  public totalPagar = 0;
  constructor(
    public _modalDialog: MatDialog,
    public dialogRef: MatDialogRef<PagoComponent>,
    public _solicitud: SolicitudesService,
    public _pagos: PagosService,
    public toastr: ToastrService,
  ) { }


  ngOnInit() {
    this.insert.comprobante.idPrestamo = this.idPrestamo;
    this.params.prestamo.idTarjetaCliente = this.idTarjetaCliente;
    this.inicial();
    this.getCajas();
    this.getCuotas();
    this.getBancos();
    (this.e.cuota).toFixed(2);
    this.getPagos();
  }
  inicial() {
    if (this.op == 1) {
      this.showDetalle = 1;
    }
  }

  verTipoPago(ve) {
    if (ve == '2') {
      this.showBanco = 1;
      this.params.prestamo.idTipoPago = 2;
    }
    else {
      this.showBanco = 0;
      this.params.prestamo.idTipoPago = 1;
      this.params.prestamo.idBanco = null;
      this.params.prestamo.comentarioDeposito = null;
    }
  }
  getCajas() {
    let params = {
      idEmpleado: Number(getIdUsuario())
    }
    this._solicitud.getCajas(params).subscribe(data => {
      if (data.estado == 1) {
        let aux = data.cajaList
        aux.forEach(element => {
          if (element.idAperturaCaja != null) {
            this.listCajas.push(element);
          }
        });
      } else {
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
  getBancos() {
    this._solicitud.getBancos().subscribe(data => {
      if (data.estado == 1) {
        this.listBancos = data.bancoList;
      } else {
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
  close(add?) {
    this.dialogRef.close(add);
  }
  public totalCuotas;
  getCuotas() {
    let par = {
      idPrestamo: this.idPrestamo
    }
    this._pagos.verCuotasVen(par).subscribe(data => {
      if (data.pagosList.length > 0) {
        this.totalCuotas = data.pagosList.length;
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
  public aux = 0;
  verMonto(ele) {
    if (ele == 'cuota') {
      this.totalPagar = (this.e.cuota * this.idPago.length);
      this.showTotal = 1;
      this.aux = this.totalPagar;
      this.monto = 0;
      this.params.prestamo.mora = null;
      this.params.prestamo.monto = null;
    }
    else {
      this.params.prestamo.mora = null;
      this.showTotal = 0;
      this.monto = 1;
    }
  }
  sumar() {
    this.totalPagar = this.params.prestamo.monto;
    this.aux = this.totalPagar;
    this.showTotal = 1;
  }
  sumarMora(el) {
    if (el.length == 0) {
      this.showTotal = 0;
    }
    else {
      this.showTotal = 1;
      this.totalPagar = Number(this.aux) + Number(this.params.prestamo.mora);
    }
  }
  public listPagos = [];
  public total;
  public saldo;

  getPagos() {
    let par = {
      idPrestamo: this.idPrestamo
    }
    this._pagos.verPagos(par).subscribe(data => {
      if (data.estado == 1) {
        this.listPagos = data.pagosList;
        this.total = Number(this.listPagos.length) * Number(this.e.cuota);
        this.saldo = this.total;
        for (let index = 0; index < this.listPagos.length; index++) {
          if (this.listPagos[index].monto > 0) {
            this.saldo = Number(this.saldo) - Number(this.listPagos[index].monto);
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
  pagar() {
    let param;
    let aux;
    this.jsonPago = [];
    if (this.op == 2) {
      if (this.opcionCuotas == 'cuota') {
        param = { idPago: this.idPago, monto: Number(this.e.cuota) + Number(this.e.monto), mora: this.params.prestamo.mora };
        this.jsonPago.push(param);
      }
      else {
        param = { idPago: this.idPago, monto: Number(this.params.prestamo.monto) + Number(this.e.monto), mora: this.params.prestamo.mora };
        this.jsonPago.push(param);
      }
    }
    else {
      if (this.opcionCuotas == 'cuota') {
        for (let index = 0; index < this.idPago.length; index++) {
          param = { idPago: this.idPago[index], monto: this.e.cuota, mora: this.params.prestamo.mora };
          this.jsonPago.push(param);
        }
      }
      else {
        let resta = (this.e.cuota * this.idPago.length) - this.params.prestamo.monto;
        for (let index = 0; index < this.idPago.length - 1; index++) {
          param = { idPago: this.idPago[index], monto: this.e.cuota, mora: this.params.prestamo.mora };
          this.jsonPago.push(param);
        }
        aux = { idPago: this.idPago[this.idPago.length - 1], monto: (this.e.cuota - resta), mora: this.params.prestamo.mora };
        this.jsonPago.push(aux);
      }
    }
    console.log(this.saldo);
    console.log(this.totalPagar - this.params.prestamo.mora);
    this.params.prestamo.pagoList = this.jsonPago;
    this._pagos.insertarPago(this.params.prestamo).subscribe(data => {
      if (data.confirmacion.id == 1) {
        this.insertarComprobante();
        if (this.saldo <= this.totalPagar - this.params.prestamo.mora) {
          this.cambiarEstado();
          this.toastr.info("Préstamo Pagado")
        }
        this.close(1);
      } else {
        this.toastr.info(data.confirmacion.mensaje);
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
  insertarComprobante() {
    this.insert.comprobante.montoPagado = this.totalPagar - this.params.prestamo.mora;
    this.insert.comprobante.idTipoPago = this.params.prestamo.idTipoPago;
    this.insert.comprobante.idCaja = this.params.prestamo.idCaja;
    this.insert.comprobante.idBanco = this.params.prestamo.idBanco;
    this.insert.comprobante.mora = Number(this.params.prestamo.mora);
    this.insert.comprobante.detalle = this.i + "/" + this.totalCuotas.toString();
    let idComprobante;
    this._pagos.insertarComprobante(this.insert).subscribe(data => {
      if (data.confirmacion.id > 0) {
        idComprobante = data.confirmacion.id;
        // this.imprimir(idComprobante);
      } else {
        this.toastr.info(data.confirmacion.mensaje);
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
  public imprimir(id) {
    let par = {
      idComprobantePago: id
    }
    this._pagos.imprimirRecibo(par)
      .subscribe(data => {
        if (data.estado == 1) {
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
      maxWidth: '90%',
      width: '60%',
      maxHeight: '95%',
      height: '70%',
      disableClose: false,
      panelClass: 'pdfs'
    });
    dialogRef.componentInstance.mystring = mystring;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  cambiarEstado() {
    console.log("entro al método");
    let par = {
      idPrestamo: this.idPrestamo
    }
    this._pagos.prestamoPagado(par).subscribe(data => {
      console.log(data);
      if (data.confirmacion.id > 0) {
        console.log("ok");

      } else {
        this.toastr.info(data.confirmacion.mensaje);
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
