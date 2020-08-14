import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';

import { ChartsComponent } from './charts.component';
import { ChartsRoutes } from './charts.routing';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MaterialModule } from '../app.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ChartsRoutes),
        FormsModule,
        NgxChartsModule,
        ReactiveFormsModule,
        MaterialModule
    ],
    declarations: [ChartsComponent]
})

export class ChartsModule {}
