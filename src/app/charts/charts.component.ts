import { Component, OnInit } from '@angular/core';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MovimientosService } from '../dashboard/services/movimientos.service';
import { ToastrService } from 'ngx-toastr';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM-YYYY',
  },
  display: {
    dateInput: 'MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
declare const $: any;
declare var moment: any;
var oComponent: ChartsComponent;

@Component({
  selector: 'app-charts-cmp',
  templateUrl: './charts.component.html',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    MovimientosService,
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

export class ChartsComponent implements OnInit {
  date = new FormControl(moment());
  public params = {
    mes: null
  }
  public prestamosList=[];
  public cobranzaList=[];
  public gastosList=[];

  constructor(
    public toastr: ToastrService,
    public _movimiento: MovimientosService,
  ) {

  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.params.mes = moment(this.date.value['_d']).format("MM-YYYY");
    this.reportePrestamos();
    this.reporteGastos();
    this.reporteCobranzas();

  }

  reportePrestamos() {
    this._movimiento.getPrestamos(this.params).subscribe(data => {
      if (data.estado == 1) {
        this.prestamosList = data.moviList;
        console.log(this.prestamosList);

        this.multiPrestamosPorMes = new Array();
        var i = 0;
        this.prestamosList.forEach(element => {
          var trabajador:any = {
            "name": element.nombre,
            "value": element.cantidad
          }
          this.multiPrestamosPorMes.push(trabajador);
          i++;
        });
        this.multiPrestamosPorMes = JSON.parse(JSON.stringify(this.multiPrestamosPorMes));
      } else {
        this.toastr.info(data.mensaje);
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
  reporteGastos() {
    this._movimiento.getGastos(this.params).subscribe(data => {
      if (data.estado == 1) {
        this.gastosList = data.moviList;
        console.log(this.gastosList);

        this.multiGastosPorMes = new Array();
        var i = 0;
        this.gastosList.forEach(element => {
          var trabajador:any = {
            "name": element.nombre,
            "value": element.cantidad
          }
          this.multiGastosPorMes.push(trabajador);
          i++;
        });
        this.multiGastosPorMes = JSON.parse(JSON.stringify(this.multiGastosPorMes));

      } else {
        this.toastr.info(data.mensaje);
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
  reporteCobranzas() {
    this._movimiento.getCobranzas(this.params).subscribe(data => {
      if (data.estado == 1) {
        this.cobranzaList = data.moviList;
        console.log(this.cobranzaList);

        this.multiCobranzasPorMes = new Array();
        var i = 0;
        this.cobranzaList.forEach(element => {
          var trabajador:any = {
            "name": element.nombre,
            "value": element.cantidad
          }
          this.multiCobranzasPorMes.push(trabajador);
          i++;
        });
        this.multiCobranzasPorMes = JSON.parse(JSON.stringify(this.multiCobranzasPorMes));
      } else {
        this.toastr.info(data.mensaje);
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
  ngOnInit() {
    this.params.mes = moment(new Date()).format("MM-YYYY");
    this.reportePrestamos();
    this.reporteGastos();
    this.reporteCobranzas();
  }

  viewLineal;
  viewPrestamosPorMes;
  viewCobranzasPorMes;
  viewGastosPorMes;
  //Datos hardcodeados:
  //Datos hardcodeados:
  //Datos hardcodeados:
  //Esta es la estructura de los datos para el gráfico lineal
  //Aún no sé como poner el ComboBox en el component.html
  //pero se supone que el servicio tomaría el nombre del trabajador
  //como input, y devolvería los datos de los préstamos, cobranzas y  ese trabajador
  multiLineal = [
    {
      "name": "Préstamos",
      "series": [
        {
          "name": "Enero",
          "value": 90000
        },
        {
          "name": "Febrero",
          "value": 80000
        },
        {
          "name": "Marzo",
          "value": 110000
        },
        {
          "name": "Abril",
          "value": 60000
        },
        {
          "name": "Mayo",
          "value": 80000
        }
      ]
    },
    {
      "name": "Cobranzas",
      "series": [
        {
          "name": "Enero",
          "value": 85000
        },
        {
          "name": "Febrero",
          "value": 100000
        },
        {
          "name": "Marzo",
          "value": 70000
        },
        {
          "name": "Abril",
          "value": 110000
        },
        {
          "name": "Mayo",
          "value": 85000
        }
      ]
    },
    {
      "name": "Gastos",
      "series": [
        {
          "name": "Enero",
          "value": 90500
        },
        {
          "name": "Febrero",
          "value": 120000
        },
        {
          "name": "Marzo",
          "value": 130000
        },
        {
          "name": "Abril",
          "value": 8000
        },
        {
          "name": "Mayo",
          "value": 80400
        }
      ]
    }
  ];

  //Datos hardcodeados
  //Los datos de los 3 gráficos de barras comparativas
  //(Préstamos, Cobranzas y Gastos)
  //siguen la misma estructura:
  multiBarrasDoble = [
    {
      "name": "Enero",
      "series": [
        {
          "name": "Angelo",
          "value": 40000
        },
        {
          "name": "Karla",
          "value": 30000
        },
        {
          "name": "Silivana",
          "value": 50000
        },
        {
          "name": "Javier",
          "value": 20000
        },
        {
          "name": "Renzo",
          "value": 70000
        },
        {
          "name": "Angie",
          "value": 30000
        }
      ]
    },
    {
      "name": "Febrero",
      "series": [
        {
          "name": "Angelo",
          "value": 40000
        },
        {
          "name": "Karla",
          "value": 30000
        },
        {
          "name": "Silivana",
          "value": 50000
        },
        {
          "name": "Javier",
          "value": 70000
        },
        {
          "name": "Renzo",
          "value": 30000
        },
        {
          "name": "Angie",
          "value": 20000
        }
      ]
    },
    {
      "name": "Marzo",
      "series": [
        {
          "name": "Angelo",
          "value": 80000
        },
        {
          "name": "Karla",
          "value": 50000
        },
        {
          "name": "Silivana",
          "value": 30000
        },
        {
          "name": "Javier",
          "value": 70000
        },
        {
          "name": "Renzo",
          "value": 30000
        },
        {
          "name": "Angie",
          "value": 40000
        }
      ]
    },
    {
      "name": "Abril",
      "series": [
        {
          "name": "Angelo",
          "value": 40000
        },
        {
          "name": "Karla",
          "value": 80000
        },
        {
          "name": "Silivana",
          "value": 50000
        },
        {
          "name": "Javier",
          "value": 40000
        },
        {
          "name": "Renzo",
          "value": 70000
        },
        {
          "name": "Angie",
          "value": 30000
        }
      ]
    }
  ];

  //Grafico Prestamos por trabajador por mes (Lineal)
  //Grafico Prestamos por trabajador por mes (Lineal)
  //Grafico Prestamos por trabajador por mes (Lineal)
  //https://stackblitz.com/edit/swimlane-line-chart?embed=1&file=app/app.component.ts

  //viewLineal: any[] = [400, 200];

  // options
  legendLineal: boolean = true;
  legendPositionLineal = 'below';
  showLabelsLineal: boolean = true;
  animationsLineal: boolean = true;
  xAxisLineal: boolean = true;
  yAxisLineal: boolean = true;
  showYAxisLabelLineal: boolean = true;
  showXAxisLabelLineal: boolean = true;
  xAxisLabelLineal: string = 'Mes';
  yAxisLabelLineal: string = 'Soles';
  timelineLineal: boolean = true;

  colorSchemeLineal = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };


  //Prestamos por mes (Barras agrupadas)
  //Prestamos por mes (Barras agrupadas)
  //Prestamos por mes (Barras agrupadas)
  //https://swimlane.gitbook.io/ngx-charts/examples/bar-charts/grouped-vertical-bar-chart

  // options
  showXAxisPrestamosPorMes: boolean = true;
  showYAxisPrestamosPorMes: boolean = true;
  gradientPrestamosPorMes: boolean = true;
  showLegendPrestamosPorMes: boolean = true;
  showXAxisLabelPrestamosPorMes: boolean = true;
  xAxisLabelPrestamosPorMes: string = 'Trabajador';
  showYAxisLabelPrestamosPorMes: boolean = true;
  yAxisLabelPrestamosPorMes: string = 'Soles';
  legendTitlePrestamosPorMes: string = '';
  legendPositionPrestamosPorMes = 'below';

  colorSchemePrestamosPorMes = {
    domain: ['#5AA454', '#C7B42C', '#AAAAAA']
  };

  multiPrestamosPorMes = new Array();

  //Cobranzas por mes (Barras agrupadas)
  //Cobranzas por mes (Barras agrupadas)
  //Cobranzas por mes (Barras agrupadas)
  //https://swimlane.gitbook.io/ngx-charts/examples/bar-charts/grouped-vertical-bar-chart

  // options
  showXAxisCobranzasPorMes: boolean = true;
  showYAxisCobranzasPorMes: boolean = true;
  gradientCobranzasPorMes: boolean = true;
  showLegendCobranzasPorMes: boolean = true;
  showXAxisLabelCobranzasPorMes: boolean = true;
  xAxisLabelCobranzasPorMes: string = 'Trabajador';
  showYAxisLabelCobranzasPorMes: boolean = true;
  yAxisLabelCobranzasPorMes: string = 'Soles';
  legendTitleCobranzasPorMes: string = '';
  legendPositionCobranzasPorMes = 'below';

  colorSchemeCobranzasPorMes = {
    domain: ['#5AA454', '#C7B42C', '#AAAAAA']
  };

  multiCobranzasPorMes = new Array();

  //Gastos por mes (Barras agrupadas)
  //Gastos por mes (Barras agrupadas)
  //Gastos por mes (Barras agrupadas)
  //https://swimlane.gitbook.io/ngx-charts/examples/bar-charts/grouped-vertical-bar-chart

  // options
  showXAxisGastosPorMes: boolean = true;
  showYAxisGastosPorMes: boolean = true;
  gradientGastosPorMes: boolean = true;
  showLegendGastosPorMes: boolean = true;
  showXAxisLabelGastosPorMes: boolean = true;
  xAxisLabelGastosPorMes: string = 'Trabajador';
  showYAxisLabelGastosPorMes: boolean = true;
  yAxisLabelGastosPorMes: string = 'Soles';
  legendTitleGastosPorMes: string = '';
  legendPositionGastosPorMes = 'below';

  colorSchemeGastosPorMes = {
    domain: ['#5AA454', '#C7B42C', '#AAAAAA']
  };

  multiGastosPorMes = new Array();

}
