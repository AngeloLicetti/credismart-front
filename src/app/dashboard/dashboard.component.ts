import { Component, OnInit } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import { MovimientosService } from './services/movimientos.service';
import { Observable } from 'rxjs';
import { SolicitudesService } from '../services/solicitudes.service';
declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers: [MovimientosService, SolicitudesService],

})
export class DashboardComponent implements OnInit {
  public tableData: TableData;
  public cabeceraList = {
    clientesActivos: null,
    clientesTotal: null,
    prestamosActivos: null,
    prestamosTotal: null,
    totalPrestado: null,
    totalInteres: null
  }
  public prestamos = [];
  public cobranzas = [];
  public json = [
    {
      "name": null,
      "series": [
        {
          "name": "Préstamos",
          "value": null
        },
        {
          "name": "Cobranza",
          "value": null
        }
      ]
    },
  ];
  public show = 0;
  date = new Date();
  public fecha;
  public request = {
    año: null,
    idDepartamento: 0,
    idProvincia: null
  }
  public listAn = [];
  public data = [];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#063b71']
  };

  showXAxis = true;
  showYAxis = true;
  gradientBarras = false;
  showLegendBarras = true;
  legendTitleBarras = 'Leyenda';
  legendPositionBarras = 'below';
  showXAxisLabel = true;
  xAxisLabel = 'Mes';
  showYAxisLabel = true;
  yAxisLabel = 'Soles';
  timeline = true;
  view: any[];
  viewDistrito: any[];
  constructor(public _mov: MovimientosService, public _solicitud: SolicitudesService) {
    if (window.screen.width > 1000) {
      this.viewCircular = [window.screen.width / 4.20, 380];
      this.view = [window.screen.width / 2.00, 355];
      this.viewDistrito = [window.screen.width / 1.50, 360];
    }
    else if (window.screen.width < 1000 && window.screen.width > 400) {
      this.viewCircular = [window.screen.width / 1.10, 380];
      this.view = [window.screen.width / 1.50, 355];
      this.viewDistrito = [window.screen.width / 1.10, 360];
    }
    else {
      this.viewCircular = [300, 380];
      this.view = [300, 355];
      this.viewDistrito = [320, 380];
    }

  }
  public ngOnInit() {
    this.getAños();
    this.getComboDepartamentos();
  }
  onResize(event) {

    if (window.screen.width > 1000) {
      this.viewCircular = [window.screen.width / 4.00, 380];
      this.view = [window.screen.width / 2.00, 355];
      this.viewDistrito = [window.screen.width / 1.50, 360];
    }
    else if (window.screen.width < 1000 && window.screen.width > 400) {
      this.viewCircular = [window.screen.width / 1.10, 380];
      this.view = [window.screen.width / 1.50, 355];
      this.viewDistrito = [window.screen.width / 1.10, 360];
    }
    else {
      this.viewCircular = [300, 380];
      this.view = [300, 355];
      this.viewDistrito = [320, 380];
    }

  }
  public mes = [];

  public getCabecera() {
    this.request.año = this.fecha;
    this._mov.getCabecera(this.request)
      .subscribe(data => {
        if (data.estado == 1) {
          this.show = 1;
          this.cabeceraList = data.moviList;
          this.cabeceraList.totalPrestado = this.cabeceraList[0].totalPrestado;
          this.cabeceraList.totalInteres = this.cabeceraList[0].totalInteres;
          if (this.cabeceraList[0].totalPrestado == null) {
            this.cabeceraList.totalPrestado = 0;
          }
          if (this.cabeceraList[0].totalInteres == null) {
            this.cabeceraList.totalInteres = 0;
          }

        } else if (data.estado == 0) {
          console.log(data.mensaje, "No tiene Movimientos");
        }
        else {
          console.log(data.mensaje);
        }
        return true;
      },
        error => {
          console.error(error);
        },
        () => {
        });
  }
  public departamentos = [];
  public provincias = [];

  getComboDepartamentos() {
    this._solicitud.getDepartamentos().subscribe(data => {
      if (data.estado == 1) {
        this.departamentos = data.depaList;
      } else {
        console.log(data.mensaje);
      }
      return true;
    },
      error => {
        console.error(error);
        return Observable.throw(error);
      }
    ),
      err => console.error(err),
      () => console.log('Request Complete');
  }
  getComboProvincias() {
    this.single = [];
    this.request.idProvincia=null;
    if (this.request.idDepartamento != null) {
      this._solicitud.getProvincias(this.request).subscribe(data => {
        if (data.estado == 1) {
          this.provincias = data.proList;
        } else {
          console.log(data.mensaje);
        }
        return true;
      },
        error => {
          console.error(error);
          return Observable.throw(error);
        }
      ),
        err => console.error(err),
        () => console.log('Request Complete');
    }

  }
  getAños() {
    this._mov.getAños().subscribe(data => {
      if (data.estado == 1) {
        this.listAn = data.seguridadList;
        if (this.listAn.length != 0) {
          this.fecha = this.listAn[this.listAn.length - 1].ano;
          this.getCabecera();
          this.getBarras();
          this.getPastel();
          this.getDepartamento();
        }
        else {
          this.fecha = this.date.getFullYear();
        }
      }
      return true;
    },
      error => {
        console.error(error);
        return Observable.throw(error);
      }
    ),
      err => console.error(err),
      () => console.log('Request Complete');
  }

  myYAxisTickFormatting(val) {
    return "S/ " + val;
  }
  public showBarras = 0;
  public prestamoMayor() {
    let aux;
    let param;
    if (this.prestamos.length > 0 || this.cobranzas.length > 0) {
      this.showBarras = 1;
      let ultimo = this.prestamos[(this.prestamos.length) - 1].mes;
      this.prestamos.forEach(element => {
        param = {
          name: element.mes,
          series: [
            {
              name: "Préstamos",
              value: element.cantidad
            }
          ]
        }
        this.cobranzas.forEach(ele => {
          if (param.name == ele.mes) {
            param.series.push({ name: "Cobranzas", value: ele.cantidad });
          }
          if (ele.mes != ultimo) {
            aux = {
              name: ele.mes,
              series: [
                {
                  name: "Préstamos",
                  value: 0
                },
                {
                  name: "Cobranzas",
                  value: ele.cantidad
                }
              ]
            }
            this.json.push(aux);
          }
        });
        this.json.push(param);
        this.data = this.json;
      });
    }
  }
  public cobranzaMayor() {
    let aux;
    let param;
    if (this.prestamos.length > 0 || this.cobranzas.length > 0) {
      this.showBarras = 1;
      let ultimo = this.cobranzas[(this.cobranzas.length) - 1].mes;
      this.cobranzas.forEach(element => {
        param = {
          name: element.mes,
          series: [
            {
              name: "Cobranzas",
              value: element.cantidad
            }
          ]
        }
        this.prestamos.forEach(ele => {
          if (param.name == ele.mes) {
            param.series.push({ name: "Préstamos", value: ele.cantidad });
          }
          if (ele.mes != ultimo) {
            aux = {
              name: ele.mes,
              series: [
                {
                  name: "Cobranzas",
                  value: 0
                },
                {
                  name: "Préstamos",
                  value: ele.cantidad
                }
              ]
            }
            this.json.push(aux);
          }
        });
        this.json.push(param);
        this.data = this.json;

      });
    }
  }
  public getBarras() {
    this.request.año = this.fecha;
    this.json = [];
    this._mov.getGraficos(this.request)
      .subscribe(data => {
        if (data.estado == 1) {
          this.prestamos = data.prestamosList;
          this.cobranzas = data.cobranzasList;
          if (this.prestamos.length > this.cobranzas.length) {
            this.prestamoMayor();
          }
          else {
            this.cobranzaMayor();
          }

        } else if (data.estado == 0) {
          console.log(data.mensaje, "No tiene Movimientos");
        }
        else {
          console.log(data.mensaje);
        }
        return true;
      },
        error => {
          console.error(error);
        },
        () => {
        });
  }
  public showPastel = 0;
  public getPastel() {
    this.request.año = this.fecha;
    this._mov.getPastel(this.request)
      .subscribe(data => {
        if (data.estado == 1) {
          this.showPastel = 1;
          let lista = data.moviList;
          this.robarDatosParaElGraficoCircularDeAngelo(lista[0].totalDiario, lista[0].totalSemanal,
            lista[0].totalQuincenal, lista[0].totalMensual);
        }
        else {
          this.showPastel = 0;
          console.log(data.mensaje);
        }
        return true;
      },
        error => {
          console.error(error);
        },
        () => {
        });
  }
  public single = [];
  public titulo;
  public getDepartamento() {
    this.single=[];
    this.request.año = this.fecha;
    this._mov.getDepartamentos(this.request)
      .subscribe(data => {
        if (data.estado == 1) {
          let departamento = data.depaList;
          this.titulo="Clientes por Departamentos";
          departamento.forEach(element => {
            let param = { name: element.departamento, value: element.idDepartamento }
            this.single.push(param)
          });
        }
        else {
          console.log(data.mensaje);
        }
        return true;
      },
        error => {
          console.error(error);
        },
        () => {
        });
  }
  public getDistritos() {
    this.single=[];
    let distrito = [];
    this.request.año = this.fecha;
    this._mov.getDistritos(this.request)
      .subscribe(data => {
        if (data.estado == 1) {
          distrito = data.disList;
          this.titulo="Clientes por Distritos";
          distrito.forEach(element => {
            let param = { name: element.distrito, value: element.idDistrito }
            this.single.push(param)
          });
        }
        else {
          console.log(data.mensaje);
        }
        return true;
      },
        error => {
          console.error(error);
        },
        () => {
        });
  }
  robarDatosParaElGraficoCircularDeAngelo(dia, sem, qui, men) {
    this.datosCircular = [
      {
        "name": "Diario",
        "value": dia
      },
      {
        "name": "Semanal",
        "value": sem
      },
      {
        "name": "Quincenal",
        "value": qui
      },
      {
        "name": "Mensual",
        "value": men
      }
    ]
  }

  public datosCircular = [];

  colorSchemeCircular = {
    domain: ['#C7B42C', '#87CEFA', '#5AA454', '#A10A28']
  };

  public viewCircular: any[];
  showLegendCircular = true;
  legendTitleCircular = 'Leyenda';
  legendPositionCircular = 'below';
  formatoTooltipCircular(val) {
    if (val.value.toLocaleString() == '1') {
      return val.value.toLocaleString() + " préstamo";
    }
    else {
      return val.value.toLocaleString() + " préstamos";
    }
  }
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  // options
  showLegend: boolean = true;

  onSelect(event) {
    console.log(event);
  }
  colorSchemePie = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#aae3f5']
  };
}
