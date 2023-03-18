import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/pages/auth/models';
import { StorageService } from 'src/app/pages/auth/services/storage.service';
import { CamasService } from 'src/app/pages/camas/services/camas.service';
import { DosisMedicamentoDialogComponent } from '../dosis-medicamento-dialog/dosis-medicamento-dialog.component';

@Component({
  selector: 'app-medicamentos-dialog',
  templateUrl: './medicamentos-dialog.component.html',
  styleUrls: ['./medicamentos-dialog.component.scss']
})
export class MedicamentosDialogComponent implements OnInit {
  @ViewChild('deleteDialog') deleteDialog: TemplateRef<any>;
  user: User;
  panelOpenState = false;
  bannerMsg = `La correcta carga de los medicamentos, sus dosis, unidades, etc, junto con la indicación \n 
     y la verificación del cálculo de dosis a aplicar, son y serán responsabilidad del profesional, \n
     haciendo uso de las herramientas disponibles utilizando su`; //criterio profesional.
  showBanner: boolean = true;
  
  medicamentoFormGroup: FormGroup;
  dosisMedicamentoList = [];

  viaList = []; 
  unidadesList = []; 
  tipoDeDosisList = []; 
  frecuenciasList = [];
  tipoList = [];

  isLoading: boolean = false;
  loadingDosis: boolean = false;
  isShowTodas: boolean = false;
  isTopico: boolean = true; //false;
  isEdicion: boolean = false;
  isView: boolean = false;
  tipoMedicamentoView: any;
  nombreView: any;
  dosisUnidadView: any;
  displayedColumns: string[] = ['dosis', 'unidad', 'tipoDosis', 'via', 'frecuencias', 'actions'];
  displayedViewColumns: string[] = ['dosis', 'unidad', 'tipoDosis', 'via', 'frecuencias'];
  dataSource: MatTableDataSource<any>;
  @ViewChild('paginatorDosis') paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<MedicamentosDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, //cambiar "any" por tipo especifico
    private fb: FormBuilder,
    private toastr: ToastrService,
    private storageService: StorageService,
    private services: CamasService
  ) { 
    this.user = this.storageService.getCurrentUser();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.medicamentoFormGroup = this.fb.group({
      tipo: ['', Validators.required],
      nombre: ['', Validators.required],
      dosisMaximaDiaria: ['', Validators.required],
      dosisMaximaUnidad: ['', Validators.required],
    });

    this.getInitialData();
    this.dataSource = new MatTableDataSource<any>([]); 
    this.dataSource.paginator = this.paginator;

    if (this.data) {
      if (this.data.isView) {
        //is view
        this.isView = this.data.isView;
      } else {
        //is edition
        this.isEdicion = true;
      }
      this.getMedicamentoData(this.data.id);
    } else { this.isLoading = false; }
  }

  getInitialData() {
    this.getTipoMedicamento();
    this.getTipoDeDosisList();
    this.getTipoUnidades();
    this.getFrecuencias();
    this.getViaList();
  }

  getTipoMedicamento() {
    this.services.getTipoMedicamento().subscribe(
      data => {
        if (data && data.tipoMedicamento) {
          this.tipoList = data.tipoMedicamento;
        }
      }, error => {
        console.error(error)
      }
    );
  }

  getTipoDeDosisList() {
    this.services.getTipoDosis().subscribe(
      data => {
        if (data && data.tipoDosis) {
          this.tipoDeDosisList = data.tipoDosis;
        }
      }, error => {
        console.error(error)
      }
    );
  }

  getTipoUnidades() {
    this.services.getUnidadDosis().subscribe(
      data => {
        if (data && data.unidadDosis) {
          this.unidadesList = data.unidadDosis;
        }
      }, error => {
        console.error(error)
      }
    );
  }

  getViaList() {
    this.services.getTipoVia().subscribe(
      data => {
        if (data && data.tipoVia) {
          this.viaList = data.tipoVia;
        }
      }, error => {
        console.error(error)
      }
    );
  }

  getTipoUnidadesDescripcion(id) {
    const unidad = this.unidadesList.find(u => u.id === id);
    return unidad ? unidad.descripcion : unidad;
  }

  getTipoDosisDescripcion(id) {
    const dosis = this.tipoDeDosisList.find(u => u.id === id);
    return dosis ? dosis.descripcion : dosis;
  }

  getViaDosisDescripcion(id) {
    const via = this.viaList.find(u => u.id === id);
    return via ? via.descripcion : via;
  }

  selectionTipoMedicamento(value) {
    this.isTopico = 5==value; //'Tópicos'== value;
    if (this.isTopico) {
      this.medicamentoFormGroup.get('dosisMaximaDiaria').setValidators(null);
      this.medicamentoFormGroup.get('dosisMaximaDiaria').updateValueAndValidity();
      this.medicamentoFormGroup.get('dosisMaximaDiaria').setValue(null);
      this.medicamentoFormGroup.get('dosisMaximaUnidad').setValidators(null);
      this.medicamentoFormGroup.get('dosisMaximaUnidad').updateValueAndValidity();
      this.medicamentoFormGroup.get('dosisMaximaUnidad').setValue(null);
    } else {
      this.medicamentoFormGroup.get('dosisMaximaDiaria').setValidators(Validators.required);
      this.medicamentoFormGroup.get('dosisMaximaDiaria').updateValueAndValidity();
      this.medicamentoFormGroup.get('dosisMaximaUnidad').setValidators(Validators.required);
      this.medicamentoFormGroup.get('dosisMaximaUnidad').updateValueAndValidity();
    }
  }

  getMedicamentoData(id) {
    this.loadingDosis = true;
    this.services.getMedicamento(id).subscribe(
      data => {
        if (data) {
          this.medicamentoFormGroup.patchValue({
            tipo: data.medicamento.TipoMedicamentoId,
            nombre: data.medicamento.nombre,
            dosisMaximaDiaria: data.medicamento.dosisMaximaDiaria,
            dosisMaximaUnidad: data.medicamento.UnidadDosisId,
          });

          if (this.isView) {
            this.tipoMedicamentoView = this.getTipoMedicamentoDescripcion(data.medicamento.TipoMedicamentoId);
            this.nombreView = data.medicamento.nombre;
            this.dosisUnidadView = data.medicamento.dosisMaximaDiaria + " " + this.getTipoUnidadesDescripcion(data.medicamento.UnidadDosisId)
          }

          this.selectionTipoMedicamento(data.medicamento.TipoMedicamentoId)
          
          this.buildDosisMedicamentoList(data.medicamento.DosisMedicamentos);
        }
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
        console.error(error)
      }
    );
  }

  getTipoMedicamentoDescripcion(id) {
    const tipoMedicamento = this.tipoList.find(u => u.id === id);
    return tipoMedicamento ? tipoMedicamento.descripcion : tipoMedicamento;
  }

  buildDosisMedicamentoList(data) {
    data.forEach(
      dm => {
        dm.tipoDosis = dm.TipoDosisId;
        dm.unidad = dm.UnidadDosisId;
        dm.via = dm.TipoViumId;
        dm.frecuencias = (
          dm.frecuencias && dm.frecuencias.length > 1
            ? dm.frecuencias.split(",").map(Number)
            : [Number(dm.frecuencias)]
        )
        if (this.isEdicion) {
          dm.hasChange = false;
        }
      }
    );
    this.dosisMedicamentoList = data;

    this.refreshDataSource();
  }

  getFrecuenciasGrid(ids) {
    var frec = [];
    this.frecuenciasList.forEach(
      f => { 
        if (ids.includes(f.id)) {
          frec.push(f.descripcion)
        }
      }
    );

    return frec.toString();
  }

  getFrecuencias() {
    this.services.getFrecuencias().subscribe(
      data => {
        if (data && data.frecuencias) {
          this.frecuenciasList = data.frecuencias;
        }
      }, error => {
        console.error(error)
      }
    );
  }

  agregarDosis(dosis?) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "98vw";
    dialogConfig.minWidth = "55vw";
    dialogConfig.maxHeight = "98vh";
    dialogConfig.data = dosis;

    const dialogRef = this.dialog.open(DosisMedicamentoDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this.loadingDosis = true;
          this.refreshDataSource();
          //Set Id based in last one
          if (!data.id) {
            //var lastId = this.dosisMedicamentoList.length > 0 ? this.dosisMedicamentoList[this.dosisMedicamentoList.length - 1].Id : 0;
            var lastId = this.dosisMedicamentoList.length > 0 ? this.dosisMedicamentoList[this.dosisMedicamentoList.length - 1].id : 0;
            data.id = (lastId + 1);
            data.isNew = true;

            data.frecuencias = data.frecuencias && data.frecuencias.length > 1
              ? data.frecuencias.split(",").map(Number)
              : [Number(data.frecuencias)];

            this.dosisMedicamentoList.push(data);
          } else {
            //var index_ = this.dosisMedicamentoList.find(d => d.Id == data.Id);
            var index_ = this.dosisMedicamentoList.indexOf(dosis);
            data.hasChange = true;
            this.dosisMedicamentoList[index_] = data;
          }
          this.refreshDataSource();
        }
      }
    );
  }

  canSave() {
    if (this.isTopico) {
      return this.medicamentoFormGroup.valid;
    } else {
      return this.medicamentoFormGroup.valid && (this.dataSource && this.dataSource.data && this.dataSource.data.length > 0);
    }
  }

  refreshDataSource() {
    this.dataSource.data = this.dosisMedicamentoList;
    if (this.dataSource.paginator && this.dataSource.paginator._intl && !("Siguiente" === this.dataSource.paginator._intl.previousPageLabel)) {
      this.translatePaginator();
    }
    this.dataSource._updateChangeSubscription();
    this.loadingDosis = false;
  }

  translatePaginator() {
    //Translate Paginator
    this.dataSource.paginator._intl.itemsPerPageLabel = 'Cant. de Dosis por página';
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
  }

  agregarMedicamento() {
    let data = {
      user : this.user,
      medicamento:  this.medicamentoFormGroup.value,
      dosisMedicamentoList: this.dosisMedicamentoList
    }

    if (this.isEdicion) {
      data.medicamento.id = this.data.id;
    }

    //Add enum type ID (ver sino de cambiar directamente el FormController)
    data.medicamento.TipoMedicamentoId = this.medicamentoFormGroup.value.tipo;
    data.medicamento.UnidadDosisId = this.medicamentoFormGroup.value.dosisMaximaUnidad;

    if (this.isTopico) {
      const dosis = { 
        dosis: 0,
        UnidadDosisId: null,
        TipoDosisId: null,
        TipoViumId: 3,
        frecuencias: "24", //24 -> id = 6
        isNew: true
      } 
      data.dosisMedicamentoList = [];
      data.dosisMedicamentoList.push(dosis);
    }

    this.services.addMedicamento(data).subscribe(
      data => {
        if (data) {
          if (this.isEdicion) {
            this.toastr.success("Se modificó correctamente el Medicamento y sus Dosis");
          } else {
            this.toastr.success("Se creó correctamente el Medicamento y sus Dosis");
          }
        }
        this.dialogRef.close("OK");
      }, error => {
        console.error(error);
        this.toastr.error("Ocurrió un error al intentar guarda el Medicamento y sus Dosis");
      }
    );
  }

  verDosisMedicamento(element) {
    //console.log("VER DOSIS MEDICAMENTO")
  }

  editarDosisMedicamento(element) {
    this.agregarDosis(element);
  }

  eliminarDosisMedicamento(element) {
    const dialogRef = this.dialog.open(this.deleteDialog, {
      disableClose: true,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //DELETE
        this.dosisMedicamentoList.splice(this.dosisMedicamentoList.indexOf(element), 1)
        this.refreshDataSource();
      }
    });
  }

  mostrarTodas() {
    this.isShowTodas = !this.isShowTodas; 
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.medicamentoFormGroup.controls[controlName].hasError(errorName);
  }

  public hasErrorDosis = (controlName: string, errorName: string, i: number) =>{
    return (<FormArray>this.medicamentoFormGroup.get('dosisMedicamento')).at(i).get(controlName).hasError(errorName);
  }

}
