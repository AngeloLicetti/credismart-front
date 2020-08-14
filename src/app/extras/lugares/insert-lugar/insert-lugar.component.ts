import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { ToastrService } from 'ngx-toastr';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';

@Component({
  selector: 'app-insert-lugar',
  templateUrl: './insert-lugar.component.html',
  providers:[SolicitudesService]
})
export class InsertLugarComponent implements OnInit {
  @Input() e;
  @Input() op;
  public titulo;
  public params={
    lugar:{
      nombreDetalle:null,
      idLugar:null,
      nombreLugar:null
    }
  }
  constructor(
    public _modalDialog: MatDialog,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<InsertLugarComponent>,
    public _solicitud: SolicitudesService,
  ) { }

  ngOnInit() {
    this.inicial();
  }
  inicial() {
    if (this.op == 1) {
      this.titulo = "Editar Lugar";
      this.params.lugar.nombreLugar=this.e.nombreLugar;
    }
    else{
      this.titulo = "Crear Lugar";
    }
  }
  close(add?) {
    this.dialogRef.close(add);
  }
  registrar() {
    this._solicitud.insertarLugar(this.params).subscribe(data => {
      if (data.confirmacion.id == 1) {
        this.toastr.success("Se registró el lugar","Exitoso");
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
  actualizar() {
    this.params.lugar.idLugar=this.e.idLugar;
    this._solicitud.actualizarLugar(this.params).subscribe(data => {
      if (data.confirmacion.id == 1) {
        this.toastr.success("Se modificó el lugar","Exitoso");
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

