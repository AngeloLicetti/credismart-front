import { Routes } from '@angular/router';

import { ClientesComponent } from './clientes.component';
import { CrudClienteComponent } from './crud-cliente/crud-cliente.component';

export const ClientesRoutes: Routes = [
  {

    path: '',
    children: [
      {
        path: '',
        component: ClientesComponent
      },
      {
        path: 'crudcliente/:op',
        component: CrudClienteComponent
      },
    ]
  }
];
