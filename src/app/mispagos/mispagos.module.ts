import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';

import { MaterialModule } from '../app.module';
import { MisPagosComponent } from './mispagos.component';
import { MisPagosRoutes } from './mispagos.routing.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MisPagosRoutes),
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    declarations: [MisPagosComponent],

})

export class MisPagosModule {}