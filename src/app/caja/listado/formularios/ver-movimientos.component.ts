import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CajaService } from 'src/app/services/caja.service';
import { ToastrService } from 'ngx-toastr';
import { setInputPattern, setValidatorPattern, setQuantifier, isInvalid } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { getLogo, getNombre, getDireccion, getTelefono } from 'src/app/shared/auth/storage/cabecera.storage';
declare var moment: any;
declare const $: any;

@Component({
  selector: 'app-ver-movimientos',
  templateUrl: './ver-movimientos.component.html',
  providers: [CajaService]
})
export class VerMovimientosComponent implements OnInit {

  @Input() element;
  public params = { idAperturaCaja: null, descripcionApertura: null, nuPagina: null, nuRegisMostrar: null, nombreEmpleado: null };
  public sumaPrestamo = 0;
  public sumaCobranza = 0;
  public sumaGastos = 0;
  public gastosList: any = [];
  public cobranzaList: any = [];
  public prestamoList: any = [];
  public montoFinal;
  public logo;
  public nombre;
  public dir;
  public tel;
  constructor(public toastr: ToastrService,
    public _modalDialog: MatDialog,
    public dialogRef: MatDialogRef<VerMovimientosComponent>,
    public _caja: CajaService) {
    this.logo = getLogo();
    this.nombre = getNombre();
    this.dir = getDireccion();
    this.tel = getTelefono();
  }

  ngOnInit() {
    this.obtenerCabecera();
    this.getPGC();
  }

  public obtenerCabecera() {
    this.params.idAperturaCaja = this.element.idAperturaCaja;
    this.params.descripcionApertura = this.element.descripcionApertura;
    this.params.nombreEmpleado = this.element.noNombre;
    this.getMontoCierre();
  }

  public getPGC() {
    this._caja.obtenerPGC(this.params)
      .subscribe(data => {
        if (data.estado == 1) {
          this.gastosList = data.gastosList;
          this.cobranzaList = data.cobranzaList;
          this.prestamoList = data.prestamoList;

          for (var i = 0; i < data.gastosList.length; i++) {
            this.sumaGastos += this.gastosList[i].monto;
          }
          for (var i = 0; i < data.cobranzaList.length; i++) {
            this.sumaCobranza += this.cobranzaList[i].monto;
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
  public montoApertura;
  public getMontoCierre() {
    this.montoApertura = null;
    this._caja.obtenerMontoCierre(this.params)
      .subscribe(data => {
        if (data.estado == 1) {
          let aperturaCajaList = data.aperturaCajaList;
          var display = $.fn.dataTable.render.number(',', '.', 2, 'S/').display;
          this.montoApertura = display(aperturaCajaList[0].montoApertura);
          this.montoFinal = display(aperturaCajaList[0].montoFinal);
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
  public fecha_str;
  public hora;
  imprimir() {
    this.fecha_str = moment(Date.now()).format("DD-MM-YYYY");
    this.hora = moment(Date.now()).format("hh:mm A");
    $('#print-section-material').printThis({
    });
  }


}
