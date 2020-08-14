import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';

import { SeguridadRoutes } from './seguridad.routing';
import { MaterialModule } from '../app.module';
import { SeguridadContentComponent } from './seguridad-content.component';
import { CrudUsuariosComponent } from './crud-usuarios/crud-usuarios.component';
import { CrudEmpresaComponent } from './crud-empresa/crud-empresa.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(SeguridadRoutes),
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    declarations: [SeguridadContentComponent,CrudEmpresaComponent,CrudUsuariosComponent],

})

export class SeguridadModule {}
