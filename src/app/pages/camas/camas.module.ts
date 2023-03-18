import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CamasRoutingModule } from './camas-routing.module';
import { CamasDialogComponent } from './components/camas-dialog/camas-dialog.component';
import { CamasPageComponent } from './containers/camas-page/camas-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { EvolucionDialogComponent } from './components/evolucion-dialog/evolucion-dialog.component';
import { DetalleDialogComponent } from './components/detalle-dialog/detalle-dialog.component';
import { EstudioComplementarioDialogComponent } from './components/estudio-complementario-dialog/estudio-complementario-dialog.component';
import { TableDetailDialogComponent } from './components/table-detail-dialog/table-detail-dialog.component';
import { ContainerDetailDialogComponent } from './components/container-detail-dialog/container-detail-dialog.component';
import { SpeechDialogComponent } from './components/speech-dialog/speech-dialog.component';
import { IndicacionMedicaDialogComponent } from './components/indicacion-medica-dialog/indicacion-medica-dialog.component';
import { CalculadoraDialogComponent } from './components/calculadora-dialog/calculadora-dialog.component';
import { IndicacionMedicaFormDialogComponent } from './components/indicacion-medica-form-dialog/indicacion-medica-form-dialog.component';


@NgModule({
  declarations: [
    CamasDialogComponent,
    CamasPageComponent,
    EvolucionDialogComponent,
    DetalleDialogComponent,
    EstudioComplementarioDialogComponent,
    TableDetailDialogComponent,
    ContainerDetailDialogComponent,
    SpeechDialogComponent,
    IndicacionMedicaDialogComponent,
    CalculadoraDialogComponent,
    IndicacionMedicaFormDialogComponent
  ],
  entryComponents: [
    CamasDialogComponent,
    EvolucionDialogComponent,
    EstudioComplementarioDialogComponent,
    TableDetailDialogComponent,
    ContainerDetailDialogComponent
  ],
  imports: [
    HttpClientModule,
    MatNativeDateModule,
    CommonModule,
    CamasRoutingModule,
    MatDialogModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatGridListModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule //Compartido - Comunes
    
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class CamasModule { }
