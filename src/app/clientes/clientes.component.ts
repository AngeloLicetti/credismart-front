// IMPORTANT: this is a plugin which requires jQuery for initialisation and data manipulation

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { getToken } from '../shared/auth/storage/token.storage';
import { getIpress } from '../shared/auth/storage/cabecera.storage';
import { ClientesService } from '../services/clientes.service';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from '../shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { Configuration } from '../shared/configuration/app.constants';
declare interface DataTable { };
var oComponent: ClientesComponent;
var dtResultado;
declare const $: any;
@Component({
    selector: 'app-clientes-cmp',
    templateUrl: 'clientes.component.html',
    providers: [ClientesService]
})

export class ClientesComponent implements OnInit, AfterViewInit {

    public disabledN = false;
    public disabledD = false;
    public params = {
        idCliente: null,
        nuDocide: null,
        noCliente: null,
        estado: 1,
        nuPagina: null,
        nuRegisMostrar: null
    }
    public dataTable: DataTable;
    constructor(
        public router: Router, public activatedRoute: ActivatedRoute,
        public _cliente: ClientesService,
        public _configuration: Configuration,
        public toastr: ToastrService
    ) {
        this.activatedRoute.queryParams.subscribe(params => {
            this.params.nuDocide = params.nuDocide;
        }
        );
    }
    ngOnInit() {

        oComponent = this;
    }
    public navigate(nav) {
        this.router.navigate(nav, { relativeTo: this.activatedRoute });
    }

    busqueda(target) {
        this.disabledD = false;
        if (target.length > 2) {
            this.disabledD = true;
            this.buscar();
        }
        if (target.length > 0) {
            this.disabledD = true;
        }
        if (target.length == 0) {
            this.disabledD = false;
            this.buscar();
        }
    }
    busquedaDNI(target) {
        this.disabledN = false;
        if (target.length > 7) {
            this.disabledN = true;
            this.buscar();
        }
        if (target.length > 0) {
            this.disabledN = true;
        }
        if (target.length == 0) {
            this.disabledN = false;
        }
    }
    public ConfigurarBuscar() {
        dtResultado = $('#dtResultado').on('init.dt', function (e, settings, json) {
        }).DataTable({
            "scrollX": true,
            responsive: false,
            processing: true,
            serverSide: true,
            ajax: {
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", 'Bearer ' + getToken());
                    request.setRequestHeader("idFinanciera", getIpress());
                },
                url: oComponent._configuration.URL_CLIENTE,
                type: "GET",
                data: function (d) {
                    d.idCliente = oComponent.params.idCliente;
                    d.nuDocide = oComponent.params.nuDocide;
                    d.noCliente = oComponent.params.noCliente;
                    d.estado = oComponent.params.estado;
                    d.nuPagina = (d.start + d.length) / d.length;
                    d.nuRegisMostrar = d.length;
                }
            },
            columns: [

                { data: 'noCliente' },
                { data: 'noApellido' },
                { data: 'nuDocide' },
                { data: 'nuCelular' },
                { data: 'noDireccion' }
            ],
            columnDefs: [
                { 'className': 'text-center', 'targets': [0, 1, 2, 3, 4, 5] },
                {
                    render: function (data, type, row) {
                        return '<div class="text-center"><a class="actions" href="javascript:void(0)">' +
                            '<button class="btn-simple btn-info money btn-icon like" rel="tooltip" title="Ver Préstamos" data-placement="left">' +
                            '<i class="material-icons">attach_money</i>' +
                            '</button>' +
                            '</a>' +
                            '<a class="actions" href="javascript:void(0" data="' + data + '">' +
                            '<button class="btn-simple btn-info edit btn-icon edit" rel="tooltip" title="Editar Cliente" data-placement="left">' +
                            '<i class="material-icons">edit</i>' +
                            '</button>' +
                            '</a>' +
                            '<a class="actions" href="javascript:void(0s" data="' + data + '">' +
                            '<button class="btn-simple btn-info delete btn-icon remove" rel="tooltip" title="Elminar Cliente" data-placement="left">' +
                            '<i class="material-icons">delete</i>' +
                            '</button>' +
                            '</a></div>';
                    },
                    targets: 5,
                    orderable: false
                },
            ]
        });

        dtResultado.on('click', '.remove', function (event) {
            const $tr = $(this).closest('tr');
            const data = dtResultado.row($tr).data();
            oComponent.deleteCliente(data);
            event.preventDefault();
        });
        dtResultado.on('click', '.edit', function (event) {
            const $tr = $(this).closest('tr');
            const data = dtResultado.row($tr).data();
            const nav = ["crudcliente", data.idCliente];
            oComponent.navigate(nav);
            event.preventDefault();
        });
        dtResultado.on('click', '.like', function (event) {
            const $tr = $(this).closest('tr');
            const data = dtResultado.row($tr).data();
            oComponent.goPrestamos(data);
            event.preventDefault();
        });


    }
    ngAfterViewInit(): void {
        this.ConfigurarBuscar();
    }
    buscar() {
        dtResultado.ajax.reload();
    }
    deleteCliente(e) {
        swal({
            title: '¿Estás seguro?',
            text: 'Desea eliminar al cliente ' + e.noCliente + ' !',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                this.params.idCliente = e.idCliente;
                this._cliente.eliminarCliente(this.params).subscribe(data => {
                    if (data.confirmacion.id == 1) {

                        swal(
                            {
                                title: 'Eliminado!',
                                text: 'El cliente ' + e.noCliente + ' ha sido eliminado !',
                                type: 'success',
                                confirmButtonClass: "btn btn-success",
                                buttonsStyling: false
                            }
                        )
                        this.buscar();

                    } else {
                        swal({
                            title: 'Cancelado',
                            text: 'El cliente tiene un préstamo por pagar!',
                            type: 'error',
                            confirmButtonClass: "btn btn-info",
                            buttonsStyling: false
                        }).catch(swal.noop)
                    }
                    return true;
                },
                    error => {
                        console.error(error);
                        return Observable.throw(error);
                    }
                )
            }
        })
    }
    goPrestamos(element) {
        let _params: NavigationExtras = {
            queryParams: {
                nuDocideSolicitante: element.nuDocide,
            }
        }

        this.router.navigate(['/prestamos/listado'], _params);
    }
    clear() {
        this.params.noCliente = null;
        this.params.nuDocide = null;
        this.disabledD = false;
        this.disabledN = false;
        this.buscar();
    }
    public isInvalid(_ngForm: any): boolean {
        return isInvalid(_ngForm);
    }
    public setInputPattern(_event: any, _pattern: any): void {
        setInputPattern(_event, _pattern);
    }
    public setValidatorPattern(_pattern: string, _quantifier: any,
        _exactStart?: boolean, _exactEnd?: boolean, _regexFlags?: string): RegExp {

        return setValidatorPattern(_pattern, _quantifier,
            _exactStart, _exactEnd, _regexFlags);
    }
    public setQuantifier(_quantifier1?: null | number | string, _quantifier2?: null | number): {} {
        return setQuantifier(_quantifier1, _quantifier2);
    }
}

