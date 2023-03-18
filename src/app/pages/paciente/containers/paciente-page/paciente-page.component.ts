import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PacienteEditorComponent } from '../../components/paciente-editor/paciente-editor.component';
import { PacienteService } from '../../services/paciente.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-paciente-page',
  templateUrl: './paciente-page.component.html',
  styleUrls: ['./paciente-page.component.scss'],
})
export class PacientePageComponent implements OnInit {
  //@Input() pacientesTableData: Paciente[];
  //public displayedColumns: string[] = ['nombre', 'apellido', 'edad', 'estado', 'actions']; //'select', 
  public displayedColumns: string[] = ['dni', 'apellido', 'nombre', 'edad', 'fechaNacimiento', 'internado', 'actions']; //'sexo', 'internado', 
  public dataSource: MatTableDataSource<any>; //MatTableDataSource<Paciente>;
  public selection = new SelectionModel<any>(true, []); // new SelectionModel<Paciente>(true, []);

  data: any;

  public isShowFilterInput = false;
  searchTerm = '';
  searchVisible = false;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild('search') searchElement: ElementRef;

  isLoading: boolean = false;

  pacienteFormGroup: FormGroup;
  dataKV = [
    //datos personales
    { k: 'dni', v: 'D.N.I'},
    { k: 'nombre', v: 'Nombre'},
    { k: 'apellido', v: 'Apellido'},
    { k: 'fechaNacimiento', v: 'Fecha de Nacimiento'},
    { k: 'sexo', v: 'Sexo'},
    { k: 'pais', v: 'País'},
    { k: 'provincia', v: 'Provincia'},
    { k: 'partido', v: 'Partido'},
    { k: 'calle', v: 'Calle'},
    { k: 'altura', v: 'Altura'},
    { k: 'responsable', v: 'Datos Responsable'},
    { k: 'telefono', v: 'Teléfono Responsable'},
  ];
  @ViewChild('detalleDialog') detalleDialog: TemplateRef<any>;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private services: PacienteService
  ) { }

  ngOnInit(): void {
    this.pacienteFormGroup = this.fb.group({
      dni: '',
      nombre: '',
      apellido:'',
      fechaNacimiento:'',
      sexo: '',
      pais: '',
      provincia: '',
      partido:'',
      //cp:'',
      calle: '',
      altura: '',
      //tipoCama:'',
      responsable: '',
      telefono:'',
    });

    this.isLoading = true;

    this.dataSource = new MatTableDataSource<any>([]);
    this.dataSource.paginator = this.paginator;

    this.services.getPacientes().subscribe(
      data => {
        //console.log("PACIENTES: " + JSON.stringify(data))
        this.data = data.pacientes;
        this.dataSource = new MatTableDataSource<any>(this.data); // new MatTableDataSource<Paciente>(this.pacientesTableData);

    this.dataSource.paginator = this.paginator;
    //this.isLoading = false;
    setTimeout(() => { this.isLoading = false; }, 1000)
      }, error => {
        console.error(error)
        this.isLoading = false;
      }
    );

    //Datos de prueba
   /* this.data = [
      { nombre: 'Juan', apellido: 'Sito', edad: '6', estado: 'Internado'},
      { nombre: 'Ernesto', apellido: 'Gonzalez', edad: '3', estado: 'Internado'},
      { nombre: 'Carlitox', apellido: 'Gomez', edad: '2', estado: 'Alta'},
      { nombre: 'Juan', apellido: 'Perez', edad: '5', estado: 'Internado'},
    ];*/
    this.dataSource = new MatTableDataSource<any>(this.data); // new MatTableDataSource<Paciente>(this.pacientesTableData);
    //Translate Paginator
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator._intl.itemsPerPageLabel = 'Cant. de Pacientes por página';
    this.dataSource.paginator._intl.previousPageLabel = 'Anterior';
    this.dataSource.paginator._intl.nextPageLabel = 'Siguiente';
    this.dataSource.paginator._intl.firstPageLabel = 'Primer Página';
    this.dataSource.paginator._intl.lastPageLabel = 'Última Página';
    this.dataSource.paginator._intl.getRangeLabel = (page, pageSize, length)  => {
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
  }

  /** Abrir popup  */
  createPractice(paciente?: any): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "98vw";
    dialogConfig.minWidth = "75vw";
    dialogConfig.maxHeight = "98vh";
    dialogConfig.data = paciente;
    //console.log("CREATEXxxxxxxx: " + JSON.stringify(dialogConfig.data));

    //const dialogRef = this.dialog.open(PacienteDialogComponent, dialogConfig);
    const dialogRef = this.dialog.open(PacienteEditorComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //"REFRESCAR!"
        if ("REFRESCAR!" == result) {
          this.buildTable();
        }
        // llamada a backend para datos de tabla principal (pacientes)
        ////this.getPacientes();
        this.dialog.closeAll();
        this.buildTable();
      }
    });
  }

  buildTable() {
    this.isLoading = true;
    this.services.getPacientes().subscribe(
      data => {
        //console.log("PACIENTES: " + JSON.stringify(data))
        this.data = data.pacientes;
        this.dataSource = new MatTableDataSource<any>(this.data); // new MatTableDataSource<Paciente>(this.pacientesTableData);

        this.dataSource.paginator = this.paginator;

        //this.isLoading = false;
    setTimeout(() => { this.isLoading = false; }, 1000)
      }, error => {
        console.error(error)
        this.isLoading = false;
      }
    );
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public showFilterInput(): void {
    this.isShowFilterInput = !this.isShowFilterInput;
    this.dataSource.filter = ""; //refresh filter

    if (this.isShowFilterInput) {
      setTimeout(()=>{
        this.searchElement.nativeElement.focus();
      },0); 
    }
    //this.dataSource = new MatTableDataSource<any>(); //this.pacientesTableData
  }

  handleSearch(r) {
    if (r.action === 'SEARCH') {
      this.searchTerm = r.query;
    }
  }

  isInternado(item) {
    var isInternado = false;
    if (item && item.Internacions.length > 0) {
      isInternado = item.Internacions.find(i => !i.finalizada);
    }
    return isInternado;
  }

  verPaciente(item) {
    //console.log("VER: " + JSON.stringify(item))
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "98vw";
    dialogConfig.minWidth = "50vw";
    dialogConfig.maxHeight = "98vh";
    dialogConfig.data = item;
    const dialogRef_ = this.dialog.open(this.detalleDialog, dialogConfig);

    dialogRef_.afterClosed().subscribe(result => {
      if (result && 'SIP' === result) {
        //SERVICIO DAR DE BAJA
        //alert('SERVICIO DAR DE BAJA');
        this.dialog.closeAll();
      } else {
        //no cierro
      }
    })
  }

  editarPaciente(item) {
    //console.log("EDITAR: " + JSON.stringify(item))
    this.createPractice(item);
  }

  deletePaciente(item) {
    //console.log("DELETE: " + JSON.stringify(item))
  }

  displayAge(birth) {
    birth = moment(birth);
    var target = moment();
    let months = moment().diff(birth, 'months', true)
    let birthSpan = { year: Math.floor(months / 12), month: Math.floor(months) % 12, day: Math.round((months % 1) * target.daysInMonth()) }
    if (birthSpan.year < 1 && birthSpan.month < 1) {
      return birthSpan.day + ' día' + (birthSpan.day > 1 ? 's' : '')
    } else if (birthSpan.year < 1) {
      return birthSpan.month + ' mes' + (birthSpan.month > 1 ? 'es ' : ' ') + birthSpan.day + ' día' + (birthSpan.day > 1 ? 's' : '')
    } else if (birthSpan.year < 2) {
      return birthSpan.year + ' año' + (birthSpan.year > 1 ? 's ' : ' ') + birthSpan.month + ' month' + (birthSpan.month > 1 ? 's ' : '')
    } else {
      return birthSpan.year + ' año' + (birthSpan.year > 1 ? 's' : '')
    }
  }

  getInputName(key) {
    return this.dataKV.filter(data => data.k === key)[0].v; 
  }

  getPipeValueType(value) {
    //console.log(value);
    if (value != null) {
      if (value instanceof moment) {
        return moment(value).format('DD/MM/YYYY');
      } else if (typeof value == "boolean") {
        return value ? 'Si' : 'No';
      } else if (value === ''){
        return '  -  ';
      } else {
        return value;
      }
    } else {
      return '  -  ';
    }
  }

  // Preserve original property order
  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

}
