import { Component } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  notificacions: number = 0; //4;

  openNotification() {
    this.notificacions = 0;
  }
}
