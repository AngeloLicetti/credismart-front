import { ViewChild } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CajaService } from 'src/app/services/caja.service';
import { ToastrService } from 'ngx-toastr';
import { setInputPattern, setValidatorPattern, setQuantifier, isInvalid } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';


@Component({
  selector: 'app-aperturar-caja',
  templateUrl: './aperturar-caja.component.html',
  providers:[CajaService]

})
export class AperturarCajaComponent implements OnInit {
  @Input() element;
  public params = {idCaja:null, dC:null, descripcionCaja:null, montoApertura:null, idEmpleado:null, nombreEmpleado:null};

  constructor(
    public toastr: ToastrService,
    public _modalDialog: MatDialog,
    public dialogRef: MatDialogRef<AperturarCajaComponent>,
    public _caja: CajaService
  ) { }

  ngOnInit() {
    this.obtenerCabecera();
  }

  public obtenerCabecera() {
    this.params.idCaja=this.element.idCaja;
    this.params.dC = this.element.descripcionCaja;
    this.params.idEmpleado = this.element.idEmpleado;
    this.params.nombreEmpleado = this.element.noNombre + ' ' + this.element.noApellido; 
  }

  insertarApertura() {
    this._caja.insertarAperturaCaja(this.params)
      .subscribe(data => {
        if (data.estado == 1) {
          this.toastr.success("Caja aperturada correctamente","Exitoso");
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

}
