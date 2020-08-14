import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';

import { ExtrasRoutes } from './extras.routing';
import { MaterialModule } from '../app.module';
import { ProformaComponent } from './proforma/proforma.component';
import { BancosComponent } from './bancos/bancos.component';
import { CrudBancoComponent } from './bancos/crud-banco/crud-banco.component';
import { LugaresComponent } from './lugares/lugares.component';
import { InsertLugarComponent } from './lugares/insert-lugar/insert-lugar.component';
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
        RouterModule.forChild(ExtrasRoutes),
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    declarations: [ProformaComponent, BancosComponent, CrudBancoComponent, LugaresComponent, InsertLugarComponent],
    entryComponents: [CrudBancoComponent, InsertLugarComponent],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],

})

export class ExtrasModule { }
