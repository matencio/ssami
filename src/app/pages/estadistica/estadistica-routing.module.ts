import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EstadisticaPageComponent } from './containers/estadistica-page/estadistica-page.component';

const routes: Routes = [
  {
    path: '', // vacío es igual a '/estadistica'
    component: EstadisticaPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadisticaRoutingModule { }
