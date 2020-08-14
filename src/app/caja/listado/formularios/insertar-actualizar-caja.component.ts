import { ViewChild } from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { CajaService } from 'src/app/services/caja.service';
import { setInputPattern, setValidatorPattern, setQuantifier, isInvalid } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';

@Component({
  selector: 'app-insertar-actualizar-caja',
  templateUrl: './insertar-actualizar-caja.component.html',
  providers: [CajaService]
})
export class InsertarActualizarCajaComponent implements OnInit {
  @Input() op;
  @Input() element;
  public params = { descripcionCaja: null, idEmpleadoAsignado: null, idCaja: null };
  public titulo;
  public empleadoList: any[];
  public disabled = false;
  constructor(
    public toastr: ToastrService,
    public _modalDialog: MatDialog,
    public dialogRef: MatDialogRef<InsertarActualizarCajaComponent>,
    public _caja: CajaService
  ) { }

  ngOnInit() {
    this.obtenerEmpleados();
    if (this.op == 0) {
      this.titulo = "Registrar Caja";
    }
    else {
      this.titulo = "Modificar Caja";
      this.params.idEmpleadoAsignado = this.element.idEmpleado;
      this.params.descripcionCaja = this.element.descripcionCaja;
      this.disabled = true;
    }
  }

  insertarCaja() {
    this._caja.insertarCaja(this.params)
      .subscribe(data => {
        if (data.estado == 1) {
          this.toastr.success("Caja registrada correctamente","Exitoso");
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

  actualizarCaja() {
    this.params.idCaja = this.element.idCaja;
    this._caja.actualizarCaja(this.params)
      .subscribe(data => {
        if (data.estado == 1) {
          this.toastr.success("Caja actualizada correctamente","Exitoso");
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

  public obtenerEmpleados() {
    this._caja.obtenerComboEmpleados()
      .subscribe(data => {
        if (data.estado == 1) {
          this.empleadoList = data.empleadoList;
        }
      },
        error => {
          // console.error(error);
        });
  }

}
