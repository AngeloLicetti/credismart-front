import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MovimientosService } from 'src/app/dashboard/services/movimientos.service';
import { LoginService } from 'src/app/pages/services/login.service';
import { ToastrService } from 'ngx-toastr';
import { getCodUsuario } from 'src/app/shared/auth/storage/cabecera.storage';
import { getToken } from 'src/app/shared/auth/storage/token.storage';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-crud-usuarios',
  templateUrl: './crud-usuarios.component.html',
  providers: [MovimientosService, LoginService, MessageService]
})
export class CrudUsuariosComponent implements OnInit {
  @Input() e;
  constructor(public _lo: LoginService,
    public _router: Router,
    public _mov: MovimientosService,
    public _MessageService: MessageService,
    public activatedRoute: ActivatedRoute,
    public toastr: ToastrService) { }
  public roles = [];
  public titulo = "";
  public personal = [];
  public op;
  public params = {
    correo: null,
    idEmpleado: null,
    idRol: null,
    contrasena: null,
    nombre: null,
    apellido: null,
    flCliente: 0
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.op = params['op'];
    });
    if (this.op == 0) {
      this.titulo = "Crear Usuario";
    }
    else {
      this.titulo = "Cambiar Rol"
      this.getUsuarios();

    }
    this.getRoles();
    this.getPersonal();
  }
  public userList = [];
  public getUsuarios() {
    let aux = [];
    this._mov.getUsuariosInternos()
      .subscribe(data => {
        if (data.estado == 1) {
          aux = data.seguridadList;
          aux.forEach(element => {
            if (element.idUsuario == this.op) {
              this.userList.push(element);
            }
          });
        }
        else {
          console.log("No se pudo encontrar las empresas");
        }
        return true;
      },
        error => {
          console.error(error);
        },
        () => {
        });
  }
  public getRoles() {
    this._mov.getRoles()
      .subscribe(data => {
        if (data.estado == 1) {
          this.roles = data.rolList;
        }
        else {
          console.log("No se pudo encontrar los roles");
        }
        return true;
      },
        error => {
          console.error(error);
        },
        () => {
        });
  }
  public getPersonal() {
    this._mov.getPersonalUsuario()
      .subscribe(data => {
        if (data.estado == 1) {
          this.personal = data.empleadoList;
        }
        else {
          console.log("No se pudo encontrar personal");
        }
        return true;
      },
        error => {
          console.error(error);
        },
        () => {
        });
  }
  public getEmpleado(el) {
    this.personal.forEach(element => {
      if (element.idEmpleado == el) {
        this.params.nombre = element.noNombre;
        this.params.apellido = element.noApellido;
      }
    });
  }
  contactForm() {
    let credenciales = {
      email: this.params.correo,
      user: this.params.nombre,
      pass: this.params.contrasena,
    }
    this._MessageService.sendCrendenciales(credenciales).subscribe((data) => {
      if (data.status == 200) {
        console.log("Email enviado");
      }
    });
  }
  public generarContraseña() {
    var i;
    var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ12346789#*";
    var contraseña = "";
    for (i = 0; i < 8; i++) {
      contraseña += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    }
    this.params.contrasena = contraseña;
  }
  public registraOauth() {
    let param = {
      pNoApellidos: this.params.apellido,
      pNoClientId: "financiera-frontend",
      pNoCodUsuarioCreador: getCodUsuario(),
      pNoEmail: this.params.correo,
      pNoNombres: this.params.nombre,
      pNoPassword: this.params.contrasena,
      pNoProfe: null,
      pNologin: this.params.correo,
      pTokeNCreador: getToken()
    }
    this._lo.insertarUsuarioOauth(param).subscribe(data => {
      if (data.estado == 1) {
        this.toastr.success("Se registró al usuario", "Exitoso");
        this.contactForm();
        this._router.navigate(['/seguridad']);
      }
      else {
        //  this.toastr.success("Advertencia", data.confirmacion.mensaje);
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
  public registrar() {
    this.generarContraseña();
    this._mov.insertarUsuarioInterno(this.params).subscribe(data => {
      if (data.confirmacion.id == 1) {
        this.registraOauth();
      }
      else {
        this.toastr.warning("Usuario en uso", "Advertencia");
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
