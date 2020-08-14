import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { setQuantifier, setValidatorPattern, setInputPattern, isInvalid } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { ToastrService } from 'ngx-toastr';
import { ClientesService } from 'src/app/services/clientes.service';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { Router, Params, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { MovimientosService } from 'src/app/dashboard/services/movimientos.service';
import { getToken } from 'src/app/shared/auth/storage/token.storage';
import { getCodUsuario } from 'src/app/shared/auth/storage/cabecera.storage';
import { LoginService } from 'src/app/pages/services/login.service';
var oComponent: CrudClienteComponent;
@Component({
  selector: 'app-crud-cliente',
  templateUrl: './crud-cliente.component.html',
  providers: [ClientesService, SolicitudesService, MovimientosService, MessageService, LoginService]
})
export class CrudClienteComponent implements OnInit {

  public vi = { op: null }
  public params = {
    feNacimiento: null,
    idCliente: null,
    noDireccion: null,
    noOcupacion: null,
    noCliente: null,
    noEmail: null,
    nuCelular: null,
    nuDocide: '',
    noReferencia: null,
    opVivienda: null,
    idSexo: null,
    idEmpleado: null,
    idEstadoCivil: null,
    idTipoDocide: null,
    nuCelular2: null,
    nuTelefono: null,
    idProvincia: null,
    idDepartamento: null,
    idDistrito: null
  }
  public tipoDoc = [];
  public departamentos = [];
  public provincias = [];
  public distritos = [];
  public sexoList = [];
  public estadoList = [];
  public empleadoList = [];
  public clienteList = [];
  constructor(public _modalDialog: MatDialog,
    public _cliente: ClientesService,
    public toastr: ToastrService,
    public _router: Router,
    public _mov: MovimientosService,
    public _lo: LoginService,
    public _MessageService: MessageService,
    public activatedRoute: ActivatedRoute,
    public _solicitud: SolicitudesService) { }
  public titulo;
  public op;
  ngOnInit() {
    oComponent = this;
    this.getTiposDocumentos();
    this.getEstadoCivil();
    this.getSexo();
    this.getEmpleados();
    this.getDepartamentos();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.op = params['op'];
    });
    if (this.op == 0) {
      this.titulo = "Registrar Cliente"
    }
    else {
      this.titulo = "Modificar Cliente"
      this.getCliente();
    }
  }
  public longitudDocumento = null;
  public changeInput(tipoDoc) {
    if (this.params.idTipoDocide == 1) {
      this.longitudDocumento = 8;
    }
    if (this.params.idTipoDocide == 2) {
      this.longitudDocumento = 12;
    }
    if (this.params.idTipoDocide == 3) {
      this.longitudDocumento = 11;
    }
  }
  getTiposDocumentos() {
    this._solicitud.getTipoDocumento().subscribe(data => {
      if (data.estado == 1) {
        this.tipoDoc = data.documentoList;
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
  getSexo() {
    this._solicitud.getSexo().subscribe(data => {
      if (data.estado == 1) {
        this.sexoList = data.sexoList;
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
  getDepartamentos() {
    this._solicitud.getDepartamentos().subscribe(data => {
      if (data.estado == 1) {
        this.departamentos = data.depaList;
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
  getProvincias() {
    this._solicitud.getProvincias(this.params).subscribe(data => {
      if (data.estado == 1) {
        this.provincias = data.proList;
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
  getDistritos() {
    this._solicitud.getDistritos(this.params).subscribe(data => {
      if (data.estado == 1) {
        this.distritos = data.disList;
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
  getEstadoCivil() {
    this._solicitud.getEstadoCivil().subscribe(data => {
      if (data.estado == 1) {
        this.estadoList = data.estadoCivilList;
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
  getEmpleados() {
    this._cliente.getComboEmpleado().subscribe(data => {
      if (data.estado == 1) {
        this.empleadoList = data.empleadoList;
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
  getCliente() {
    let par = {
      idCliente: this.op
    }
    this._cliente.getClienteId(par).subscribe(data => {
      if (data.estado == 1) {
        this.clienteList = data.data;
        this.params.idCliente = this.clienteList[0].idCliente;
        this.params.idTipoDocide = this.clienteList[0].idTipoDocide;
        if (this.params.idTipoDocide != 3) {
          this.params.feNacimiento = this.clienteList[0].feNacimiento;
          this.vi.op = String(this.clienteList[0].opVivienda);
          this.params.idEstadoCivil = this.clienteList[0].estadoCivil.idEstadoCivil;
          this.params.idSexo = this.clienteList[0].sexo.idSexo;
        }
        this.params.noCliente = this.clienteList[0].noCliente;
        this.params.nuDocide = this.clienteList[0].nuDocide;
        this.params.noDireccion = this.clienteList[0].noDireccion;
        this.params.noOcupacion = this.clienteList[0].noOcupacion;
        this.params.nuCelular = this.clienteList[0].nuCelular;
        this.params.noEmail = this.clienteList[0].noEmail;
        this.params.noReferencia = this.clienteList[0].noReferencia;
        this.params.idEmpleado = this.clienteList[0].idEmpleado;
        this.params.nuCelular2 = this.clienteList[0].nuCelular2;
        this.params.nuTelefono = this.clienteList[0].nuTelefono;
        this.params.idDepartamento = this.clienteList[0].idDepartamento;
        if (this.params.idDepartamento != null) {
          this.getProvincias();
          this.params.idProvincia = this.clienteList[0].idProvincia;
          this.getDistritos();
          this.params.idDistrito = this.clienteList[0].idDistrito;
        }

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

  goClientes() {
    let _params: NavigationExtras = {
      queryParams: {
        nuDocide: (this.params.nuDocide),
      }
    }
    this._router.navigate(['/clientes'], _params);
  }
  registrar() {
    if (this.vi.op = "1") {
      this.params.opVivienda = 1;
    }
    if (this.vi.op = "0") {
      this.params.opVivienda = 0;
    }
    this._cliente.insertarCliente(this.params).subscribe(data => {
      if (data.estado == 1) {
        if (data.confirmacion.mensaje == '0') {
          this.toastr.info("DNI ya registrado");
        } else if (data.confirmacion.id == 0) {
          this.toastr.info("Edad inválida");
        }
        else {
          this.toastr.success("Se registró el cliente", "Exitoso");
          oComponent.goClientes();
          // this.regresar();
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
  actualizar() {

    if (this.vi.op = "1") {
      this.params.opVivienda = 1;
    }
    if (this.vi.op = "0") {
      this.params.opVivienda = 0;
    }
    this._cliente.actualizarCliente(this.params).subscribe(data => {
      if (data.confirmacion.id == 1) {
        this.toastr.success("Se modificó el cliente", "Exitoso");
        oComponent.goClientes();
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
  contactForm() {
    let credenciales = {
      email: this.params.noEmail,
      user: this.params.noCliente,
      pass: this.contrasena,
    }
    this._MessageService.sendCrendenciales(credenciales).subscribe((data) => {
      if (data.status == 200) {
        console.log("Email enviado");
      }
    });
  }
  public contrasena;
  public generarContraseña() {
    var i;
    var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ12346789#*";
    var contraseña = "";
    for (i = 0; i < 8; i++) {
      contraseña += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    }
    this.contrasena = contraseña;
  }
  public registraOauth() {
    let param = {
      pNoApellidos: '',
      pNoClientId: "financiera-frontend",
      pNoCodUsuarioCreador: getCodUsuario(),
      pNoEmail: this.params.noEmail,
      pNoNombres: this.params.noCliente,
      pNoPassword: this.contrasena,
      pNoProfe: null,
      pNologin: this.params.noEmail,
      pTokeNCreador: getToken()
    }
    this._lo.insertarUsuarioOauth(param).subscribe(data => {
      console.log(data);
      if (data.estado == 1) {
        this.toastr.success("Se registró al usuario", "Exitoso");
        this.contactForm();
        this._router.navigate(['/clientes']);
      }
      else {
        this.contactForm();
        this.toastr.success("Se registró al usuario", "Exitoso");
        this._router.navigate(['/clientes']);
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
  public registrarUsuario() {
    this.generarContraseña();
    let par = {
      correo: this.params.noEmail,
      idEmpleado: this.op,
      idRol: 7,
      contrasena: this.contrasena,
      nombre: this.params.noCliente,
      apellido: '',
      flCliente: 1
    }
    this._mov.insertarUsuarioInterno(par).subscribe(data => {
      if (data.confirmacion.id == 1) {
        this.registraOauth();
      }
      else {
        this.toastr.warning("Correo ya registrado", "Advertencia");
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
}
