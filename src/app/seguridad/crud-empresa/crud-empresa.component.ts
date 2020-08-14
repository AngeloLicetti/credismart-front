import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MovimientosService } from 'src/app/dashboard/services/movimientos.service';
import { ToastrService } from 'ngx-toastr';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { ActivatedRoute, Router } from '@angular/router';
import { getIpress } from 'src/app/shared/auth/storage/cabecera.storage';

@Component({
  selector: 'app-crud-empresa',
  templateUrl: './crud-empresa.component.html',
  providers: [MovimientosService]
})
export class CrudEmpresaComponent implements OnInit {
  public empresasList = [];

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

  constructor(public _mov: MovimientosService,
    public _router: Router,
    public activatedRoute: ActivatedRoute,
    public toastr: ToastrService ) { }

  ngOnInit() {
    this.getEmpresas();
  }

  public inicial() {
      this.params.empresa.idFinanciera = this.empresasList[0].idFinanciera;
      this.params.empresa.razonSocial = this.empresasList[0].razonSocial;
      this.params.empresa.foto = this.empresasList[0].foto;
      this.params.empresa.ruc = this.empresasList[0].ruc;
      this.params.empresa.abreviatura = this.empresasList[0].abreviatura;
      this.params.empresa.telefono = this.empresasList[0].telefono;
      this.params.empresa.direccion = this.empresasList[0].direccion;
  }
  public getEmpresas() {
    let par={
      idFinanciera:getIpress()
    }
    this._mov.getEmpresas(par)
      .subscribe(data => {
        if (data.estado == 1) {
          this.empresasList = data.empresaList;
          this.inicial();
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
    this.empresasList[0].encodeImageFileAsURL(element).then((result) => {
      this.params.empresa.foto = result;
    });
  }

  public navigate(nav) {
    this._router.navigate(nav, { relativeTo: this.activatedRoute });
  }


  actualizar() {
    this._mov.actualizarEmpresa(this.params).subscribe(data => {
      if (data.confirmacion.id == 1) {
        this.toastr.success("Se modificó los datos de la empresa", "Exitoso");
        let nav = ["/seguridad"];
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
