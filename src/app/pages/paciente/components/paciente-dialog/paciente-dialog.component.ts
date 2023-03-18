import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-paciente-dialog',
  templateUrl: './paciente-dialog.component.html',
  styleUrls: ['./paciente-dialog.component.css']
})
export class PacienteDialogComponent implements OnInit {
  breakpoint: number;
  maxColumn: number = 4;
  constructor() { }

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 600) ? 1 : this.maxColumn;
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 600) ? 1 : this.maxColumn;
  }

}
