import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';
import { MaterialModule } from '../app.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        MdModule,
        MaterialModule,
        NgxChartsModule
    ],
    declarations: [DashboardComponent]
})

export class DashboardModule {}
