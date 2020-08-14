import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';

import { PersonalRoutes } from './personal.routing';
import { MaterialModule } from '../app.module';
import { PersonalComponent } from './personal.component';
import { CrudEmpleadoComponent } from './crud-empleado/crud-empleado.component';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { BlockUIModule } from 'ng-block-ui';
import { BlockUIHttpModule } from 'ng-block-ui/http';
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
        RouterModule.forChild(PersonalRoutes),
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        BlockUIModule.forRoot({
            message: "Cargando..."
          }),
          BlockUIHttpModule.forRoot(),
    ],
    declarations: [PersonalComponent,CrudEmpleadoComponent],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }],

})

export class PersonalModule {}
