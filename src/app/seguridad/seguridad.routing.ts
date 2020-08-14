import { Routes } from '@angular/router';
import { SeguridadContentComponent } from './seguridad-content.component';
import { CrudUsuariosComponent } from './crud-usuarios/crud-usuarios.component';
import { CrudEmpresaComponent } from './crud-empresa/crud-empresa.component';


export const SeguridadRoutes: Routes = [
  {

    path: '',
    children: [
      {
        path: '',
        component: SeguridadContentComponent
      },
      {
        path: 'crudusuarios/:op',
        component: CrudUsuariosComponent
      },      {
        path: 'crudempresa',
        component: CrudEmpresaComponent
      }
    ]
  }
];
