import { MatDialog } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { PersonalService } from '../services/personal.service';
import { LoginService } from '../pages/services/login.service';
import { MovimientosService } from '../dashboard/services/movimientos.service';
import { ToastrService } from 'ngx-toastr';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from '../shared/helpers/custom-validators/validators-messages/validators-messages.component';
import swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { log } from 'util';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  providers: [LoginService, MovimientosService, PersonalService]
})
export class PersonalComponent implements OnInit {

  public empleadoList = [];
  public disabledN = false;
  public disabledD = false;
  public show = 0;
  public params = {
    docide: null,
    nombre: null
  }
  public _params = {
    idEmpleado: null,
    opcion: null
  }
  @BlockUI() blockUI: NgBlockUI;

  constructor(public _modalDialog: MatDialog,
    public toastr: ToastrService,
    public _lo: LoginService,
    public _mov: MovimientosService,
    public _personal: PersonalService) {

  }

  ngOnInit() {
    this.getEmpleado();
  }

  busqueda(target) {
    this.disabledD = false;
    if (target.length % 2 == 0) {
      this.disabledD = true;
      this.getEmpleado();
    }
    if (target.length == 0) {
      this.disabledD = false;
    }
  }

  busquedaDNI(target) {
    this.disabledN = false;
    if (target.length % 8 == 0) {
      this.disabledN = true;
      this.getEmpleado();
    }
    if (target.length == 0) {
      this.disabledN = false;
    }
  }
  clear() {
    this.params.nombre = null;
    this.params.docide = null;
    this.getEmpleado();
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

  public getEmpleado() {
    this.blockUI.start('Cargando...'); // Start blocking
    this._personal.obtenerAllEmpleados(this.params)
      .subscribe(data => {
        this.blockUI.stop(); // Stop blocking
        if (data.estado == 1) {
          this.empleadoList = data.empleadoList;
          this.show = 1;
          this.empleadoList.forEach(element => {
            if (element.estado == 1) {
              element["isChecked"] = true;
            }
            else {
              element["isChecked"] = false;
            }
          });
        }
        else {
          console.log("No se pudo encontrar los empleados");
        }
        return true;
      },
        error => {
          console.error(error);
        },
        () => {
        });
  }
  toggle(evento, e) {
    if (evento.checked == false) {
      this.deleteEmpleado(e);
    }
    else {
      this.activar(e);
    }
  }
  deleteEmpleado(e) {
    swal({
      title: '¿Estás seguro?',
      text: 'Desea desactivar al personal ' + e.noNombre + " " + e.noApellido + ' !',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this._params.idEmpleado = e.idEmpleado;
        this._params.opcion = 0;
        this._personal.eliminarEmpleados(this._params).subscribe(data => {
          if (data.estado == 1) {
            if (data.confirmacion.id == 1) {

              swal(
                {
                  title: 'Inactivo!',
                  text: 'El personal ' + e.noNombre + " " + e.noApellido + ' ahora está inactivo !',
                  type: 'success',
                  confirmButtonClass: "btn btn-success",
                  buttonsStyling: false
                }
              )
              this.getEmpleado();

            } else {
              swal({
                title: 'Cancelado',
                text: 'El personal tiene cobranza asignada!',
                type: 'error',
                confirmButtonClass: "btn btn-info",
                buttonsStyling: false
              }).catch(swal.noop)
              e.isChecked = true;
              return;
            }
          }
          else {
            swal({
              title: 'Cancelado',
              text: 'Primero debe eliminar el usuario de ' + e.noNombre + " " + e.noApellido + ' !',
              type: 'error',
              confirmButtonClass: "btn btn-info",
              buttonsStyling: false
            }).catch(swal.noop)
          }

          return true;
        },
          error => {
            console.error(error);
            return Observable.throw(error);
          }
        )
      }
      else {
        e.isChecked = true;
      }
    })

  }
  activar(e) {
    swal({
      title: '¿Estás seguro?',
      text: 'Desea activar al personal ' + e.noNombre + " " + e.noApellido + ' !',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this._params.idEmpleado = e.idEmpleado;
        this._params.opcion = 1;
        this._personal.eliminarEmpleados(this._params).subscribe(data => {
          console.log(data);
          if (data.estado == 1) {
            if (data.confirmacion.id == 1) {

              swal(
                {
                  title: 'Activo!',
                  text: 'El personal ' + e.noNombre + " " + e.noApellido + ' ahora está activo !',
                  type: 'success',
                  confirmButtonClass: "btn btn-success",
                  buttonsStyling: false
                }
              )
              this.getEmpleado();

            }
          }
          return true;
        },
          error => {
            console.error(error);
            return Observable.throw(error);
          }
        )
      }
      else {
        e.isChecked = false;
      }
    })

  }
}
