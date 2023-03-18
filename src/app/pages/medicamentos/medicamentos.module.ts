import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicamentosRoutingModule } from './medicamentos-routing.module';
import { MedicamentosPageComponent } from './containers/medicamentos-page/medicamentos-page.component';
import { MedicamentosDialogComponent } from './components/medicamentos-dialog/medicamentos-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DosisMedicamentoDialogComponent } from './components/dosis-medicamento-dialog/dosis-medicamento-dialog.component';


@NgModule({
  declarations: [
    MedicamentosPageComponent,
    MedicamentosDialogComponent,
    DosisMedicamentoDialogComponent
  ],
  imports: [
    CommonModule,
    MedicamentosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule //Compartido - Comunes
  ]
})
export class MedicamentosModule { }
