import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { getIdUsuario, getFlCliente } from '../shared/auth/storage/cabecera.storage';
import { MenuPrincipalService } from '../sidebar/services/menu-principal.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PersonalService } from '../services/personal.service';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from '../shared/helpers/custom-validators/validators-messages/validators-messages.component';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  providers: [MenuPrincipalService, PersonalService]


})
export class PerfilComponent implements OnInit {
  public request = {
    idEmpleado: null
  }
  public flg;
  public params = {
    idEmpleado: null,
    noNombre: null,
    noApellido: null,
    nuCelular: null,
    feNacimiento: null,
    nuDni: null,
    noDireccion: null,
    cuentaBancaria: null,
    sueldo: null,
    fechaPago: null,
    idBanco: null,
    idTipo: 1,
    foto: null
  }
  constructor(public _modalDialog: MatDialog,
    public toastr: ToastrService,
    public _menuPrincipalService: MenuPrincipalService,
    public _personalService: PersonalService,
    public _router: Router) {
      this.flg=getFlCliente();
  }

  ngOnInit() {
    this.request.idEmpleado = Number(getIdUsuario());
    if (getFlCliente() == '0') {
      this.obtenerDatos();
  }
  else {
      this.ObtenerDatosCliente();
  }
  }
  public show = 0;
  public showEditar;
  public list = [];
  public listPersonal = [];
  obtenerDatos() {
    this._menuPrincipalService.obtenerUsuario(this.request).subscribe(data => {
      if (data.estado == 1) {
        this.list = data.empleadoList;
        this.obtenerEmpleadoId();
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
  ObtenerDatosCliente() {
    let par = {
        idCliente: Number(getIdUsuario())
    };
    this._menuPrincipalService.obtenerUsuarioCliente(par).subscribe(data => {
        if (data.estado == 1) {
            this.show = 1;
            this.list = data.empleadoList;
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
  obtenerEmpleadoId() {
    this._personalService.obtenerEmpleadosId(this.request).subscribe(data => {
      if (data.estado == 1) {
        this.listPersonal = data.empleadoList;
        this.show = 1;
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
  public encodeImageFileAsURL(element) {
    let promise = new Promise((resolve, reject) => {
      let file = element.target.files[0];
      let reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = function () {
        resolve(reader.result);
      }
    });
    return promise;
  }

  esteRecibe(element) {
    this.encodeImageFileAsURL(element).then((result) => {
      this.params.foto = result;
    });
  }
  verDatos() {
    this.params.idEmpleado = this.listPersonal[0].idEmpleado;
    this.params.noNombre = this.listPersonal[0].noNombre;
    this.params.noApellido = this.listPersonal[0].noApellido;
    this.params.nuCelular = this.listPersonal[0].nuCelular;
    this.params.feNacimiento = this.listPersonal[0].feNacimiento;
    this.params.nuDni = this.listPersonal[0].nuDni;
    this.params.noDireccion = this.listPersonal[0].noDireccion;
    this.params.cuentaBancaria = this.listPersonal[0].cuentaBancaria;
    this.params.idBanco = this.listPersonal[0].idBanco;
    this.params.foto = this.listPersonal[0].foto;
    this.showEditar = 1;
  }
  cancelar() {
    this.showEditar = 0;
  }
  actualizar() {
    this._personalService.actualizarEmpleados(this.params).subscribe(data => {
      if (data.estado == 1) {
        if (data.confirmacion.mensaje == '0') {
          this.toastr.info("DNI ya registrado");
        } else if (data.confirmacion.id == 0) {
          this.toastr.info("Edad inválida");
        }
        else {
          this.toastr.success("Se modificó sus datos", "Exitoso");
          this.showEditar = 0;
          this.obtenerDatos();
        }
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
