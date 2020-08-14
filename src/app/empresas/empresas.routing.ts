import { Routes } from '@angular/router';
import { EmpresasComponent } from './empresas.component';
import { CrudEmpresaComponent } from './crud-empresa/crud-empresa.component';


export const EmpresasRoutes: Routes = [
  {

    path: '',
    children: [
      {
        path: '',
        component: EmpresasComponent
      },
      {
        path: 'crudempresas/:op',
        component: CrudEmpresaComponent
      }
    ]
  }
];
