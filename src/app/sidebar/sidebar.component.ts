import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { Router } from '@angular/router';
import { removeSession, getToken } from '../shared/auth/storage/token.storage';
import { getIdUsuario, getFlCliente } from '../shared/auth/storage/cabecera.storage';
import { Observable } from 'rxjs';
import { MenuPrincipalService } from './services/menu-principal.service';

declare const $: any;

//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}


@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
    providers: [MenuPrincipalService]

})

export class SidebarComponent implements OnInit {
    public menuItems=[];
    ps: any;
    public flCliente = null;
    constructor(
        public _router: Router,
        public _menuPrincipalService: MenuPrincipalService,
    ) {
        this.flCliente = getFlCliente();
    }
    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    ngOnInit() {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            this.ps = new PerfectScrollbar(elemSidebar);
        }
        if (getToken() == null) {
            this._router.navigate(['/pages/register']);
        }
        else {
            if (this.flCliente == '0') {
                this.ObtenerDatosEmpleado();
            }
            else {
                this.ObtenerDatosCliente();
            }
            this.GetMenuByUsuario();
        }
        // console.clear();
    }
    updatePS(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            this.ps.update();
        }
    }
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }

    CerrarSesion() {
        removeSession();
        this._router.navigate(['/pages/register']);
    }
    public show = 0;
    public list = [];

    MiProfile() {
        this._router.navigate(['/menu/perfil']);
    }
    public aux=[];
    GetMenuByUsuario() {
        this.aux=[];
        this._menuPrincipalService.getMenuByUser().subscribe(data => {
            if (data.estado == 1) {
                this.aux = data.paginasList;
                    this.menuItems = data.paginasList;
                    this._router.navigate([this.menuItems[0].direccionUrl]);

            } else {
                this.menuItems = [];
            }
            return true;
        },
            error => {
                // console.error(error);
                return Observable.throw(error);
            }
        ),
            err => console.error(err),
            () => console.log('Request Complete');
    }

    ChangePass() {
        this._router.navigate(['/menu/cambiarcontrasena']);
    }
    ObtenerDatosEmpleado() {
        let par = {
            idEmpleado: Number(getIdUsuario())
        };
        this._menuPrincipalService.obtenerUsuario(par).subscribe(data => {
            if (data.estado == 1) {
                this.show = 1;
                this.list = data.empleadoList;
            }
            return true;
        },
            error => {
                console.error(error);
                removeSession();
                this._router.navigate(['/pages/register']);
                return Observable.throw(error);
            }
        ),
            err => console.error(err),
            () => console.log('Request Complete');

    }
    ObtenerDatosCliente() {
        let par = {
            idCliente: Number(getIdUsuario())
        };
        this._menuPrincipalService.obtenerUsuarioCliente(par).subscribe(data => {
            if (data.estado == 1) {
                this.show = 1;
                this.list = data.empleadoList;
            }
            return true;
        },
            error => {
                console.error(error);
                removeSession();
                this._router.navigate(['/pages/register']);
                return Observable.throw(error);
            }
        ),
            err => console.error(err),
            () => console.log('Request Complete');

    }

}
