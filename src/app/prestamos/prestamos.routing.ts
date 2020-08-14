import { Routes } from '@angular/router';
import { HistorialComponent } from './historial/historial.component';
import { ListadoComponent } from './listado/listado.component';
import { CrudPrestamosComponent } from './crud-prestamos/crud-prestamos.component';

export const PrestamosRoutes: Routes = [
  {
    path: '',
    children: [
      {
      path: 'listado',
      component: ListadoComponent
    },
    {
      path: 'listado/crudprestamos/:op',
      component: CrudPrestamosComponent
    }
  ]
  },
  {
    path: '',
    children: [{
      path: 'historial',
      component: HistorialComponent
    }]
  },
];
