import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CamasService } from '../../services/camas.service';
import { MY_FORMATS } from '../camas-dialog/camas-dialog.component';

@Component({
  selector: 'app-estudio-complementario-dialog',
  templateUrl: './estudio-complementario-dialog.component.html',
  styleUrls: ['./estudio-complementario-dialog.component.css'],
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
  ], changeDetection: ChangeDetectionStrategy.Default
})
export class EstudioComplementarioDialogComponent implements OnInit {

  estudioComplementarioFormGroup: FormGroup;
  maxDate: Date = new Date();
  estudioComplementarioList = ['PCR', 'Serología', 'Química', 'Hemograma', 'Coagulograma'];
  serologiaList = ['HIV', 'Toxo', 'VDRL', 'EB', 'CMV', 'HEP B', 'HEP C' ,'Parvovirus', 'Micoplasma', 'Bartonella', 'Otras'];
  quimicaList = ['Func. Renal', 'Func. Hepática', 'Glucemia', 'Esd', 'Otras'];
  origenList = ['Interno', 'Externo'];
  selectedEstudio: string;
  showOtras: boolean = false;
  
  constructor(
    public dialogRef: MatDialogRef<EstudioComplementarioDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, //cambiar "any" por tipo especifico
    private fb: FormBuilder,
    private services: CamasService
  ) { }

  ngOnInit(): void {
    this.estudioComplementarioFormGroup = this.fb.group({
      fecha: [new Date(), Validators.required],
      origen: ['', Validators.required],
      estudioComplementario: ['', Validators.required],
      //PCR
      resultadoPCR: ['', Validators.required],
      //Todos
      tomarValor: ['true', Validators.required], //''
      otro: [''],
      tipo: [''],
      //Hemograma
      globulosRojos: ['', Validators.required],
      globulosBlancos: ['', Validators.required],
      hto: ['', Validators.required],
      hb: ['', Validators.required],
      //Coagulograma
      p: ['', Validators.required],
      kptt: ['', Validators.required],
      plaquetas: ['', Validators.required],
    });
  }

  agregarEstudio() {
    var estudioComplementario = { 
      tipoEstudioComplementario: this.estudioComplementarioFormGroup.value.estudioComplementario,
      data: null,
    }
    if ('PCR' == this.selectedEstudio) { // 1
      var pcr = {
        fecha: this.estudioComplementarioFormGroup.value.fecha,
        origen: this.estudioComplementarioFormGroup.value.origen,
        resultadoPCR: this.estudioComplementarioFormGroup.value.resultadoPCR,
        tomarValor: this.estudioComplementarioFormGroup.value.tomarValor,
        internacionId: this.data.Paciente.Internacions[0].id
      }
      estudioComplementario.data = pcr;
    } else if ('Serología' == this.selectedEstudio) {
      var serologia = {
        fecha: this.estudioComplementarioFormGroup.value.fecha,
        origen: this.estudioComplementarioFormGroup.value.origen,
        tipo: this.estudioComplementarioFormGroup.value.tipo,
        otro: this.estudioComplementarioFormGroup.value.otro,
        internacionId: this.data.Paciente.Internacions[0].id
      }
      estudioComplementario.data = serologia;

    } else if ('Química' == this.selectedEstudio) {
      var quimica = {
        fecha: this.estudioComplementarioFormGroup.value.fecha,
        origen: this.estudioComplementarioFormGroup.value.origen,
        tipo: this.estudioComplementarioFormGroup.value.tipo,
        otro: this.estudioComplementarioFormGroup.value.otro,
        internacionId: this.data.Paciente.Internacions[0].id
      }
      estudioComplementario.data = quimica;

    } else if ('Hemograma' == this.selectedEstudio) {
      var hemograma = {
        fecha: this.estudioComplementarioFormGroup.value.fecha,
        origen: this.estudioComplementarioFormGroup.value.origen,
        globulosRojos: this.estudioComplementarioFormGroup.value.hb,
        globulosBlancos: this.estudioComplementarioFormGroup.value.hb,
        hto: this.estudioComplementarioFormGroup.value.hto,
        hb: this.estudioComplementarioFormGroup.value.hb,
        tomarValor: this.estudioComplementarioFormGroup.value.tomarValor,
        internacionId: this.data.Paciente.Internacions[0].id
      }
      estudioComplementario.data = hemograma;

    } else if ('Coagulograma' == this.selectedEstudio) {
      var coagulograma = {
        fecha: this.estudioComplementarioFormGroup.value.fecha,
        origen: this.estudioComplementarioFormGroup.value.origen,
        p: this.estudioComplementarioFormGroup.value.p,
        kptt: this.estudioComplementarioFormGroup.value.kptt,
        plaquetas: this.estudioComplementarioFormGroup.value.plaquetas,
        tomarValor: this.estudioComplementarioFormGroup.value.tomarValor,
        internacionId: this.data.Paciente.Internacions[0].id
      }
      estudioComplementario.data = coagulograma;
    }

    //console.log("DATA: " + JSON.stringify(estudioComplementario));
  }

  selectionTipoEstudioComplementario(tipo) {
    this.selectedEstudio = tipo;
    //setTimeout(() => { this.estudioComplementarioFormGroup.get('tomarValor').setValue("true"); }, 800);
    //this.estudioComplementarioFormGroup.get('tomarValor').setValue("true");
    if ('PCR' == tipo) {
      //reset
      this.resetAndUntouchedFields(["resultadoPCR", "tipo", "otro", "p", "kptt", "plaquetas", "globulosRojos", "globulosBlancos", "hto", "hb"]);
      this.estudioComplementarioFormGroup.updateValueAndValidity();

      this.estudioComplementarioFormGroup.get('resultadoPCR').setValidators([Validators.required]);
      //this.estudioComplementarioFormGroup.get('tomarValor').reset();
      this.estudioComplementarioFormGroup.get('tomarValor').setValue("true");
      this.estudioComplementarioFormGroup.updateValueAndValidity();
    } else if ('Serología' == tipo) {
      //reset
      this.resetAndUntouchedFields(["resultadoPCR", "tipo", "otro", "p", "kptt", "plaquetas", "globulosRojos", "globulosBlancos", "hto", "hb"]);
      this.estudioComplementarioFormGroup.updateValueAndValidity();

      this.estudioComplementarioFormGroup.get('tipo').setValidators([Validators.required]);
      this.estudioComplementarioFormGroup.get('otro').setValidators([Validators.required]);
      //this.estudioComplementarioFormGroup.get('tomarValor').reset();
      this.estudioComplementarioFormGroup.get('tomarValor').setValue("true");
      this.estudioComplementarioFormGroup.updateValueAndValidity();
    } else if ('Química' == tipo) {
      //reset
      this.resetAndUntouchedFields(["resultadoPCR", "tipo", "otro", "p", "kptt", "plaquetas", "globulosRojos", "globulosBlancos", "hto", "hb"]);
      this.estudioComplementarioFormGroup.updateValueAndValidity();

      this.estudioComplementarioFormGroup.get('tipo').setValidators([Validators.required]);
      this.estudioComplementarioFormGroup.get('otro').setValidators([Validators.required]);
      //this.estudioComplementarioFormGroup.get('tomarValor').reset();
      this.estudioComplementarioFormGroup.get('tomarValor').setValue("true");
      this.estudioComplementarioFormGroup.updateValueAndValidity();
    } else if ('Hemograma' == tipo) {
      //reset
      this.resetAndUntouchedFields(["resultadoPCR", "tipo", "otro", "p", "kptt", "plaquetas"]);
      this.estudioComplementarioFormGroup.updateValueAndValidity();

      this.estudioComplementarioFormGroup.get('globulosRojos').setValidators([Validators.required]);
      this.estudioComplementarioFormGroup.get('globulosBlancos').setValidators([Validators.required]);
      this.estudioComplementarioFormGroup.get('hto').setValidators([Validators.required]);
      this.estudioComplementarioFormGroup.get('hb').setValidators([Validators.required]);
      //this.estudioComplementarioFormGroup.get('tomarValor').reset();
      this.estudioComplementarioFormGroup.get('tomarValor').setValue("true");
      this.estudioComplementarioFormGroup.updateValueAndValidity();
    } else if ('Coagulograma' == tipo) {
      //reset
      this.resetAndUntouchedFields(["resultadoPCR", "tipo", "otro", "globulosRojos", "globulosBlancos", "hto", "hb"]);
      this.estudioComplementarioFormGroup.updateValueAndValidity();

      this.estudioComplementarioFormGroup.get('p').setValidators([Validators.required]);
      this.estudioComplementarioFormGroup.get('kptt').setValidators([Validators.required]);
      this.estudioComplementarioFormGroup.get('plaquetas').setValidators([Validators.required]);
      //this.estudioComplementarioFormGroup.get('tomarValor').reset();
      this.estudioComplementarioFormGroup.get('tomarValor').setValue("true");
      this.estudioComplementarioFormGroup.updateValueAndValidity();
    } else {
      //reset
      this.resetAndUntouchedFields(["resultadoPCR", "tipo", "otro", "p", "kptt", "plaquetas", "globulosRojos", "globulosBlancos", "hto", "hb"]);
      this.estudioComplementarioFormGroup.updateValueAndValidity();
    }
  }

  resetAndUntouchedFields(fields) {
    fields.forEach(f => {
      var formInput = this.estudioComplementarioFormGroup.get(f);
      //console.log(f)
      if (formInput) {
        formInput.setValidators(null)
        formInput.reset();
        formInput.setErrors(null); 
      }
    });
  }

  selectionTipo(tipo) {
      this.showOtras = "Otras" == tipo;
      if (this.showOtras) {
        this.estudioComplementarioFormGroup.get('otro').setValidators([Validators.required]);
        this.estudioComplementarioFormGroup.updateValueAndValidity();
      } else {
        this.estudioComplementarioFormGroup.get('otro').setValidators(null);
        this.estudioComplementarioFormGroup.updateValueAndValidity();
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
    if (this.estudioComplementarioFormGroup.controls[controlName]) {
      return this.estudioComplementarioFormGroup.controls[controlName].hasError(errorName);
    } else {
      return this.estudioComplementarioFormGroup.controls[controlName].hasError(errorName);
    }
  }

}
