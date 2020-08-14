import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { ToastrService } from 'ngx-toastr';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';

@Component({
  selector: 'app-register-cmp',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [MessageService]

})

export class RegisterComponent implements OnInit, OnDestroy {
  test: Date = new Date();
  constructor(public _MessageService: MessageService, public toast: ToastrService) { }
  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('register-page');
    body.classList.remove('off-canvas-sidebar');
  }
  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('register-page');
    body.classList.add('off-canvas-sidebar');
  }
  contactForm(form) {
    this._MessageService.sendMessage(form).subscribe((data) => {
      if(data.status==200){
        this.toast.success("Mensaje enviado");
      }
      else{
        this.toast.warning("No se pudo enviar el mensaje, volver a intentar");
      }
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
