import { Routes } from '@angular/router';
import { CobranzasComponent } from './listado/cobranzas.component';
import { VencidosComponent } from './vencidos/vencidos.component';


export const CobranzasRoutes: Routes = [
  {
    path: '',
    children: [
      {
      path: 'listado',
      component: CobranzasComponent
    }
  ]
  },
  {
    path: '',
    children: [{
      path: 'vencidos',
      component: VencidosComponent
    }]
  },
];

