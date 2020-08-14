import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';

import { MaterialModule } from '../app.module';
import { MiSolicitudesComponent } from './misolicitudes.component';
import { MiSolicitudesRoutes } from './misolicitudes.routing.module';
import { CrudSolicitudComponent } from './crud-solicitud/crud-solicitud.component';
import { ModalAceptarComponent } from './crud-solicitud/modal-aceptar/modal-aceptar.component';
import { EvidenciaComponent } from './crud-solicitud/evidencia/evidencia.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MiSolicitudesRoutes),
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    declarations: [MiSolicitudesComponent,CrudSolicitudComponent,ModalAceptarComponent,EvidenciaComponent],
    entryComponents:[ModalAceptarComponent,EvidenciaComponent]

})

export class MiSolicitudesModule {}