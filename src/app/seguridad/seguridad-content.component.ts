import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { LoginService } from '../pages/services/login.service';
import { MovimientosService } from '../dashboard/services/movimientos.service';
import { ToastrService } from 'ngx-toastr';
import { getIpress, getCodUsuario } from '../shared/auth/storage/cabecera.storage';
import { getToken } from '../shared/auth/storage/token.storage';
import swal from 'sweetalert2';
@Component({
  selector: 'app-seguridad-content',
  templateUrl: './seguridad-content.component.html',
  providers: [LoginService, MovimientosService]
})
export class SeguridadContentComponent implements OnInit {
  public empresasList = [];
  public userList = [];
  public params = {
    razonSocial: null,
    idFinanciera: null
  }
  constructor(public _lo: LoginService,
    public _mov: MovimientosService,
    public toastr: ToastrService,
    public _modalDialog: MatDialog) { }
  public show = 0;
  ngOnInit() {
    this.getEmpresas();
    this.getUsuarios();
  }
  public getEmpresas() {
    this.show = 0;
    this.params.idFinanciera = getIpress();
    this._mov.getEmpresas(this.params)
      .subscribe(data => {
        if (data.estado == 1) {
          this.empresasList = data.empresaList;
          this.show = 1;
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
  public showUsser = 0;
  public getUsuarios() {
    this.showUsser = 0;
    this.params.idFinanciera = getIpress();
    this._mov.getUsuariosInternos()
      .subscribe(data => {
        if (data.estado == 1) {
          this.userList = data.seguridadList;
          this.showUsser = 1;
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

  eliminarUsuarioInterno(e) {
    let request = {
      correo: e.idUsuario
    }
    this._mov.eliminarUsuario(request).subscribe(data => {
      if (data.confirmacion.id == 1) {
        this.getUsuarios();

      } else {
        this.toastr.warning("No se puede eliminar al usuario");
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
  deleteUsuario(e) {
    let param = {
      pNoCodUsuarioCreador: getCodUsuario(),
      pNologin: e.idUsuario,
      pTokeNCreador: getToken()
    }
    swal({
      title: '¿Estás seguro?',
      text: 'Desea eliminar al usuario ' + e.idUsuario + ' !',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this._lo.eliminarUsuarioOauth(param).subscribe(data => {
          if (data.estado == 1) {
            this.eliminarUsuarioInterno(e);
            swal(
              {
                title: 'Eliminado!',
                text: 'El usuario ' + e.idUsuario + ' ha sido eliminado !',
                type: 'success',
                confirmButtonClass: "btn btn-success",
                buttonsStyling: false
              }
            )
          } else {
            swal({
              title: 'Cancelado',
              text: 'No se puede eliminar el usuario!',
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
    })
  }
}
