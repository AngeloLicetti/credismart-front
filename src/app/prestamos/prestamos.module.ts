import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';

import { PrestamosRoutes } from './prestamos.routing';
import { MaterialModule } from '../app.module';
import { CrudPrestamosComponent } from './crud-prestamos/crud-prestamos.component';
import { HistorialComponent } from './historial/historial.component';
import { ListadoComponent } from './listado/listado.component';
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
        RouterModule.forChild(PrestamosRoutes),
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
    ],
    declarations: [ListadoComponent,CrudPrestamosComponent,HistorialComponent],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
})

export class PrestamosModule {}
