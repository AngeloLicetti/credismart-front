import { Routes } from '@angular/router';
import { PagosComponent } from './pagos.component';


export const PagosRoutes: Routes = [
  {

    path: '',
    children: [
      {
        path: '',
        component: PagosComponent
      }
    ]
  }
];


