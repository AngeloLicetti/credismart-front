import { Routes } from '@angular/router';
import { ListadoComponent } from './listado/listado.component';
import { CrudSolicitudComponent } from './crud-solicitud/crud-solicitud.component';
import { HistorialComponent } from './historial/historial.component';


export const SolicitudesRoutes: Routes = [
  {

    path: '',
    children: [
      {
        path:'listado',
        component: ListadoComponent
      },
      {
        path: 'listado/crudsolicitudes/:op',
        component: CrudSolicitudComponent
      },
    ]
  },
  {
    path: '',
    children: [{
      path: 'historial',
      component: HistorialComponent
    }]
  },];
