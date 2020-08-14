import { Routes } from '@angular/router';
import { ListadoComponent } from './listado/listado.component';
import { TarjetaControlComponent } from './tarjeta/tarjeta-control.component';

export const MisPrestamosRoutes: Routes = [
  {
    path: '',
    children: [
      {
      path: '',
      component: ListadoComponent
    },
    {
      path: 'tarjeta/:op',
      component: TarjetaControlComponent
    }
  ]
  }
];
