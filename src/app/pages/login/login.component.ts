
import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { LoginService } from '../services/login.service';
import { removeSession, saveToken } from 'src/app/shared/auth/storage/token.storage';
import { saveIdRol, saveIdUsuario, saveCodUsuario, saveIpress, getIpress, saveLogo, saveNombre, saveDireccion, saveTelefono, saveFlCliente } from 'src/app/shared/auth/storage/cabecera.storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { MenuPrincipalService } from 'src/app/sidebar/services/menu-principal.service';
import { isInvalid } from 'src/app/shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { MovimientosService } from 'src/app/dashboard/services/movimientos.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
declare var $: any;

@Component({
    selector: 'app-login-cmp',
    templateUrl: './login.component.html',
    providers: [LoginService, MenuPrincipalService, MovimientosService]
})

export class LoginComponent implements OnInit, OnDestroy {
    test: Date = new Date();
    public toggleButton: any;
    public sidebarVisible: boolean;
    public nativeElement: Node;
    public type = "password";
    public step = 0;
    public usuarioID: String = null;
    public showIt = false;
    public contrasena: String = null;
    public listIpress: any[] = null;
    public comboIpress: any = null;
    public flgComboIpress: Boolean = false;
    public accessToken: any;
    public par = {
        idFinanciera: null
    }
    @BlockUI() blockUI: NgBlockUI;
    constructor(public element: ElementRef, public loginService: LoginService,
        public _router: Router, public toastr: ToastrService,
        public _menuPrincipalService: MenuPrincipalService,
        public _mov: MovimientosService) {
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        var navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');
        body.classList.add('off-canvas-sidebar');
        const card = document.getElementsByClassName('card')[0];
        setTimeout(function () {
            // after 1000 ms we add the class animated to the login/register card
            card.classList.remove('card-hidden');
        }, 700);
    }
    sidebarToggle() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        var sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if (this.sidebarVisible == false) {
            setTimeout(function () {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }
    ngOnDestroy() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('login-page');
        body.classList.remove('off-canvas-sidebar');
    }
    enter() {
        this.type = "text";
    }
    leave() {
        this.type = "password";
    }
    setStep(index: number) {
        this.step = index;
    }
    nextStep(_controlVar: any) {
        this.step++;
        _controlVar.reset();
    }
    prevStep(_controlVar: any) {
        this.step--;
        _controlVar.reset();
    }
    getAccessToken(_controlVar?: any) {
        this.blockUI.start('Cargando...'); // Start blocking
        this.showIt = true;
        removeSession();
        let promise = new Promise((resolve, reject) => {
            this.flgComboIpress = false;
            this.comboIpress = null;
            let userDAO = {
                usuarioID: this.usuarioID,
                contrasena: this.contrasena
            };

            this.loginService.solicitarToken(userDAO)
                .toPromise().then(data => {

                    this.accessToken = data;

                    if (this.accessToken.error == null) {
                        // this.toastr.success("Exitoso", "Autentificado");

                        saveToken(this.accessToken.accessToken);
                        saveCodUsuario(userDAO.usuarioID.toString());

                        // --------------------
                        this.loginService.getFinancieras()
                            .toPromise().then(data => {
                                if (data.estado == 1) {
                                    this.listIpress = [];
                                    this.listIpress = data.seguridadList;
                                    if (this.listIpress.length != 0) {
                                        saveIdRol(this.listIpress[0].idRol);
                                        saveFlCliente(this.listIpress[0].flCliente)
                                        if (this.listIpress.length > 1) {
                                            this.flgComboIpress = true;
                                        } else if (this.listIpress.length == 1) {
                                            this.flgComboIpress = false;
                                            saveIdUsuario(this.listIpress[0].idEmpleado.toString());
                                            saveIpress(this.listIpress[0].idFinanciera.toString());
                                            this.getMenuByUsuario();
                                        } else if (this.listIpress.length == 0) {
                                            removeSession();
                                            this.flgComboIpress = false;
                                        }
                                        this.blockUI.stop(); // Stop blocking
                                    }
                                }
                            },
                                err => {
                                    this.blockUI.stop(); // Stop blocking
                                    console.log(err);
                                })
                        // --------------------

                    } else {
                        this.blockUI.stop(); // Stop blocking
                        this.toastr.error("Usuario desconocido o contraseña incorrecta", "Error");
                        this.showIt = false;
                        removeSession();
                    }
                },
                    err => {
                        console.log(err);
                    })
        })
        return promise
    }

    public menuItems = [];
    getMenuByUsuario() {
        this._menuPrincipalService.getMenuByUser().subscribe(data => {
            if (data.estado == 1) {
                this._router.navigate([data.paginasList[0].direccionUrl]);
                this.menuItems = data.paginasList;
                this.getEmpresas();
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
    chooseIpress(event,e) {
        if (this.par.idFinanciera == null || this.par.idFinanciera == undefined) {
            return;
        }
        this.listIpress.forEach(element => {
            if(element.idFinanciera==event){
                saveIpress(element.idFinanciera.toString());
                saveIdUsuario(element.idEmpleado.toString());
                this.showIt = false;
                this.getMenuByUsuario();
            }
        });
    }
    public isInvalid(_ngForm: any): boolean {
        return isInvalid(_ngForm);
    }
    public empresasList = [];
    public getEmpresas() {
        let params = { idFinanciera: getIpress() };
        this._mov.getEmpresas(params)
            .subscribe(data => {
                if (data.estado == 1) {
                    this.empresasList = data.empresaList;
                    saveLogo(this.empresasList[0].foto);
                    saveNombre(this.empresasList[0].razonSocial);
                    saveDireccion(this.empresasList[0].direccion);
                    saveTelefono(this.empresasList[0].telefono);
                }
                else {
                    console.log("No se pudo encontrar las empresas");
                }
                return true;
            },
                error => {
                    console.error(error);
                },
                () => {
                });
    }
}

