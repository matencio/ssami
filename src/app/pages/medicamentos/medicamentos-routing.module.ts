import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicamentosPageComponent } from './containers/medicamentos-page/medicamentos-page.component';

const routes: Routes = [
  {
    path: '', // vacío es igual a '/paciente'
    component: MedicamentosPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicamentosRoutingModule { }
