import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';

import { EmpresasRoutes } from './empresas.routing';
import { MaterialModule } from '../app.module';
import { EmpresasComponent } from './empresas.component';
import { CrudEmpresaComponent } from './crud-empresa/crud-empresa.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(EmpresasRoutes),
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    declarations: [EmpresasComponent,CrudEmpresaComponent]

})

export class EmpresasModule {}
