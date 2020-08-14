import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PersonalService } from '../../services/personal.service';
import { Observable } from 'rxjs';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { ToastrService } from 'ngx-toastr';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
var oComponent: CrudEmpleadoComponent;


@Component({
  selector: 'app-crud-empleado',
  templateUrl: './crud-empleado.component.html',
  providers: [PersonalService, SolicitudesService]
})
export class CrudEmpleadoComponent implements OnInit {
  @Input() op;
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
  public listPersonal = [];
  public bancoList = [];
  public titulo;
  public request = {
    idEmpleado: null
  }
  constructor(public _modalDialog: MatDialog,
    public toastr: ToastrService,
    public _router: Router,
    public activatedRoute: ActivatedRoute,
    public _personal: PersonalService,
    public _solicitud: SolicitudesService) { }

  ngOnInit() {
    oComponent = this;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.op = params['op'];
    });
    this.getBanco();
    this.inicial();
  }
  public navigate(nav) {
    this._router.navigate(nav, { relativeTo: this.activatedRoute });
  }
  registrar() {
    this._personal.insertarEmpleados(this.params).subscribe(data => {
      if (data.estado == 1) {
        if (data.confirmacion.mensaje == '0') {
          this.toastr.info("DNI ya registrado");
          return;
        } else if (data.confirmacion.id == 0) {
          this.toastr.info("Edad inválida");
          return;
        }
        else {
          this.toastr.success("Se registró el personal", "Exitoso");
          let nav = ["/personal"];
          oComponent.navigate(nav);
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
    this._personal.actualizarEmpleados(this.params).subscribe(data => {
      if (data.estado == 1) {
        if (data.confirmacion.mensaje == '0') {
          this.toastr.info("DNI ya registrado");
        } else if (data.confirmacion.id == 0) {
          this.toastr.info("Edad inválida");
        }
        else {
          this.toastr.success("Se modificó el personal", "Exitoso");
          let nav = ["/personal"];
          oComponent.navigate(nav);
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
  obtenerEmpleadoId() {
    this.request.idEmpleado = this.op;
    this._personal.obtenerEmpleadosId(this.request).subscribe(data => {
      if (data.estado == 1) {
        this.listPersonal = data.empleadoList;
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
  public inicial() {
    if (this.op != 0) {
      this.titulo = "Modificar Personal";
      this.obtenerEmpleadoId();
    }
    else {
      this.titulo = "Registrar Personal";
    }
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

}
