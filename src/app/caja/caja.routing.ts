import { Routes } from '@angular/router';
import { GastosComponent } from './gastos/gastos.component';
import { ListadoComponent } from './listado/listado.component';

export const CajaRoutes: Routes = [
  {
    path: '',
    children: [
      {
      path: 'listado',
      component: ListadoComponent
    }
    // {
    //   path: 'listado/crudprestamos/:op',
    //   component: CrudPrestamosComponent
    // }
  ]
  },
  {
    path: '',
    children: [{
      path: 'gastos',
      component: GastosComponent
    }]
  },
];
