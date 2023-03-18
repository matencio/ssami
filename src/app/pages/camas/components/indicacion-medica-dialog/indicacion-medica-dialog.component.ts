import { Component, EventEmitter, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CamasService } from '../../services/camas.service';
import * as moment from 'moment';
import { IndicacionMedicaFormDialogComponent } from '../indicacion-medica-form-dialog/indicacion-medica-form-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-indicacion-medica-dialog',
  templateUrl: './indicacion-medica-dialog.component.html',
  styleUrls: ['./indicacion-medica-dialog.component.css']
})
export class IndicacionMedicaDialogComponent implements OnInit {
  @ViewChild('verDetalleDialog') verDetalleDialog: TemplateRef<any>; 
  @ViewChild('finalizarIndicacionDialog') finalizarIndicacionDialog: TemplateRef<any>;
  panelOpenState = false;
  loadingIndicaciones = false;
  displayedColumns: string[] = ['indicacion', 'estado', 'fechaInicio', 'fechaFin', 'actions'];
  dataSource: MatTableDataSource<any>;
  allDS: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  onEvolucionar = new EventEmitter();

  myData = [];
  myColumns = [];
  title: string;
  isShowTodas: boolean = true;
  isLoading: boolean = false;
  internacionId: any;

  finalizarFormGroup: FormGroup;
  fechaFin: Date = new Date();
  motivo: string;

  constructor(
    public dialogRef: MatDialogRef<IndicacionMedicaDialogComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any, //cambiar "any" por tipo especifico
    private toastr: ToastrService,
    private _snackBar: MatSnackBar,
    private services: CamasService
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<any>([]); 
    this.dataSource.paginator = this.paginator;
    this.internacionId = this.data.Paciente.Internacions[0].id;
    //Translate Paginator
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator._intl.itemsPerPageLabel = 'Cant. de Indicaciones Médicas por página';
    this.dataSource.paginator._intl.previousPageLabel = 'Anterior';
    this.dataSource.paginator._intl.nextPageLabel = 'Siguiente';
    this.dataSource.paginator._intl.firstPageLabel = 'Primer Página';
    this.dataSource.paginator._intl.lastPageLabel = 'Última Página';
    this.dataSource.paginator._intl.getRangeLabel = (page, pageSize, length) => {
      if (length === 0 || pageSize === 0) {
        return '0 de ' + length;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;
      return startIndex + 1 + ' - ' + endIndex + ' de ' + length;
    };

    this.buildGrid();
  }

  buildGrid() {
    this.loadingIndicaciones = true;
    this.services.getIndicacionesMedicsaByInternacion(this.internacionId).subscribe(
      data => {
        if (data) {
          this.dataSource = new MatTableDataSource<any>(data.indicaciones);
          this.allDS = data.indicaciones;
          this.dataSource.paginator = this.paginator;
          // Mostrar las últimas 5 indicaciones
          this.dataSource.data = data.indicaciones;
          this.dataSource._updateChangeSubscription();
          setTimeout(() => { this.isLoading = false; this.loadingIndicaciones = false; }, 1000)
        }
      }, error => {
        console.error(error)
        this.loadingIndicaciones = false;
        this.isLoading = false;
      }
    );
  }

  focusOnBtn() {
    setTimeout(() => {
      if (document.getElementById("btnShow")) {
        (document.getElementById("btnShow")).focus();
      }
    }, 10);
  }

  //CRUD
  generarIndicacion() {
    const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.maxWidth = "98vw";
      dialogConfig.minWidth = "55vw";
      dialogConfig.maxHeight = "98vh";
      var element = { 
        peso: this.data.Paciente.Internacions[0].peso,
        InternacionId:this.data.Paciente.Internacions[0].id
      };
      dialogConfig.data = element;

      const dialogRef = this.dialog.open(IndicacionMedicaFormDialogComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.length > 0) {
          this.buildGrid();
        } else {
          //no cierro
        }
      })
  }

  verIndicacion(element) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "98vw";
    dialogConfig.minWidth = "55vw";
    dialogConfig.maxHeight = "98vh";

    let detalle = element;

    detalle.nroCama = this.data.nroCama;
    detalle.nombre = this.data.Paciente.nombre;
    detalle.apellido = this.data.Paciente.apellido;
    detalle.fechaNacimiento = this.data.Paciente.fechaNacimiento;
    detalle.diagnosticoInternacion = this.data.Paciente.Internacions[0].diagnostico;
    detalle.medicamento = element.DosisMedicamento.Medicamento.nombre;

    dialogConfig.data = detalle;
    const dialogRef = this.dialog.open(this.verDetalleDialog, dialogConfig);
  }

  editarIndicacion(element) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "98vw";
    dialogConfig.minWidth = "55vw";
    dialogConfig.maxHeight = "98vh";
    dialogConfig.data = element;

    const dialogRef = this.dialog.open(IndicacionMedicaFormDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        this.buildGrid();
      } else {
        //no cierro
      }
    })
  }

  eliminarIndicacion(element) {
    this.finalizarFormGroup = this.fb.group({
      motivo: ['', Validators.required],
      fechaFin: [new Date(), Validators.required],
    });
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = element;
    const dialogRef = this.dialog.open(this.finalizarIndicacionDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        //alert('SERVICIO DAR DE BAJA');
      } else {
        //no cierro
      }
    });
  }

  applyAlta(data) {
    data.fechaFin = this.finalizarFormGroup.value.fechaFin;
    data.motivo = this.finalizarFormGroup.value.motivo;
    this.loadingIndicaciones = true;

    this.services.editarIndicacionMedica(data.id, data).subscribe(
      data => {
        this.toastr.success("Se finalizó correctamente la Indicación Médica");
        this.buildGrid();
      }, error => {
        this.toastr.error("Ocurrió un error al intentar finalizar la Indicación Médica");
        this.loadingIndicaciones = false;
      }
    );
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.finalizarFormGroup.controls[controlName].hasError(errorName);
  }

  mostrarTodas() {
    this.isShowTodas = !this.isShowTodas;
    this.dataSource.data = this.isShowTodas ? this.allDS : this.dataSource.data.slice(0, 5);
    this.dataSource._updateChangeSubscription();
  }

  //Utils
  displayAge(birth) {
    birth = moment(birth);
    var target = moment();
    let months = moment().diff(birth, 'months', true)
    let birthSpan = { year: Math.floor(months / 12), month: Math.floor(months) % 12, day: Math.round((months % 1) * target.daysInMonth()) }
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

}