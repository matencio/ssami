import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CamasService } from 'src/app/pages/camas/services/camas.service';

@Component({
  selector: 'app-dosis-medicamento-dialog',
  templateUrl: './dosis-medicamento-dialog.component.html',
  styleUrls: ['./dosis-medicamento-dialog.component.css']
})
export class DosisMedicamentoDialogComponent implements OnInit {
  dosisMedicamentoFormGroup: FormGroup;
  viaList = []; 
  unidadesList = []; 
  tipoDeDosisList = []; 
  frecuenciasList = [];
  isLoading: boolean = false;
  showOtra: boolean = false;
  hasChange: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DosisMedicamentoDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, //cambiar "any" por tipo especifico
    private fb: FormBuilder,
    private services: CamasService
  ) { }

  ngOnInit(): void {
    this.dosisMedicamentoFormGroup = this.fb.group({
      dosis: ['', Validators.required],
      tipoDosis: ['', Validators.required],
      unidad: ['', Validators.required],
      via: ['', Validators.required],
      //frecuencias: [[], Validators.required],
      frecuencias: ['', Validators.required],
      otraFrecuencia: [null]
    });

    this.getInitialData();

    if (this.data) {
      this.isLoading = true;
      //es edicion
      this.dosisMedicamentoFormGroup.patchValue(this.data);
      setTimeout(() => { this.isLoading = false; }, 1000);

      this.onCreateGroupFormValueChange();
    }
  }

  onCreateGroupFormValueChange(){
    const initialValue = this.dosisMedicamentoFormGroup.value
    this.dosisMedicamentoFormGroup.valueChanges.subscribe(value => {
      this.hasChange = Object.keys(initialValue).some(key => this.dosisMedicamentoFormGroup.value[key] != 
                        initialValue[key])
    });
}

  getInitialData() {
    this.getTipoDeDosisList();
    this.getTipoUnidades();
    this.getFrecuencias();
    this.getViaList();
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

  agregarDosisMedicamento() {
    let result = this.dosisMedicamentoFormGroup.value;

    result.UnidadDosisId = this.dosisMedicamentoFormGroup.value.unidad;
    result.TipoDosisId = this.dosisMedicamentoFormGroup.value.tipoDosis;
    result.TipoViumId = this.dosisMedicamentoFormGroup.value.via;
    result.frecuencias = this.dosisMedicamentoFormGroup.value.frecuencias ? this.dosisMedicamentoFormGroup.value.frecuencias.toString() : null;

    if (this.data) {
      result.id = this.data.id;
    }
    this.dialogRef.close(result)
  }

  selectionTipo(event) {
    if (event.isUserInput) {
      //Select o deselect "otras" option  
      if ("Otra" == event.source.value) {
        this.showOtra = event.source.selected;
        this.dosisMedicamentoFormGroup.get('otraFrecuencia').setValidators(this.showOtra ? [Validators.required] : null);
        this.dosisMedicamentoFormGroup.get('otraFrecuencia').reset();
        this.dosisMedicamentoFormGroup.updateValueAndValidity();
      } else {
        //is not "otras"
        let selecteds = this.dosisMedicamentoFormGroup.value.frecuencias;
        if (selecteds.includes("Otra")) {
          if (this.dosisMedicamentoFormGroup.get('otraFrecuencia').hasValidator(Validators.required)) {
            return;
          } else {
            this.dosisMedicamentoFormGroup.get('otraFrecuencia').setValidators([Validators.required]);
            this.dosisMedicamentoFormGroup.get('otraFrecuencia').reset();
            this.dosisMedicamentoFormGroup.updateValueAndValidity()
          }
        }
      }
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.dosisMedicamentoFormGroup.controls[controlName].hasError(errorName);
  }

  comparer(o1: any, o2: any): boolean {
    // if possible compare by object's name property - and not by reference.
    return o1 && o2 ? o1.descripcion === o2.descripcion : o2 === o2;
  }

  /*compareCategoryObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  } 


  compareWithFn(optionOne: any, optionTwo: any): boolean {
    if (typeof optionOne === "string" && typeof optionTwo === "string") {
      return optionOne === optionTwo;
    } else {
      return optionOne === optionTwo; //_.isEqual(optionOne, optionTwo);
    }
  }*/

}
