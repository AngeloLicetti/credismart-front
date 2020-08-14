import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { InsertLugarComponent } from './insert-lugar/insert-lugar.component';
import { ToastrService } from 'ngx-toastr';
import { SolicitudesService } from 'src/app/services/solicitudes.service';

@Component({
  selector: 'app-lugares',
  templateUrl: './lugares.component.html',
  providers:[SolicitudesService]
})
export class LugaresComponent implements OnInit {

  public listLugares = [];
  constructor(public _modalDialog: MatDialog,
    public toastr: ToastrService,
    public _solicitud: SolicitudesService) { }

  ngOnInit() {
    this.getLugares();
  }
  getLugares() {
    this._solicitud.getLugares().subscribe(data => {
      if (data.estado == 1) {
        this.listLugares = data.lugarList;
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
    const dialogRef = this._modalDialog.open(InsertLugarComponent, {
      autoFocus: false,
      minWidth:'30%',
      maxWidth: '86%',
      disableClose: true,
    });
    dialogRef.componentInstance.e = e;
    dialogRef.componentInstance.op = op;
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.getLugares();
      }
    });
  }
  deleteLugar(e){
    let par={
      idLugar:e.idLugar
    }
    this._solicitud.eliminarLugar(par).subscribe(data => {
      if (data.confirmacion.id == 1) {
        this.getLugares();
      } else {
        this.toastr.warning("Lugar utilizado en los préstamos");
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
