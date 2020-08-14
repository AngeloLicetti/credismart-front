import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { setInputPattern, setValidatorPattern, setQuantifier, isInvalid } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';
import { PersonalService } from 'src/app/services/personal.service';


@Component({
  selector: 'app-evidencia',
  templateUrl: './evidencia.component.html',

})
export class EvidenciaComponent implements OnInit {
  @Input() e;

  constructor(
    public toastr: ToastrService,
    public _modalDialog: MatDialog,
    public dialogRef: MatDialogRef<EvidenciaComponent>,
  ) { }

  ngOnInit() {
  }

  close(ad?) {
    this.dialogRef.close(ad);
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

  public isInvalid(_ngForm: any): boolean {
    return isInvalid(_ngForm);
  }

}
