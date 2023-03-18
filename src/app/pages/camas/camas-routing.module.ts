import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CamasPageComponent } from './containers/camas-page/camas-page.component';

const routes: Routes = [
  {
    path: '', // vacío es igual a '/camas'
    component: CamasPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CamasRoutingModule { }
