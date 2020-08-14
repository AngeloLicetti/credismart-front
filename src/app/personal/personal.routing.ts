import { Routes } from '@angular/router';
import { PersonalComponent } from './personal.component';
import { CrudEmpleadoComponent } from './crud-empleado/crud-empleado.component';


export const PersonalRoutes: Routes = [
  {

    path: '',
    children: [
      {
        path: '',
        component: PersonalComponent
      },
      {
        path: 'crudpersonal/:op',
        component: CrudEmpleadoComponent
      }
    ]
  }
];
