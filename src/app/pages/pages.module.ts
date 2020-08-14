import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { FlexLayoutModule } from '@angular/flex-layout';

import { PagesRoutes } from './pages.routing';

import { RegisterComponent } from './register/register.component';
import { PricingComponent } from './pricing/pricing.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { BlockUIModule } from 'ng-block-ui';
import { BlockUIHttpModule } from 'ng-block-ui/http';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PagesRoutes),
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    BlockUIModule.forRoot({
      message: "Cargando..."
    }),
    BlockUIHttpModule.forRoot(),
    
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    PricingComponent,
    ]
})

export class PagesModule {}
