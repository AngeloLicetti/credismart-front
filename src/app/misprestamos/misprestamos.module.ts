import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';

import { MisPrestamosRoutes } from './misprestamos.routing';
import { MaterialModule } from '../app.module';
import { ListadoComponent } from './listado/listado.component';
import { TarjetaControlComponent } from './tarjeta/tarjeta-control.component';
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MisPrestamosRoutes),
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    declarations: [ListadoComponent,TarjetaControlComponent]
})

export class MisPrestamosModule {}
