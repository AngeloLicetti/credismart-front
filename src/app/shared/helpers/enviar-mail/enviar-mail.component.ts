import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { setInputPattern, setValidatorPattern, setQuantifier, isInvalid } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { MessageService } from 'src/app/services/message.service';
import { MenuPrincipalService } from 'src/app/sidebar/services/menu-principal.service';
import { getIdUsuario } from 'src/app/shared/auth/storage/cabecera.storage';


@Component({
  selector: 'app-enviar-mail',
  templateUrl: './enviar-mail.component.html',
  providers: [MessageService, MenuPrincipalService]

})
export class EnviarMailComponent implements OnInit {
  @Input() archivo;
  @Input() fecha;
  @Input() empleado;
  public request = {
    idEmpleado: null
  }
  public list = [];
  public params = { email: null };
  public asunto;
  constructor(
    public toastr: ToastrService,
    public _modalDialog: MatDialog,
    public dialogRef: MatDialogRef<EnviarMailComponent>,
    public _MessageService: MessageService,
    public _menuPrincipalService: MenuPrincipalService
  ) { }

  ngOnInit() {
    this.obtenerDatos();
    if (this.empleado == undefined && this.fecha != null) {
      this.asunto = "Lista de clientes con fecha de pago: ";
    }
    else if (this.fecha == null && this.empleado == null) {
      this.asunto = "Préstamos con cuotas vencidas"
    }
    else if (this.fecha == null && this.empleado != null) {
      this.asunto = "Préstamos con cuotas vencidas del cobrador " + this.empleado
    }
    else {
      this.asunto = "Lista de clientes del cobrador " + this.empleado + " con fecha de pago: ";
    }
  }

  obtenerDatos() {
    this.request.idEmpleado = Number(getIdUsuario());
    this._menuPrincipalService.obtenerUsuario(this.request).subscribe(data => {
      if (data.estado == 1) {
        this.list = data.empleadoList;
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
  contactForm() {
    let fecha = this.fecha ? this.fecha : '';
    let cobranza = {
      financiera: this.list[0].financiera,
      credismart: 'credismart.peru@gmail.com',
      email: this.params.email,
      nombre: this.asunto + fecha,
      archivo: this.archivo,
    }
    this._MessageService.sendCobranza(cobranza).subscribe((data) => {
      this.close();
      if (data.status == 200) {
        this.toastr.success("Email enviado");
      }
    },
      error => {
        this.toastr.warning("Ocurrió un error al enviar email");
        return Observable.throw(error);
      }
    );
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
