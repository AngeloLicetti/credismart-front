import { Routes } from '@angular/router';
import { MisPagosComponent } from './mispagos.component';


export const MisPagosRoutes: Routes = [
  {

    path: '',
    children: [
      {
        path: '',
        component: MisPagosComponent
      }
    ]
  }
];


