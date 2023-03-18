import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstadisticaRoutingModule } from './estadistica-routing.module';
import { EstadisticaPageComponent } from './containers/estadistica-page/estadistica-page.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    EstadisticaPageComponent
  ],
  imports: [
    CommonModule,
    EstadisticaRoutingModule,
    MaterialModule,
    NgxChartsModule,
    SharedModule //Compartido - Comunes
  ]
})
export class EstadisticaModule { }
