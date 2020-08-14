import { ViewChild } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { CajaService } from '../../../services/caja.service';
import { ToastrService } from 'ngx-toastr';
import { setInputPattern, setValidatorPattern, setQuantifier, isInvalid } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';

@Component({
  selector: 'app-insertar-actualizar-gastos',
  templateUrl: './insertar-actualizar-gastos.component.html',
  providers: [CajaService]
})
export class InsertarActualizarGastosComponent implements OnInit {

  public params = { gastosList: [], idAperturaCaja: null, descripcionGastos: null, monto: null, idCaja: null };

  public cajaList: any[];

  constructor(public toastr: ToastrService,
    public _modalDialog: MatDialog,
    public dialogRef: MatDialogRef<InsertarActualizarGastosComponent>,
    public _caja: CajaService) { }

  ngOnInit() {
    this.obtenerCajaCombo();

  }
  insertarGastos() {
    this._caja.insertarGastos(this.params)
      .subscribe(data => {
        if (data.estado == 1) {
          this.toastr.success("Gasto(s) registrados correctamente");
          this.close(1);
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

  public obtenerCajaCombo() {
    this.cajaList=[];
    this._caja.obtenerComboCaja()
      .subscribe(data => {
        if (data.estado == 1) {
          let aux=data.cajaList
          aux.forEach(element => {
            if (element.idAperturaCaja != null) {
              this.cajaList.push(element);
            }
          });
        }
        else if (data.estado == 0) {
          // console.log(data.mensaje);
        }
        else if (data.estado = -1) {
          // console.error(data.mensaje);
        }
      },
        error => {
          // console.error(error);
        });
  }

  public listMedioPago = [];


  eliminarprueba(index) {
    this.params.gastosList.splice(index, 1);
    this.listGastos = this.params.gastosList;
  }

  botonLimpiar() {
    this.params.idAperturaCaja = null;
  }

  public montoFinal;
  public listGastos = [];
  public getMonto() {
    console.log('Entro getmonto');
    this._caja.obtenerMonto(this.params)
      .subscribe(data => {
        console.log(data);
        if (data.estado == 1) {
          this.montoFinal = data.aperturaCajaList[0].montoFinal;
          console.log(this.montoFinal);
          console.log(Number(this.params.monto));
          if (this.montoFinal < Number(this.params.monto)) {
            this.toastr.warning("No hay dinero suficiente en la caja");
            Number(this.params.monto)
          }
          else {
            let param;
            param = { descripcionGastos: this.params.descripcionGastos, monto: this.params.monto };
            this.params.gastosList.push(param);
            this.listGastos = this.params.gastosList;
            this.params.monto = "";
            this.params.descripcionGastos = "";
          }
        } else if (data.estado == 0) {
          console.log(data.mensaje, "No tiene Clientes");
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

}
