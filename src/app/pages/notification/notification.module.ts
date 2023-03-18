import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {
  ErrorToastrComponent,
  InfoToastrComponent,
  NotificationPageComponent,
  SuccessToastComponent
} from './containers';
import { NotificationRoutingModule } from './notification-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';


@NgModule({
  declarations: [
    NotificationPageComponent,
    SuccessToastComponent,
    ErrorToastrComponent,
    InfoToastrComponent
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MaterialModule,
    SharedModule
  ]
})
export class NotificationModule { }
