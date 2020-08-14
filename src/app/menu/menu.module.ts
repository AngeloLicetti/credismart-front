import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LbdTableComponent } from '../lbd/lbd-table/lbd-table.component';

import { MenuRoutes } from './menu.routing';
import { MaterialModule } from '../app.module';
import { PerfilComponent } from './perfil.component';
import { CambiarContrasenaComponent } from './cambiar-contrasena.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(MenuRoutes),
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
    ],
    declarations: [PerfilComponent,CambiarContrasenaComponent],

})

export class MenuModule {}
