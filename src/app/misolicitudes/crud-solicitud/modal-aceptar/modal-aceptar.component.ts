import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { setInputPattern, setValidatorPattern, setQuantifier, isInvalid } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';
import { PersonalService } from 'src/app/services/personal.service';


@Component({
  selector: 'app-modal-aceptar',
  templateUrl: './modal-aceptar.component.html',
  providers: [SolicitudesService,PersonalService]

})
export class ModalAceptarComponent implements OnInit {
  @Input() e;
  public bancoList = [];

  public tipo = {
    idTipo: null
  }
  public list = [];
  public params = {
    detalle: null,
    idEmpleado: null,
    idSolicitudPrestamo: null,
    foto: null,
    opcion: null,
    banco: null,
    titular: null,
    cuenta: null
  };
  public asunto;
  constructor(
    public toastr: ToastrService,
    public _modalDialog: MatDialog,
    public _personal: PersonalService,
    public dialogRef: MatDialogRef<ModalAceptarComponent>,
    public _solicitud: SolicitudesService
  ) { }

  ngOnInit() {
    this.params.idSolicitudPrestamo = this.e;
    this.getBanco();
  }
  accionSolicitud() {
    this.params.opcion = 3;
    this._solicitud.accionSolicitud(this.params).subscribe(data => {
      if (data.estado == 1) {
        this.updateSolicitud();
        swal(
          {
            title: 'Aceptada!',
            text: 'La proforma ha sido aceptada !',
            type: 'success',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          })
        this.close();
      } else {
        this.toastr.error(data.mensaje);
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
  close(ad?) {
    this.dialogRef.close(ad);
  }
  updateSolicitud() {
    this.params.detalle = this.params.banco + '-' + this.params.titular + '-' + this.params.cuenta;
    this._solicitud.updateSolicitud(this.params).subscribe(data => {
      if (data.estado == 1) {
      } else {
        this.toastr.error(data.mensaje);
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
  getBanco() {
    this._personal.obtenerComboBanco().subscribe(data => {
      if (data.estado == 1) {
        this.bancoList = data.bancoList;
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
