import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CamasService } from '../../services/camas.service';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { map, startWith } from 'rxjs/operators';
import { StorageService } from 'src/app/pages/auth/services/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

const moment = _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-indicacion-medica-form-dialog',
  templateUrl: './indicacion-medica-form-dialog.component.html',
  styleUrls: ['./indicacion-medica-form-dialog.component.css'],
  providers: [
    { 
      provide: DateAdapter, 
      useClass: MomentDateAdapter, 
      deps: [MAT_DATE_LOCALE] 
    },
    { 
      provide: MAT_DATE_FORMATS, 
      useValue: MY_FORMATS },
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    }
  ]
})
export class IndicacionMedicaFormDialogComponent implements OnInit {
  indicacionFormGroup: FormGroup;
  breakpoint: number;
  maxColumn: number = 4;

  tipoList = [];
  viaList = []; 
  unidadesList = []; 
  tipoDeDosisList = []; 
  frecuenciasList = [];
  frecuenciasDisponiblesList = [];

  noDataToDisplay: boolean = false;
  medicamentoList: any[];
  medicamento: any;
  selectedMedicamento: any;
  dosisMedicamento: any;
  medicamentoListStr: string[] = [];
  filteredOptions: Observable<string[]>;
  medicoId: any;
  isLoading: boolean = false;
  isTopico: boolean = false;
  showDosisCalculada: boolean = false;
  isEdicion: boolean = false;

  medicamentoEdit: any;
  dosisMedicamentoEdit: any;

  dosisMaxima: any;
  showBannerMax: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<IndicacionMedicaFormDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, //cambiar "any" por tipo especifico
    private fb: FormBuilder,
    private services: CamasService,
    private storageService: StorageService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
  ) { 
    this.medicoId = this.storageService.getCurrentUser().id;
  }

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 600) ? 1 : this.maxColumn;

    this.indicacionFormGroup = this.fb.group({
      peso: ['', Validators.required],
      fechaInicio: [new Date(), Validators.required],
      tipo: ['', Validators.required],
      medicamento: ['', [Validators.required, this.selectValueFromList()]],
      frecuencia: ['', Validators.required],
      dosisCalculada: [{value: '', disabled: true }],
      indicacion: ['', Validators.required],
      diagnostico: [''],
      notaMedica: [''],
    });

    this.isLoading = true;

    this.getInitialData();
  }

  getInitialData() {
    this.getTipoMedicamento();
    this.getTipoDeDosisList();
    this.getTipoUnidades();
    this.getFrecuencias();
    this.getViaList();

    this.indicacionFormGroup.get("peso").patchValue(this.data.peso);
    if (this.data && this.data.id) {
      if (this.data.id) {
        //EDICION
        this.isEdicion = true;
        this.getDosisFilterData(this.data.DosisMedicamentoId);
      } else {
        this.isLoading = false;

      }
    } else {
      this.isLoading = false;

    }
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

  getDosisFilterData(id) {
    this.services.getMedicamentoByDosisId(id).subscribe(
      data => {
        if (data && data.response) {
          const medicamento = data.response.medicamento;
          this.buildMedicamentoData(medicamento, id)
        }
      }, error => {
        console.error(error)
      }
    );
  }

  buildMedicamentoData(medicamento, dosisId) {
    const dosis = medicamento.DosisMedicamentos.filter(d => d.id == dosisId);

    if (dosis) {
      this.medicamento = medicamento;
      this.dosisMedicamento = dosis[0];

      this.medicamentoEdit = this.medicamento;
      this.dosisMedicamentoEdit = this.dosisMedicamento;

      //SET TIPO MEDICAMENTO
      this.indicacionFormGroup.get('tipo').setValue(this.medicamento.TipoMedicamentoId);
      this.selectionTipoMedicamento(this.medicamento.TipoMedicamentoId);
    }
  }

  selectValueFromList(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      var hasItem = false;
      this.onChangeMedicamento();
      //this.clearPlanValidators();
      if (this.medicamentoList && this.indicacionFormGroup.controls['medicamento'].value) {
        this.medicamentoList.forEach((m) => {
          if (!hasItem) {
            m.DosisMedicamentos.forEach(
              d => {
                if (!hasItem) {
                  let medicamento = m.nombre + " " + d.dosis
                    + " / " + this.getUnidadDosis(d.UnidadDosisId)
                    + " / " + this.getTipoDosis(d.TipoDosisId)
                    + "  " + " (vía " + this.getViaDosis(d.TipoViumId)
                    + ")";

                  if (medicamento === this.indicacionFormGroup.controls['medicamento'].value) {
                    this.selectedMedicamento = medicamento;
                    this.medicamento = m;
                    this.dosisMedicamento = d;
                    this.getFrecuenciasDisponibles(d.frecuencias);
                    hasItem = true;

                    const peso = this.indicacionFormGroup.controls['peso'].value;
                    const dosisMaximaCalculada = peso * this.medicamento.dosisMaximaDiaria;

                    this.dosisMaxima = this.medicamento.dosisMaximaDiaria + " " + this.getUnidadDosis(this.medicamento.UnidadDosisId); //+ "   (" + dosisMaximaCalculada +" mg)"
                    this.showBannerMax = true;

                    return;
                  }
                }
              }
            )
          }
        });
      } else {
        this.showBannerMax = false;
        this.selectedMedicamento = null;
        this.medicamento = null;
        this.dosisMedicamento = null;
        return null;
      }

      if (!hasItem) {
        this.showBannerMax = false;
        return { 'listNotContainstMedicamento': true };
      }

      return null;
    };
  }

  switchDotsAndCommas(s) {

    function switcher(match) {
      // Switch dot with comma and vice versa
      return (match == ',') ? '.' : ',';
    }
  
    // Replace all occurrences of either dot or comma.
    // Use function switcher to decide what to replace them with.
    return s.replaceAll(/\.|\,/g, switcher);
  }

  selectionMedicamento(value) {
    this.selectedMedicamento = this.indicacionFormGroup.get('medicamento').value;
    if (this.isTopico) {
      this.medicamento = this.selectedMedicamento;
      this.dosisMedicamento = this.selectedMedicamento ? this.selectedMedicamento.DosisMedicamentos[0] : null;
    }
  }

  selectionTipoMedicamento(value) {
    this.isTopico = 5 == value;
    //TODO (matencio): Si es topico, dejar NO requerido los campos "Frecuencia"
    if (this.isTopico && (this.indicacionFormGroup && this.indicacionFormGroup.get('frecuencia'))) {
      this.indicacionFormGroup.get('frecuencia').setValidators(null);
      this.indicacionFormGroup.get('frecuencia').updateValueAndValidity();
      this.indicacionFormGroup.get('frecuencia').setValue(null);
      this.indicacionFormGroup.get('medicamento').setValidators(Validators.required);
      this.indicacionFormGroup.get('medicamento').updateValueAndValidity();
    } else {
      this.indicacionFormGroup.get('frecuencia').setValidators(Validators.required);
      this.indicacionFormGroup.get('frecuencia').updateValueAndValidity();
      this.indicacionFormGroup.get('medicamento').setValidators([Validators.required, this.selectValueFromList()]);
      this.indicacionFormGroup.get('medicamento').updateValueAndValidity();
    }
    this.onChangeTipoMedicamento();
    this.getMedicamentosByTipo(value);
  }

  buildMedicamentosList() {
    if (this.isTopico) {
    } else {
      this.medicamentoList.forEach(
        m => {
          m.DosisMedicamentos.forEach(
            d => {
              let medicamento = m.nombre + " " + d.dosis 
                + " / " + this.getUnidadDosis(d.UnidadDosisId) 
                + " / " + this.getTipoDosis(d.TipoDosisId) 
                + "  " + " (vía " + this.getViaDosis(d.TipoViumId)
                + ")";
  
              this.medicamentoListStr.push(medicamento);
            }
          )
        }
      );
    }

    this.habilitarAutoComplete();
  }

  getUnidadDosis(id) {
    const unidad = this.unidadesList.find(u => u.id === id);
    return unidad ? unidad.descripcion : unidad;
  }

  getTipoDosis(id) {
    const dosis = this.tipoDeDosisList.find(u => u.id === id);
    return dosis ? dosis.descripcion : dosis;
  }

  getViaDosis(id) {
    const via = this.viaList.find(u => u.id === id);
    return via ? via.descripcion : via;
  }

  getFrecuenciasDisponibles(frecuencias) {
    const frecIds = (
      frecuencias && frecuencias.length > 1
        ? frecuencias.split(",").map(Number)
        : [Number(frecuencias)]
    )
    this.frecuenciasDisponiblesList = this.frecuenciasList
      .filter(f => frecIds.includes(f.id))
      .map(f => Number(f.descripcion));
  }

  getMedicamentosByTipo(tipo) {
    this.services.getMedicamentosByTipo(tipo).subscribe(
      data => {
        if (data) {
          const medicamentos = data.medicamentos;
          if (medicamentos && medicamentos.length > 0) {
            this.medicamentoList = medicamentos;
            this.buildMedicamentosList();

            if (this.isEdicion) {
              this.espacialMethod();
            }

            this.noDataToDisplay = false;
          } else {
            this.medicamentoListStr = [];
            this.noDataToDisplay = true;
          }
          setTimeout(() => { this.isLoading = false; }, 1000)
        }
      }, error => {
        console.error(error)
        this.isLoading = false;
      }
    );
  }

  espacialMethod() {
    if (this.isTopico) {
      this.selectedMedicamento = this.medicamento;
      this.indicacionFormGroup.get('medicamento').setValue(this.medicamento);

      this.setCommons();

    } else {
      //Por los eventos se "nulean", los vuelvo a settear
      this.medicamento = this.medicamentoEdit;
      this.dosisMedicamento = this.dosisMedicamentoEdit;

      this.selectedMedicamento = this.medicamento.nombre + " " + this.dosisMedicamento.dosis
        + " / " + this.getUnidadDosis(this.dosisMedicamento.UnidadDosisId)
        + " / " + this.getTipoDosis(this.dosisMedicamento.TipoDosisId)
        + "  " + " (vía " + this.getViaDosis(this.dosisMedicamento.TipoViumId)
        + ")";

        this.indicacionFormGroup.get('medicamento').setValue(this.selectedMedicamento);
    
        this.setCommons();

        this.medicamento = this.medicamentoEdit;
        this.dosisMedicamento = this.dosisMedicamentoEdit;

        this.getFrecuenciasDisponibles(this.dosisMedicamento.frecuencias);
        this.indicacionFormGroup.get("frecuencia").patchValue(this.data.frecuencia);
    }
  }

  setCommons() {
    this.indicacionFormGroup.patchValue({
      peso: this.data.peso,
      fechaInicio: this.data.fechaInicio,
      indicacion: this.data.indicacion,
      diagnostico: this.data.diagnostico,
      notaMedica: this.data.notaMedica
    });
  }

  compareCategoryObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  } 

  resetFields() {
    //Resetear: medicamento seleccionado, frecuencia seleccionada y indicacion calculada (si existe)
  }

  habilitarAutoComplete() {
    this.filteredOptions = this.indicacionFormGroup.controls['medicamento'].valueChanges.pipe(
      startWith(''),
      map((value : any) => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue =value ? value.toString().toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : ''
    return this.medicamentoListStr
      .filter(option =>
        option.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(filterValue) >= 0)
        //.slice(0, 50); // --> Si quiero solamente los primeros 50 (por performance...)
  }

  generarIndicacion() {
    let data = this.indicacionFormGroup.value;
    data.InternacionId = this.data.InternacionId;
    data.DosisMedicamentoId = this.dosisMedicamento.id;
    data.medicoId = this.medicoId;
    data.id = this.data.id ? this.data.id : null;

    this.services.addIndicacionMedica(data).subscribe(
      data => {
        if (data) {
          if (this.isEdicion) {
            this.toastr.success("Se modificó correctamente la Indicación Médica");
          } else {
            this.toastr.success("Se creó correctamente la Indicación Médica");
          }
          this.dialogRef.close("OK")
        }
      }, error => {
        this.toastr.error("Ocurrió un error al intentar guarda la Indicación Médica");
        console.error(error)
      }
    );
  }

  habilitarCalcularDosis() {
    if (!this.isTopico && this.medicamento) {
      const dosis = this.dosisMedicamento.dosis;
      const peso = this.indicacionFormGroup.controls['peso'].value;
      const frecuencia = this.indicacionFormGroup.controls['frecuencia'].value;
      return !(dosis && peso && frecuencia);
    } else {
      return false;
    }
  }

  calcularDosis() {
    // Acá se realizaran los cálculos a partir del medicamento (dosis) seleccionado, frecuencia y peso
    this.medicamento 
    const dosis = this.dosisMedicamento.dosis;
    const medicamento = this.medicamento .nombre;
    const peso = this.indicacionFormGroup.controls['peso'].value;
    const frecuencia = this.indicacionFormGroup.controls['frecuencia'].value;
    const frecuenciaStr = ", cada " + frecuencia + " horas";
    const unidad =  this.getUnidadDosis(this.dosisMedicamento.UnidadDosisId);
    const via =  "(vía " + this.getViaDosis(this.dosisMedicamento.TipoViumId) + ")";

    const tipoDosis = this.getTipoDosis(this.dosisMedicamento.TipoDosisId);

    let dosisCalculada;
    if ("Dosis".toUpperCase() == tipoDosis.toUpperCase()) {
      dosisCalculada = ( dosis * peso ).toFixed(2).toString();
      dosisCalculada = this.switchDotsAndCommas(dosisCalculada);
    } else {
      dosisCalculada = ( dosis * peso * (frecuencia/24) ).toFixed(2).toString();
      dosisCalculada = this.switchDotsAndCommas(dosisCalculada);
    }

    dosisCalculada = dosisCalculada + " " + unidad.split("/")[0] + " de " + medicamento + " " + via + frecuenciaStr;
    this.showDosisCalculada = true;
    this.indicacionFormGroup.controls['dosisCalculada'].setValue(dosisCalculada)
  }

  onChangeTipoMedicamento() {
    // - Limpiar Medicamento Seleccionado
    this.onChangeMedicamento();
    //medicamento
    this.medicamentoListStr = []; //[] o null?
    this.medicamentoList = []; //[] o null?
    if (this.indicacionFormGroup &&  this.indicacionFormGroup.controls['medicamento']) {
      this.indicacionFormGroup.controls['medicamento'].reset();
      this.indicacionFormGroup.controls['medicamento'].setValue(null);
    }
  }

  onChangeMedicamento(medicamento?) {
    this.onChangeFrecuencia()
    //- Limpiar Frecuencia Seleccionada
    this.frecuenciasDisponiblesList = null;
    if (this.indicacionFormGroup && this.indicacionFormGroup.controls['frecuencia']) {
      this.indicacionFormGroup.controls['frecuencia'].reset();
      this.indicacionFormGroup.controls['frecuencia'].setValue(null);
    }
  }

  onChangeFrecuencia(frecuencia?) {
    // - Limpiar siempre DOSIS CALCULADA
    if (this.indicacionFormGroup && this.indicacionFormGroup.controls['dosisCalculada']) {
      this.indicacionFormGroup.controls['dosisCalculada'].reset();
    }

    if (this.indicacionFormGroup && this.indicacionFormGroup.controls['indicacion']) {
      this.indicacionFormGroup.controls['indicacion'].reset();
    }
  }

  copyValue() {
    //TODO (matencio): Implementar copy value
    this.snackBar.open("Valor de dosis copiado correctamente", "OK", {
      horizontalPosition: "start",
      duration: 4000
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.indicacionFormGroup.controls[controlName].hasError(errorName);
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 600) ? 1 : this.maxColumn;
  }

}
