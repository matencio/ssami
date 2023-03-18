import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import * as moment from 'moment';
import { CamasDialogComponent } from '../../components/camas-dialog/camas-dialog.component';
import { DetalleDialogComponent } from '../../components/detalle-dialog/detalle-dialog.component';
import { EstudioComplementarioDialogComponent } from '../../components/estudio-complementario-dialog/estudio-complementario-dialog.component';
import { EvolucionDialogComponent } from '../../components/evolucion-dialog/evolucion-dialog.component';
import { IndicacionMedicaDialogComponent } from '../../components/indicacion-medica-dialog/indicacion-medica-dialog.component';
import { CamasService } from '../../services/camas.service';

@Component({
  selector: 'app-camas-page',
  templateUrl: './camas-page.component.html',
  styleUrls: ['./camas-page.component.css']
})
export class CamasPageComponent implements OnInit {
  breakpoint: number;
  maxColumn: number = 2;
  isLoading: boolean = false;
  camas: any[] = [];

  /*@ViewChildren('menubtn') menubtn: ElementRef; 
  @ViewChild(MatMenuTrigger) trigger;*/
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  @ViewChild('darDeAltaDialog') darDeAltaDialog: TemplateRef<any>;
  @ViewChild('detalleDialog') detalleDialog: TemplateRef<any>;
  @ViewChild('confirmarDialog') confirmarDialog: TemplateRef<any>;
  //@ViewChild('agregarEstudioComplementarioDialog') agregarEstudioComplementarioDialog: TemplateRef<any>;
  
  
  //contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    public dialog: MatDialog,
    private services: CamasService
  ) { }

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 600) ? 1 : this.maxColumn;

    /*this.isLoading = true;
    setTimeout(() => {
      //
      this.camas = [
        { nroCama: 1, tipoCama: 'Cunón', Paciente: 'Juan Perez' },
        { nroCama: 2, tipoCama: 'Cama', Paciente: null },
        { nroCama: 3, tipoCama: 'Cama', Paciente: 'Jorge Gomez' },
        { nroCama: 4, tipoCama: 'Cama', Paciente: null },
        { nroCama: 5, tipoCama: 'Cunón', Paciente: 'María Lopez' },
        { nroCama: 6, tipoCama: 'Cama', Paciente: null },
        { nroCama: 7, tipoCama: 'Cama', Paciente: null },
        { nroCama: 8, tipoCama: 'Cama', Paciente: null },
        { nroCama: 9, tipoCama: 'Cama', Paciente: null },
        { nroCama: 10, tipoCama: 'Cama', Paciente: null },
      ];
    }, 1500);*/
    this.getCamas();
  }

  getCamas() {
    this.isLoading = true;
    this.services.getCamas().subscribe(
      data => {
        this.camas = data.camas;
        this.camas.sort((a, b) => parseFloat(a.nroCama) - parseFloat(b.nroCama));
        
        //test loading
        setTimeout(() => { this.isLoading = false; }, 450);
      },
      error => {
        console.error(error);
      }
    );
  }

  asignarCama(cama?) {
      //pop up camas
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.maxWidth = "98vw";
      dialogConfig.minWidth = "75vw";
      dialogConfig.maxHeight = "98vh";
      dialogConfig.data = cama;
  
      const dialogRef = this.dialog.open(CamasDialogComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe((result) => {
        //alert(result)
        if (result && 'OK' === result) {
          // llamada a backend para datos de tabla principal (pacientes)
          this.dialog.closeAll();
          //Refresh Camas
          this.getCamas();
        }
      });
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 600) ? 1 : this.maxColumn;
  }

  verDetalles(cama) {
    const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.maxWidth = "98vw";
      dialogConfig.minWidth = "55vw";
      dialogConfig.maxHeight = "98vh";
      dialogConfig.data = cama;
      const dialogRef = this.dialog.open(DetalleDialogComponent, dialogConfig);
      const sub = dialogRef.componentInstance.onEvolucionar.subscribe((data) => {
        this.getCamas();
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.dialog.closeAll();
        }
      });
  }

  verDetalles2(cama) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = cama;

    const dialogRef = this.dialog.open(this.detalleDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result && 'confirm_' === result) {
        //SERVICIO DAR DE BAJA
        //alert('SERVICIO DAR DE BAJA');
      } else {
        //no cierro
      }
    });
  }

  evolucionar(cama) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "98vw";
    dialogConfig.minWidth = "55vw";
    dialogConfig.maxHeight = "98vh";
    dialogConfig.data = cama;

    const dialogRef = this.dialog.open(EvolucionDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result != "yes") {
        this.getCamas();
      }
    });
  }

  indacacionesMedica(cama) {
    console.log("INDCACIONES MEDICAS");
    const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.maxWidth = "98vw";
      dialogConfig.minWidth = "55vw";
      dialogConfig.maxHeight = "98vh";
      dialogConfig.data = cama;
  
      const dialogRef = this.dialog.open(IndicacionMedicaDialogComponent, dialogConfig);
  }

  darDeAlta(cama) {
    //console.log(cama);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = cama;

    const dialogRef = this.dialog.open(this.darDeAltaDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.dialog.closeAll();
      if (result && result.length > 0) {
        //alert('SERVICIO DAR DE BAJA');
      } else {
        //no cierro
      }
    });
  }

  agregarEstudioComplementario(cama) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = cama;
    dialogConfig.maxWidth = "98vw";
    dialogConfig.minWidth = "60vw";
    dialogConfig.maxHeight = "98vh";
    const dialogRef = this.dialog.open(EstudioComplementarioDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.dialog.closeAll();
      if (result && result.length > 0) {
        //alert('SERVICIO DAR DE BAJA');
      } else {
        //no cierro
      }
    });

  }

  applyAlta(data) {
    this.dialog.closeAll();
    //SERVICIO DAR DE BAJA
    this.services.darDeAlta(data).subscribe(
      data => {
        this.dialog.closeAll();
        this.getCamas();
      }, error => {
        console.error("ALTA ERROR: " + error);
      }
    );
  }

  displayAge(birth, target?) {
    let months = moment().diff(birth, 'months', true)
    //let months = target.diff(birth, 'months', true)
    let birthSpan = { year: Math.floor(months / 12), month: Math.floor(months) % 12, day: Math.round((months % 1) * target.daysInMonth()) }
    //let birthSpan = { year: Math.floor(months / 12), month: Math.floor(months) % 12, day: Math.round((months % 1) * target.daysInMonth(), 0) }
    // you can adjust below logic as your requirements by yourself
    if (birthSpan.year < 1 && birthSpan.month < 1) {
      return birthSpan.day + ' día' + (birthSpan.day > 1 ? 's' : '')
    } else if (birthSpan.year < 1) {
      return birthSpan.month + ' meses' + (birthSpan.month > 1 ? 's ' : ' ') + birthSpan.day + ' día' + (birthSpan.day > 1 ? 's' : '')
    } else if (birthSpan.year < 2) {
      return birthSpan.year + ' año' + (birthSpan.year > 1 ? 's ' : ' ') + birthSpan.month + ' month' + (birthSpan.month > 1 ? 's ' : '')
    } else {
      return birthSpan.year + ' año' + (birthSpan.year > 1 ? 's' : '')
    }
  }

  daysTo(fecha) {
    return moment().diff(fecha, 'days') + ' días';
  }

}
