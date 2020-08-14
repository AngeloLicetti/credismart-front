import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { MovimientosService } from '../dashboard/services/movimientos.service';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from '../shared/helpers/custom-validators/validators-messages/validators-messages.component';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  providers:[MovimientosService]
})
export class EmpresasComponent implements OnInit {
  public empresasList = [];
  public show = 0;
  public params = {
    razonSocial: null,
    idFinanciera:null
  }

  constructor(public _modalDialog: MatDialog,
    public toastr: ToastrService,
    public _mov: MovimientosService) { }

  ngOnInit() {
    this.getEmpresas();
  }
  busqueda(target) {
    if (target.length % 2 == 0) {
      this.getEmpresas();
    }
  }
  public getEmpresas() {
    this._mov.getEmpresas(this.params)
      .subscribe(data => {
        if (data.estado == 1) {
          this.empresasList = data.empresaList;
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
