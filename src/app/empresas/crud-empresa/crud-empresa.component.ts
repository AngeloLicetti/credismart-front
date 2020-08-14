import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { MovimientosService } from 'src/app/dashboard/services/movimientos.service';
import { LoginService } from 'src/app/pages/services/login.service';
import { ToastrService } from 'ngx-toastr';
import { getCodUsuario } from 'src/app/shared/auth/storage/cabecera.storage';
import { getToken } from 'src/app/shared/auth/storage/token.storage';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-crud-empresa',
  templateUrl: './crud-empresa.component.html',
  providers: [MovimientosService,LoginService,MessageService]
})
export class CrudEmpresaComponent implements OnInit {
  @Input() e;
  @Input() op;
  @Output() sendIdComprobante = new EventEmitter<string>();
  public listUsu = [];
  public params = {
    empresa: {
      idFinanciera: null,
      abreviatura: null,
      foto: null,
      razonSocial: null,
      ruc: null,
      telefono: null,
      direccion: null,
    }
  }
  public request = {
    user: {
      nombre: null,
      apellido: null,
      correo: null,
      contrasena: null,
      idFinanciera: null
    }
  }
  constructor(public _mov: MovimientosService,
    public _lo: LoginService,
    public _router: Router,
    public _MessageService: MessageService,
    public activatedRoute: ActivatedRoute,
    public toastr: ToastrService ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.op = params['op'];
    });
    this.inicial();
  }
  contactForm() {
    let credenciales = {
      email: this.request.user.correo,
      user:this.request.user.nombre + ' '+ this.request.user.apellido,
      pass: this.request.user.contrasena,
    }
    this._MessageService.sendCrendenciales(credenciales).subscribe((data) => {
      if (data.status == 200) {
        console.log("Email enviado");
      }
    });
  }
  public inicial() {
    if (this.op == 1) {
      this.params.empresa.razonSocial = this.e.razonSocial;
      this.params.empresa.foto = this.e.foto;
      this.params.empresa.ruc = this.e.ruc;
      this.params.empresa.abreviatura = this.e.abreviatura;
      this.params.empresa.idFinanciera = this.e.idFinanciera;
      this.params.empresa.telefono = this.e.telefono;
      this.params.empresa.direccion = this.e.direccion;
      this.getUsuario();
    }
  }
  public generarContraseña() {
    var i;
    var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ12346789#*";
    var contraseña = "";
    for (i = 0; i < 8; i++) { 
      contraseña += caracteres.charAt(Math.floor(Math.random() * caracteres.length)) 
    }
    this.request.user.contrasena=contraseña;
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
      this.params.empresa.foto = result;
    });
  }
  registrarUsuario(idFinanciera) {
    this.request.user.idFinanciera = idFinanciera;
    this._mov.insertarUsuarioEx(this.request.user).subscribe(data => {
      if (data.confirmacion.id == 1) {
        this.registraOauth();
      }
      else {
        this.toastr.warning(data.confirmacion.mensaje, "Advertencia");
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
  public navigate(nav) {
    this._router.navigate(nav, { relativeTo: this.activatedRoute });
  }
  registraOauth() {
    let param = {
      pNoApellidos: this.request.user.apellido,
      pNoClientId: "financiera-frontend",
      pNoCodUsuarioCreador: getCodUsuario(),
      pNoEmail: this.request.user.correo,
      pNoNombres: this.request.user.nombre,
      pNoPassword: this.request.user.contrasena,
      pNoProfe: null,
      pNologin: this.request.user.correo,
      pTokeNCreador: getToken()
    }
    this._lo.insertarUsuarioOauth(param).subscribe(data => {
      if (data.estado == 1) {
        this.toastr.success("Se registró la empresa", "Exitoso");
        this.contactForm();
        let nav = ["/empresas"];
        this.navigate(nav);
      }
      else {
        // this.toastr.success("Advertencia", data.confirmacion.mensaje);
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
  registrar() {
    this.generarContraseña();
    this._mov.insertarEmpresa(this.params).subscribe(data => {
      if (data.confirmacion.id > 1) {
        this.registrarUsuario(data.confirmacion.id);
      }
      else {
        this.toastr.warning(data.confirmacion.mensaje, "Advertencia");
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
    this._mov.actualizarEmpresa(this.params).subscribe(data => {
      if (data.confirmacion.id == 1) {
        this.toastr.success("Se modificó la empresa", "Exitoso");
        let nav = ["/empresas"];
        this.navigate(nav);
      }
      else {
        this.toastr.success(data.confirmacion.mensaje, "Advertencia");
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
  getUsuario() {
    this._mov.getUsuarioFinan(this.params.empresa).subscribe(data => {
      if (data.estado == 1) {
        this.listUsu = data.empleadoList;
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
