import { Routes } from '@angular/router';
import { ProformaComponent } from './proforma/proforma.component';
import { BancosComponent } from './bancos/bancos.component';
import { LugaresComponent } from './lugares/lugares.component';


export const ExtrasRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'proforma',
      component: ProformaComponent
    }]
  }
  , {
    path: '',
    children: [{
      path: 'bancos',
      component: BancosComponent
    }]
  }
  , {
    path: '',
    children: [{
      path: 'lugares',
      component: LugaresComponent
    }]
  }
  // , {
  //     path: '',
  //     children: [ {
  //         path: 'wizard',
  //         component: WizardComponent
  //     }]
  // }
];
