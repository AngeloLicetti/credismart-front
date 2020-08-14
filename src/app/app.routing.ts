import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

export const AppRoutes: Routes = [
    {
        path: '',
        // redirectTo: 'pages/register',
        redirectTo: '/',
        pathMatch: 'full',
    },

    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: './dashboard/dashboard.module#DashboardModule'
            }, {
                path: 'seguridad',
                loadChildren: './seguridad/seguridad.module#SeguridadModule'
            }, {
                path: 'extras',
                loadChildren: './extras/extras.module#ExtrasModule'
            }, {
                path: 'solicitudes',
                loadChildren: './solicitudes/solicitudes.module#SolicitudesModule'
            }, {
                path: 'clientes',
                loadChildren: './clientes/clientes.module#ClientesModule'
            }, {
                path: 'prestamos',
                loadChildren: './prestamos/prestamos.module#PrestamosModule'
            }, {
                path: 'cobranzas',
                loadChildren: './cobranzas/cobranzas.module#CobranzasModule'
            },
            {
                path: 'pagos',
                loadChildren: './pagos/pagos.module#PagosModule'
            },
            {
                path: 'caja',
                loadChildren: './caja/caja.module#CajaModule'
            },
            {
                path: 'empresas',
                loadChildren: './empresas/empresas.module#EmpresasModule'
            },
            {
                path: 'personal',
                loadChildren: './personal/personal.module#PersonalModule'
            },
            {
                path: 'menu',
                loadChildren: './menu/menu.module#MenuModule'
            },
            {
                path: 'charts',
                loadChildren: './charts/charts.module#ChartsModule'
            }
            ,
            {
                path: 'misprestamos',
                loadChildren: './misprestamos/misprestamos.module#MisPrestamosModule'
            } ,
            {
                path: 'mispagos',
                loadChildren: './mispagos/mispagos.module#MisPagosModule'
            },
            {
                path: 'misolicitudes',
                loadChildren: './misolicitudes/misolicitudes.module#MiSolicitudesModule'
            }
        ]
    }, {
        path: '',
        component: AuthLayoutComponent,
        children: [{
            path: 'pages',
            loadChildren: './pages/pages.module#PagesModule'
        }]
    }
];
