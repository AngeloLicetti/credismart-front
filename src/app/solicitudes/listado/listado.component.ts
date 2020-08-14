import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SolicitudesService } from '../../services/solicitudes.service';
import { MatDialog } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { getIdUsuario, getIdRol, getIpress } from '../../shared/auth/storage/cabecera.storage';
import { ToastrService } from 'ngx-toastr';
import { ModalPdfComponent } from '../../shared/helpers/modal-pdf/modal-pdf.component';
import { isInvalid, setInputPattern, setValidatorPattern, setQuantifier } from '../../shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { getToken } from '../../shared/auth/storage/token.storage';
import { Configuration } from '../../shared/configuration/app.constants';
import swal from 'sweetalert2';
declare interface DataTable { };
var oComponent: ListadoComponent;
var dtResultado;
declare const $: any;
@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  providers: [SolicitudesService]
})
export class ListadoComponent implements OnInit, AfterViewInit {

  public dataTable: DataTable;
  public pdf: String = "";
  public disabledN = false;
  public disabledD = false;
  public showRol = 0;
  public params = {
    idSolicitudPrestamo: null,
    nuDocideSolicitante: null,
    noSolicitante: null,
    estado: 'P',
    idEmpleado: Number(getIdUsuario()),
    nuPagina: null,
    nuRegisMostrar: null
  }
  public updateSubscription: Subscription;
  public maxfechRN: Date = new Date();
  public fecha: String;
  constructor(public _modalDialog: MatDialog,
    public _route: Router,
    public _configuration: Configuration,
    public activatedRoute: ActivatedRoute,
    public toastr: ToastrService,
    public _solicitud: SolicitudesService) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.params.nuDocideSolicitante = params.nuDocideSolicitante;
    }
    );
  }

  ngOnInit() {
    oComponent = this;
    if (Number(getIdRol()) == 1) {
      this.showRol = 1;
    }
    else {
      this.showRol = 0;
    }
    let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    this.fecha = ((this.maxfechRN).toLocaleDateString('zh-Hans-CN', options)).split('/').join('-');
  }
  clear() {
    this.params.noSolicitante = null;
    this.params.nuDocideSolicitante = null;
    this.disabledD = false;
    this.disabledN = false;
    this.buscar();
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
    if (target.length % 8 == 0) {
      this.disabledN = true;
      this.buscar();

    }
    if (target.length > 0) {
      this.disabledN = true;
    }
    if (target.length == 0) {
      this.disabledN = false;
      this.buscar();
    }
  }
  public navigate(nav) {
    this._route.navigate(nav, { relativeTo: this.activatedRoute });
  }
  public ConfigurarBuscar() {
    dtResultado = $('#dtResultado').on('init.dt', function (e, settings, json) {
    }).DataTable({
      "decimal": ",",
      "thousands": ".",
      "scrollX": true,
      responsive: false,
      processing: true,
      serverSide: true,
      ajax: {
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", 'Bearer ' + getToken());
          request.setRequestHeader("idFinanciera", getIpress());
        },
        url: oComponent._configuration.URL_SOLICITUDES,
        type: "GET",
        data: function (d) {
          d.nuDocideSolicitante = oComponent.params.nuDocideSolicitante;
          d.noSolicitante = oComponent.params.noSolicitante;
          d.estado = oComponent.params.estado;
          d.nuPagina = (d.start + d.length) / d.length;
          d.nuRegisMostrar = d.length;
        }
      },
      columns: [
        { data: 'noSolicitante' },
        { data: 'nuDocideSolicitante' },
        { data: 'nuCelular' },
        { data: 'monto' },
        { data: 'interes' },
        { data: 'tipoPrestamo.noTipo' },
        { data: 'cuota' }
      ],
      columnDefs: [
        { 'className': 'text-center', 'targets': [0, 1, 2, 3, 4, 5, 6, 7] },
        // {
        //   render: function (data, type, row) {
        //     if (oComponent.showRol == 1) {
        //       return '<div class="text-center"><a class="actions" href="javascript:void(0s" data="' + data + '">' +
        //         '<button class="btn-simple btn-info aprobar btn-icon pass" rel="tooltip" title="Aprobar Solicitud" data-placement="left">' +
        //         '<i class="material-icons">thumb_up</i>' +
        //         '</button>' +
        //         '</a></div>';
        //     }
        //     else { return ''; }
        //   },
        //   targets: 0,
        //   orderable: false
        // },
        // {
        //   render: function (data, type, row) {
        //     if (oComponent.showRol == 1) {
        //       return '<div class="text-center"><a class="actions" href="javascript:void(0s" data="' + data + '">' +
        //         '<button class="btn-simple btn-info dislike btn-icon fail" rel="tooltip" title="Rechazar Solicitud" data-placement="left">' +
        //         '<i class="material-icons">thumb_down</i>' +
        //         '</button>' +
        //         '</a></div>';
        //     }
        //     else { return ''; }
        //   },
        //   targets: 1,
        //   orderable: false
        // },
        {
          render: function (data, type, row) {
            if (row.monto == '' || row.monto == null) { return "" };
            var display = $.fn.dataTable.render.number(',', '.', 2, 'S/').display;
            var formattedNumber = display(row.monto);
            return formattedNumber;
          },
          targets: 3
        },
        {
          render: function (data, type, row) {
            let aux = 1;
            if (row.tipoPrestamo.idTipoPrestamo == 2) {
              aux = Math.round(row.nuCuota / 4);
            }
            else if (row.tipoPrestamo.idTipoPrestamo == 3) {
              aux = Math.round(row.nuCuota / 2);
            }
            else {
              aux = Math.round(row.nuCuota);
            }
            var display = $.fn.dataTable.render.number(',', '.', 2, '', ' %').display;
            var formattedNumber = display(row.interes / aux);
            var formattedNumber2 = display(row.interes);
            if (row.interes == '' || row.interes == null) { return "" };
            if (row.tipoPrestamo.idTipoPrestamo == 1 && row.interes != null) { return formattedNumber2 };
            return formattedNumber;
          },
          targets: 4
        }, {
          render: function (data, type, row) {
            if (row.cuota == '' || row.cuota == null) { return "" };
            var display = $.fn.dataTable.render.number(',', '.', 2, 'S/').display;
            var formattedNumber = display(row.cuota);
            return formattedNumber;
          },
          targets: 6
        },
        {
          render: function (data, type, row) {
            if (row.sexo.idSexo == 3) {
              return '<div class="text-center><a class="actions" href="javascript:void(0)">' +
                '<button  class="btn-simple btn-info notificacion btn-icon like" rel="tooltip" title="El cliente aceptó la proforma" data-placement="left" >' +
                '<i class="material-icons">chrome_reader_mode</i>' +
                '</button>' +
                '</a></div>';
            }
            return '<div class="text-center"><a class="actions" href="javascript:void(0" data="' + data + '">' +
              '<button class="btn-simple btn-info edit btn-icon edit" rel="tooltip" title="Detalle de Solicitud" data-placement="left">' +
              '<i class="material-icons">visibility</i>' +
              '</button>' +
              '</a>' +
              '<a class="actions" href="javascript:void(0s" data="' + data + '">' +
              '<button class="btn-simple btn-info delete btn-icon remove" rel="tooltip" title="Elminar Solicitud" data-placement="left">' +
              '<i class="material-icons">delete</i>' +
              '</button>' +
              '</a></div>';

          },
          targets: 7,
          orderable: false
        },
      ]
    });

    dtResultado.on('click', '.edit', function (event) {
      const $tr = $(this).closest('tr');
      const data = dtResultado.row($tr).data();
      const nav = ["crudsolicitudes", data.idSolicitudPrestamo];
      oComponent.navigate(nav);
      event.preventDefault();
    });
    dtResultado.on('click', '.like', function (event) {
      const $tr = $(this).closest('tr');
      const data = dtResultado.row($tr).data();
      const nav = ["crudsolicitudes", data.idSolicitudPrestamo];
      oComponent.navigate(nav);
      event.preventDefault();
    });
    dtResultado.on('click', '.remove', function (event) {
      const $tr = $(this).closest('tr');
      const data = dtResultado.row($tr).data();
      oComponent.deleteSolicitud(data)
      event.preventDefault();
    });

  }
  ngAfterViewInit(): void {
    this.ConfigurarBuscar();
  }
  buscar() {
    dtResultado.ajax.reload();
  }
  goPrestamos(nuDocideSolicitante) {
    let _params: NavigationExtras = {
      queryParams: {
        nuDocideSolicitante: nuDocideSolicitante
      }
    }
    this._route.navigate(['/prestamos/listado'], _params);
  }


  deleteSolicitud(e) {
    swal({
      title: '¿Estás seguro?',
      text: 'Desea eliminar la solicitud ' + e.noSolicitante + ' !',
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      buttonsStyling: false
    }).then((result) => {
      if (result.value) {
        this.params.idSolicitudPrestamo = e.idSolicitudPrestamo;
        this._solicitud.eliminarSolicitud(this.params).subscribe(data => {
          if (data.confirmacion.id == 1) {
            swal(
              {
                title: 'Eliminada!',
                text: 'La solicitud de ' + e.noSolicitante + ' ha sido eliminada !',
                type: 'success',
                confirmButtonClass: "btn btn-success",
                buttonsStyling: false
              }
            )
            this.buscar();

          } else {
            swal({
              title: 'Cancelado',
              text: 'No se pudo eliminar la solicitud!',
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
