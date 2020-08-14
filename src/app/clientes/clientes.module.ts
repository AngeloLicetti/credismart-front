import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ClientesComponent } from './clientes.component';
import { ClientesRoutes } from './clientes.routing';
import { MaterialModule } from '../app.module';
import { CrudClienteComponent } from './crud-cliente/crud-cliente.component';
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
        RouterModule.forChild(ClientesRoutes),
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
    ],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],
    declarations: [ClientesComponent, CrudClienteComponent]
})

export class ClientesModule { }
