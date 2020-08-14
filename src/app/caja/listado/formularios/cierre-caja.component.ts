import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { CajaService } from 'src/app/services/caja.service';
import { setInputPattern, setValidatorPattern, setQuantifier, isInvalid } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { getLogo, getNombre, getDireccion, getTelefono } from 'src/app/shared/auth/storage/cabecera.storage';
declare var moment: any;
declare const $: any;
@Component({
  selector: 'app-cierre-caja',
  templateUrl: './cierre-caja.component.html',
  providers:[CajaService]
})
export class CierreCajaComponent implements OnInit {

  @Input() element;
  public params = {idAperturaCaja:null, montoApertura:null, montoCierre:null,saldoCaja:null,saldoFaltante:null,montoEfectivo:null,montoDeposito:null,saldoEfectivo:null,saldoDeposito:null,faltanteEfectivo:null,faltanteDeposito:null, observacion:null};
  public aperturaCajaList :any =[];
  public sumaPrestamo = 0;
  public sumaGastos = 0;
  public logo;
  public nombre;
  public dir;
  public tel;
  constructor(
    public toastr: ToastrService,
    public _modalDialog: MatDialog,
    public dialogRef: MatDialogRef<CierreCajaComponent>,
    public _caja: CajaService
  ) {
    this.logo= getLogo();
    this.nombre=getNombre();
    this.dir=getDireccion();
    this.tel=getTelefono();
   }

  ngOnInit() {   
    this.obtenerCabecera();
    this.getMontoCierre();
  }  

  public obtenerCabecera() {
    this.params.idAperturaCaja = this.element.idAperturaCaja;
    this.getPGC();
  }

  actualizarCierre() {
    this._caja.actualizarCierreAperturaCaja(this.params)
      .subscribe(data => {
        if (data.estado == 1) {
          this.toastr.success("Caja cerrada correctamente","Exitoso");
          this.close(1);
          this.imprimir();
        } else {
          this.toastr.error(data.confirmacion.mensaje);
        }
      },
        error => {
          this.toastr.error(error);
          return Observable.throw(error);
        }),
      err => this.toastr.error(err),
      () => this.toastr.success('Request Complete');
  }

  close(ad?) {
    this.dialogRef.close(ad);
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

  public isInvalid(_ngForm: any): boolean {
    return isInvalid(_ngForm);
  }

  public visible:boolean=false;

  public getMontoCierre() {
    this._caja.obtenerMontoCierre(this.params)
      .subscribe(data => {
        if (data.estado == 1) {
          this.aperturaCajaList = data.aperturaCajaList;
          this.params.montoCierre = this.aperturaCajaList[0].montoFinal;
          this.params.montoEfectivo = this.aperturaCajaList[0].totalEfectivo;
          this.params.montoDeposito = this.aperturaCajaList[0].totalDeposito;
          this.params.montoApertura = this.aperturaCajaList[0].montoApertura;
          
          if(this.params.montoCierre==null||this.params.montoCierre==undefined){
            this.params.montoCierre=0;
          }
          if(this.params.saldoCaja==null||this.params.saldoCaja==undefined){
            this.params.saldoCaja=0;
          }
          if(this.params.montoEfectivo==null||this.params.montoEfectivo==undefined){
            this.params.montoEfectivo=0;
          }
          if(this.params.montoDeposito==null||this.params.montoDeposito==undefined){
            this.params.montoDeposito=0;
          }
          if(this.params.saldoFaltante==null||this.params.saldoFaltante==undefined){
            this.params.saldoFaltante=0;
          }

          if(this.params.montoDeposito==null||this.params.montoDeposito==undefined){
            this.visible=true;
          }
          if(this.params.faltanteEfectivo==null||this.params.faltanteEfectivo==undefined){
            this.params.faltanteEfectivo=0;
          }
          if(this.params.faltanteDeposito==null||this.params.faltanteDeposito==undefined){
            this.params.faltanteDeposito=0;
          }
          if(this.params.observacion==null||this.params.observacion==undefined){
            this.params.observacion="";
          }


        }
        else {
          console.log("No se pudo encontrar las cajas");
        }
        return true;
      },
        error => {
          console.error(error);
        },
        () => {
        });
  }

  calcularFaltanteEfectivo() {
    let cal = this.params.montoEfectivo - this.params.saldoEfectivo;
    this.params.faltanteEfectivo = cal.toFixed(2);

    let sum = parseFloat(this.params.faltanteEfectivo) + parseFloat(this.params.faltanteDeposito);
    if (this.params.faltanteDeposito != null) {
      this.params.saldoFaltante = sum.toFixed(2);
    }
  }

  calcularFaltanteTarjeta() {
    let cal = this.params.montoDeposito - this.params.saldoDeposito;
    this.params.faltanteDeposito = cal.toFixed(2);
    let sum = parseFloat(this.params.faltanteEfectivo) + parseFloat(this.params.faltanteDeposito);
    if (this.params.faltanteEfectivo != null) {
      this.params.saldoFaltante = sum.toFixed(2);
    }
  }
  public gastosList: any = [];
  public prestamoList: any = [];
  public getPGC() {
    this._caja.obtenerPGC(this.params)
      .subscribe(data => {
        if (data.estado == 1) {
          this.gastosList = data.gastosList;
          this.prestamoList = data.prestamoList;

          for (var i = 0; i < data.gastosList.length; i++) {
            this.sumaGastos += this.gastosList[i].monto;
          }
          for (var i = 0; i < data.prestamoList.length; i++) {
            this.sumaPrestamo += this.prestamoList[i].monto;
          }
        }
        else {
          console.log("No se pudo encontrar las cajas");
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
