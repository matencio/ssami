import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthModule } from './pages/auth/auth.module';
import { PacienteModule } from './pages/paciente/paciente.module';
import { CamasModule } from './pages/camas/camas.module';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { EstadisticaModule } from './pages/estadistica/estadistica.module';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AuthInterceptor } from './pages/auth/interceptors/auth.interceptor';
import { MedicamentosModule } from './pages/medicamentos/medicamentos.module';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    BrowserModule,
    SharedModule,
    AuthModule,
    PacienteModule,
    CamasModule,
    EstadisticaModule,
    BrowserAnimationsModule,
    //NoopAnimationsModule,
    RouterModule,
    AppRoutingModule,
    ToastrModule.forRoot({
      timeOut: 6500,
      extendedTimeOut: 5000,
      progressBar: true,
      closeButton: true,
      preventDuplicates: true,
      positionClass: 'toast-top-center'
    }), // ToastrModule added
    MatCardModule,
    MatButtonModule,
    MaterialModule,
    MedicamentosModule
  ],
  providers: [
    NgxImageCompressService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es-Ar' }
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
