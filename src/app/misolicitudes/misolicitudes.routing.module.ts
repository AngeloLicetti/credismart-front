import { Routes } from '@angular/router';
import { MiSolicitudesComponent } from './misolicitudes.component';
import { CrudSolicitudComponent } from './crud-solicitud/crud-solicitud.component';


export const MiSolicitudesRoutes: Routes = [
  {

    path: '',
    children: [
      {
        path: '',
        component: MiSolicitudesComponent
      }
      ,
      {
        path: 'formulario/:op',
        component: CrudSolicitudComponent
      }
    ]
  }
];


