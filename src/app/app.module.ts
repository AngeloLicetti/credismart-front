import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
  MAT_DATE_LOCALE,
  DateAdapter,
  MAT_DATE_FORMATS,
} from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AppComponent } from './app.component';

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FixedpluginModule } from './shared/fixedplugin/fixedplugin.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutes } from './app.routing';
import { CoreModule } from './shared/core.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserModule } from '@angular/platform-browser';
import { ModalPdfComponent } from './shared/helpers/modal-pdf/modal-pdf.component';
import { ValidatorsMessagesComponent } from './shared/helpers/custom-validators/validators-messages/validators-messages.component';
import { TarjetaControlComponent } from './shared/helpers/tarjeta-control/tarjeta-control.component';
import { PagoComponent } from './shared/helpers/pago/pago.component';
import { CustomFormsModule } from './shared/helpers/custom-validators/ng4-validators/custom-forms.module';
import { EnviarMailComponent } from './shared/helpers/enviar-mail/enviar-mail.component';
import { AmortizacionComponent } from './shared/helpers/amortizacion/amortizacion.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY/dd/mm',
  },
  display: {
    dateInput: 'YYYY/dd/mm',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'YYYY/dd/mm',
    monthYearA11yLabel: 'MM YYYY',
  },
};
@NgModule({
  exports: [
    CustomFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
  ]
})
export class MaterialModule { }

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    CoreModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot(AppRoutes, {
      useHash: true
    }),
    HttpModule,
    MaterialModule,
    MatNativeDateModule,
    SidebarModule,
    NavbarModule,
    FooterModule,
    FixedpluginModule,
    BrowserModule,
    ToastrModule.forRoot({
      closeButton: true,
    }),

  ],
  exports: [
    MaterialModule,
  ],
  declarations: [
    ValidatorsMessagesComponent,
    ModalPdfComponent,
    PagoComponent,
    TarjetaControlComponent,
    AmortizacionComponent,
    EnviarMailComponent,
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-PE' }, //you can change useValue
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
  entryComponents: [ModalPdfComponent, TarjetaControlComponent, PagoComponent,EnviarMailComponent,AmortizacionComponent]
})
export class AppModule { }
