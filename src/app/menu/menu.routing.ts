import { Routes } from '@angular/router';
import { PerfilComponent } from './perfil.component';
import { CambiarContrasenaComponent } from './cambiar-contrasena.component';


export const MenuRoutes: Routes = [
  {
    path: '',
    children: [
      {
      path: 'perfil',
      component: PerfilComponent
    },
    {
      path: 'cambiarcontrasena',
      component: CambiarContrasenaComponent
    }
  ]
  }
];
