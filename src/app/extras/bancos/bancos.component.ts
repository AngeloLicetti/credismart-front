import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { CrudBancoComponent } from './crud-banco/crud-banco.component';
import { ToastrService } from 'ngx-toastr';
import { SolicitudesService } from 'src/app/services/solicitudes.service';

@Component({
  selector: 'app-bancos',
  templateUrl: './bancos.component.html',
  providers:[SolicitudesService]
})
export class BancosComponent implements OnInit {
  public listBancos = [];

  constructor(public _modalDialog: MatDialog,
    public toastr: ToastrService,
    public _solicitud: SolicitudesService
  ) { }

  ngOnInit() {
    this.getBancos();
  }
  getBancos() {
    this._solicitud.getBancos().subscribe(data => {
      if (data.estado == 1) {
        this.listBancos = data.bancoList;

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
  goCrud(e, op) {
    const dialogRef = this._modalDialog.open(CrudBancoComponent, {
      autoFocus: false,
      minWidth:'30%',
      maxWidth: '86%',
      disableClose: true,
    });
    dialogRef.componentInstance.e = e;
    dialogRef.componentInstance.op = op;
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.getBancos();
      }
    });
  }
  deleteBanco(e){
    let par={
      idBanco:e.idBanco
    }
    this._solicitud.eliminarBanco(par).subscribe(data => {
      if (data.confirmacion.id == 1) {
        this.getBancos();
      } else {
        this.toastr.warning("Banco utilizado en los pagos");
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
