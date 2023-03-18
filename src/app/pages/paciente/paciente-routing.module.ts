import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacientePageComponent } from './containers/paciente-page/paciente-page.component';

const routes: Routes = [
  {
    path: '', // vacío es igual a '/paciente'
    component: PacientePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacienteRoutingModule { }
