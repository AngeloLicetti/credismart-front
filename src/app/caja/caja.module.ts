import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';

import { CajaRoutes } from './caja.routing';
import { MaterialModule } from '../app.module';
import { GastosComponent } from './gastos/gastos.component';
import { ListadoComponent } from './listado/listado.component';
import { InsertarActualizarGastosComponent } from './gastos/insertar-actualizar-gastos/insertar-actualizar-gastos.component';
import { InsertarActualizarCajaComponent } from './listado/formularios/insertar-actualizar-caja.component';
import { AperturarCajaComponent } from './listado/formularios/aperturar-caja.component';
import { CierreCajaComponent } from './listado/formularios/cierre-caja.component';
import { VerMovimientosComponent } from './listado/formularios/ver-movimientos.component';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
export const MY_FORMATS = {
    parse: {
        dateInput: 'DD-MM-YYYY',
    },
    display: {
        dateInput: 'DD-MM-YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'DD-MM-YYYY',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(CajaRoutes),
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
    ],
    declarations: [ListadoComponent, GastosComponent, InsertarActualizarCajaComponent, AperturarCajaComponent, CierreCajaComponent, VerMovimientosComponent, InsertarActualizarGastosComponent],
    entryComponents: [InsertarActualizarCajaComponent, AperturarCajaComponent, CierreCajaComponent, VerMovimientosComponent, InsertarActualizarGastosComponent],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
})

export class CajaModule { }
