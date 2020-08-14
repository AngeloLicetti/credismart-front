import { Component, OnInit } from '@angular/core';
import { MenuPrincipalService } from '../sidebar/services/menu-principal.service';
import { ToastrService } from 'ngx-toastr';
import { getCodUsuario } from '../shared/auth/storage/cabecera.storage';
import { isInvalid } from '../shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  providers: [MenuPrincipalService]
})
export class CambiarContrasenaComponent {

  public contrasenaAct = "";
  public nuevaPassword = "";
  public confirmarPassword = "";
  public type = "password";
  public type2 = "password";
  public type3 = "password";
  public changePassword: any = {};
  constructor(public _menuPrincipalService: MenuPrincipalService,
    public _router: Router,
    public toastr: ToastrService, ) { }


  enter(event) {
    if (event == 'type') {
      this.type = "text";
    }
    if (event == 'type2') {
      this.type2 = 'text';
    }
    if (event == "type3") {
      this.type3 = 'text';
    }
  }
  leave(event) {
    if (event == "type") {
      this.type = 'password';
    }
    if (event == "type2") {
      this.type2 = 'password';
    }
    if (event == "type3") {
      this.type3 = 'password';
    }
  }

  public cambiarContrasena(_controlVar: any) {
    if (isInvalid(_controlVar)) {
      return;
    }
    this.changePassword = {
      "pCodUsuario": getCodUsuario(),
      "pOldPassword": this.contrasenaAct,
      "pNewPassword": this.nuevaPassword
    };
    this._menuPrincipalService.updatePassword(this.changePassword)
      .subscribe(data => {
        if (data.estado == 1) {
          this.toastr.success("Contraseña actualizada", "Exitoso");
          this._router.navigate(['/pages/login']);
        }
        else {
          this.toastr.warning("La actual contraseña no es correcta", "Advertencia");
        }
      },
        error => {
          this.toastr.error("Error al actualizar contraseña, volver a intentar", "Error");
        }),
      err => console.error(err),
      () => console.log('Request Complete');
  }
  public isInvalid(_controlVar: any): boolean {
    return isInvalid(_controlVar);
  }
}
