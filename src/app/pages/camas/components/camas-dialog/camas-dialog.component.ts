import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';
import { from } from 'rxjs';
import { DateAdapter, ErrorStateMatcher, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { sexo } from 'src/app/consts/enums';
import { MatStepper } from '@angular/material/stepper';
import { NumberInput } from '@angular/cdk/coercion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DecimalPipe, KeyValue } from '@angular/common';
import { CamasService } from '../../services/camas.service';
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
  selector: 'app-camas-dialog',
  templateUrl: './camas-dialog.component.html',
  styleUrls: ['./camas-dialog.component.css'],
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
    },
    DecimalPipe
  ]
})
export class CamasDialogComponent implements OnInit {
  @ViewChild('stepper') private stepper: MatStepper;
  matcher = new MyErrorStateMatcher();
  breakpoint: number;
  maxColumn: number = 4;
  ExistePacienteId = null;

  isLinear: boolean = false;
  loading: boolean = false;
  existePaciente: boolean = false;
  pacienteYaInternado: boolean = false;
  showOtras: boolean = false;
  dniOK: boolean = false;

  @ViewChild('confirmarDialog') confirmarDialog: TemplateRef<any>;

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
    //internacion
    { k: 'dniConfirme', v: 'D.N.I'},
    { k: 'fechaIngreso', v: 'Fecha de Ingreso'},
    { k: 'diagnostico', v: 'Diagnóstico'},
    { k: 'peso', v: 'Peso (Kg)'},
    { k: 'fechaInicioSintoma', v: 'Fecha de Inicio Sintoma'},
    { k: 'causa', v: 'Causa'},
    { k: 'quemado', v: 'Quemado'},
    { k: 'tipoQuemadura', v: 'Tipo de Quemadura'},
    { k: 'porcentaje', v: 'Porcentaje (%)'},
    { k: 'infectado', v: 'Infectado'},
	  { k: 'injertado', v: 'Injertado'},
    { k: 'isRiesgoSocial', v: 'Riesgo Social'},
    { k: 'enfermedadDeBase', v: 'Enfermedad de Base'},
    { k: 'otrasDescripcion', v: 'Otras Enfermedades de Base'}
  ];

  sexoList = [
    'Mujer',
    'Hombre',
    'Otro'
  ];
  paisList = ['ARGENTINA'];
  provinciaList = ['BUENOS AIRES'];
  partidoList = ['LA PLATA', 'BERISSO'];
  tipoCamaList = ['Cama', 'Cuna', 'Cunón'];
  causaList = ['Líquido Caliente', 'Fuego', 'Sólido Caliente', 'Electricidad', 'Química',];
  tipoQuemaduraList = ['A', 'AB', 'B'];

  //enfermedadDeBaseList = ['Hipertensión Arterial', 'Diabetes', 'Obesidad', 'Asma', 'Enfermedad Hepática Crónica', 'Enfermedad Renal Crónica', 'Enfermedad Pulmonar Crónica', 'Enfermedad Cardiovascular Crónica', 'Otra'];
  enfermedadDeBaseList = ['Cardiológicas', 'Respiratorias', 'Genéticas', 'Renales', 'Otras'];

  stepperOrientation: Observable<StepperOrientation>;
  pacienteFormGroup: FormGroup;
  internacionFormGroup: FormGroup; //Internación
  //evolucionFormGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CamasDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, //cambiar "any" por tipo especifico
    private fb: FormBuilder,
    breakpointObserver: BreakpointObserver,
    private toastr: ToastrService,
    private _snackBar: MatSnackBar,
    private services: CamasService
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 600) ? 1 : this.maxColumn;

    //console.log(this.dataKV);

    //console.log(this.dataKV['peso'])
    //console.log(this.dataKV.filter(v => v.k === 'peso')[0].v);

    //this.dataKV.filter(v => v.k === 'peso')

    this.pacienteFormGroup = this.fb.group({
      dni: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: [null, Validators.required], //new Date()
      sexo: ['', Validators.required], // LISTA
      pais: ['', Validators.required], // LISTA '', // 
      provincia: ['', Validators.required], // LISTA '', // 
      partido: ['', Validators.required], // LISTA '', // 
      //cp: ['', Validators.required],
      calle: ['', Validators.required],
      altura: ['', Validators.required],
      //tipoCama: ['', Validators.required], // LISTA
      responsable: ['', Validators.required],
      telefono: ['', Validators.required], //NumbersOnly
    });
    this.internacionFormGroup = this.fb.group({
      dniConfirme: ['', Validators.required],
      fechaIngreso: [null, Validators.required],
      diagnostico: ['', Validators.required],
      peso: ['', Validators.required],
      quemado: [false, Validators.required],
      fechaInicioSintoma: [null, Validators.required],
      causa: '', //['', Validators.required], // LISTA
      injertado: [false, Validators.required],
      infectado: [false, Validators.required],
      tipoQuemadura: '', //['', Validators.required], // LISTA
      porcentaje: '', //['', Validators.required], // NumbersOnly
      isRiesgoSocial: [false, Validators.required],
      enfermedadDeBase: [''],
      otrasDescripcion: ''
    }, {
      validator: this.compareData("dniConfirme")
    });

    //setTimeout(() => { this.loading = false }, 1500);

    /*this.internacionFormGroup.peso.valueChanges
    .pipe( // RxJS pipe composing delay + distinctness filters
        debounceTime(400),
        distinctUntilChanged()
    )
    .subscribe(term => {
      this.searchField.setValue(myPipe.transform(val))
  });*/

  }

  busquedaPordni(dni) {
    this.pacienteYaInternado = false;
    this.ExistePacienteId = null;
    this.loading = true;
    console.log("DNI: " + dni);
    this.services.busquedaPordni(dni).subscribe(
      data => {
        if (data && data.paciente && data.paciente.id) {
          this.ExistePacienteId = data.paciente.id;
          // CONSULTAR SI YA ESTA INTERNADO
          // /internaciones/id
          this.services.getInternacionPaciente(data.paciente.id).subscribe(
            data => {
              if (data && data.internaciones && data.internaciones.length > 0) {
                let internacionEnCurso = data.internaciones.find(i => !i.finalizada);
                if (internacionEnCurso) {
                  //YA EXISTE
                  //this.loading = false;
                  setTimeout(() => { 
                    this.loading = false; 
                    this.toastr.warning("El paciente ya se encuentra internado. Por favor, verifique los datos ingresados.")
                  }, 800);
                  
                  //this.toastr.warning("El paciente ya se encuntra internado. Por favor, verifique los datos ingresados.")
  
                  this.pacienteYaInternado = true;
  
                  return;
                }
              }
            }, error => {
              //error...
              //this.loading = false;
              setTimeout(() => { this.loading = false; }, 800);
              console.log(error);
            }
          );

          //this.loading = false;
          setTimeout(() => { this.loading = false; }, 800);
          this.existePaciente = true;

          setTimeout(() => {
            if (!this.pacienteYaInternado) {
              this.toastr.warning('Existe un paciente para el D.N.I ingresado');
            }
          }, 100);
          //this.toastr.warning('Existe un paciente para el D.N.I ingresado');
          this.pacienteFormGroup.get("dni").disable();
          /// DESHABILITAR DNI ???
          this.pacienteFormGroup.get("nombre").patchValue(data.paciente.nombre);
          this.pacienteFormGroup.get("nombre").disable();
          this.pacienteFormGroup.get("apellido").patchValue(data.paciente.apellido);
          this.pacienteFormGroup.get("apellido").disable();
          this.pacienteFormGroup.get("fechaNacimiento").patchValue(moment(data.paciente.fechaNacimiento));
          this.pacienteFormGroup.get("fechaNacimiento").disable();
          this.pacienteFormGroup.get("sexo").patchValue(data.paciente.sexo);
          this.pacienteFormGroup.get("sexo").disable();
          this.pacienteFormGroup.get("responsable").patchValue(data.paciente.responsable);
          this.pacienteFormGroup.get("responsable").disable();
          this.pacienteFormGroup.get("telefono").patchValue(data.paciente.telefono);
          this.pacienteFormGroup.get("telefono").disable();
          if (data.paciente.direccion) {
            var dir_ = data.paciente.direccion.split('-');
            //ARGENTINA-BUENOS AIRES-LA PLATA-1-681
            this.pacienteFormGroup.get("pais").patchValue(dir_[0]);
            this.pacienteFormGroup.get("pais").disable();
            this.pacienteFormGroup.get("provincia").patchValue(dir_[1]);
            this.pacienteFormGroup.get("provincia").disable();
            this.pacienteFormGroup.get("partido").patchValue(dir_[2]);
            this.pacienteFormGroup.get("partido").disable();
            this.pacienteFormGroup.get("calle").patchValue(dir_[3]);
            this.pacienteFormGroup.get("calle").disable();
            this.pacienteFormGroup.get("altura").patchValue(dir_[4]);
            this.pacienteFormGroup.get("altura").disable();
          }      
        } else {
          //no se encontraron datos
          //this.toastr.info('No se encontraron datos para el D.N.I ingresado. Complete los campos');
          //this.loading = false;
          setTimeout(() => { 
            this.loading = false; 
            this.pacienteYaInternado = false;
            this.existePaciente = false;
            this.toastr.info('No se encontraron datos para el D.N.I ingresado. Complete los campos');
          }, 800);
          this.enablePacienteInputs();
        }
      }, error => {
        this.loading = false;
        //this.loading = false;
        setTimeout(() => { this.loading = false; }, 800);
        console.log(error);
      }
    );
  }

  enablePacienteInputs() {
    this.pacienteFormGroup.get("dni").enable();
    this.existePaciente = false;
    this.pacienteFormGroup.get("nombre").enable();
    this.pacienteFormGroup.get("nombre").reset();
    this.pacienteFormGroup.get("apellido").enable();
    this.pacienteFormGroup.get("apellido").reset();
    this.pacienteFormGroup.get("fechaNacimiento").enable();
    this.pacienteFormGroup.get("fechaNacimiento").reset();
    this.pacienteFormGroup.get("sexo").enable();
    this.pacienteFormGroup.get("sexo").reset();
    this.pacienteFormGroup.get("responsable").enable();
    this.pacienteFormGroup.get("responsable").reset();
    this.pacienteFormGroup.get("telefono").enable();
    this.pacienteFormGroup.get("telefono").reset();
    this.pacienteFormGroup.get("pais").enable();
    this.pacienteFormGroup.get("pais").reset();
    this.pacienteFormGroup.get("provincia").enable();
    this.pacienteFormGroup.get("provincia").reset();
    this.pacienteFormGroup.get("partido").enable();
    this.pacienteFormGroup.get("partido").reset();
    this.pacienteFormGroup.get("calle").enable();
    this.pacienteFormGroup.get("calle").reset();
    this.pacienteFormGroup.get("altura").enable();
    this.pacienteFormGroup.get("altura").reset();

    this.pacienteFormGroup.updateValueAndValidity();
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

  unsorted() { }

  // Preserve original property order
  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

  selectionTipo(event) {
    /*console.log("SELECTEDS: " + this.internacionFormGroup.value.enfermedadDeBase);
    console.log("SELECTION TIPO: " + event.source.value, event.source.selected);
    //this.showOtras = false;*/
    if (event.isUserInput) {
      //Select o deselect "otras" option  
      if ("Otras" == event.source.value) {
        this.showOtras = event.source.selected;
        this.internacionFormGroup.get('otrasDescripcion').setValidators(this.showOtras ? [Validators.required] : null);
        this.internacionFormGroup.get('otrasDescripcion').reset();
        this.internacionFormGroup.updateValueAndValidity();
      } else {
        //is not "otras"
        let selecteds = this.internacionFormGroup.value.enfermedadDeBase;
        if (selecteds.includes("Otras")) {
          if (this.internacionFormGroup.get('otrasDescripcion').hasValidator(Validators.required)) {
            alert("ES REQUERIDO!");
            //es requerido
            return;
          } else {
            this.internacionFormGroup.get('otrasDescripcion').setValidators([Validators.required]);
            this.internacionFormGroup.get('otrasDescripcion').reset();
            this.internacionFormGroup.updateValueAndValidity()
          }
        }
      }
    }
  }

  savePaciente() {
    this.pacienteFormGroup
    var paciente = {
      idCama: this.data.nroCama,
      nombre: this.pacienteFormGroup.value.nombre,
      apellido: this.pacienteFormGroup.value.apellido,
      dni: this.pacienteFormGroup.value.dni,
      sexo: this.pacienteFormGroup.value.sexo,
      direccion: this.pacienteFormGroup.value.pais + "-" + this.pacienteFormGroup.value.provincia + "-" + this.pacienteFormGroup.value.partido 
        + "-" + this.pacienteFormGroup.value.calle + "-" + this.pacienteFormGroup.value.altura,
      fechaNacimiento: this.pacienteFormGroup.value.fechaNacimiento.toDate(),
      telefono: this.pacienteFormGroup.value.telefono,
      responsable: this.pacienteFormGroup.value.responsable,
      injertado: this.internacionFormGroup.value.injertado,
      infectado: this.internacionFormGroup.value.infectado,
      riesgoSocial: this.internacionFormGroup.value.isRiesgoSocial,
      enfermedadBase: this.internacionFormGroup.value.enfermedadDeBase ? this.internacionFormGroup.value.enfermedadDeBase.toString() : null,
      otraEnfermedad: this.internacionFormGroup.value.otrasDescripcion
    }

    if (this.existePaciente && this.ExistePacienteId) {
      var pacienteId = this.ExistePacienteId;
          console.log("PACIENTE EXISTENTE, ID: " + pacienteId);
          //ACTUALIZAR DATOS PACIENTE   id, paciente
          this.services.editarPaciente(pacienteId, paciente).subscribe(
            data => {
              if (data && data.pacienteUpdate) {
                //ACTUALIZADO OK

                //GENERO LA INTERNACION
                var internacion = {
                  pacienteId: pacienteId,
                  fechaIngreso: this.internacionFormGroup.value.fechaIngreso,
                  peso: this.internacionFormGroup.value.peso,
                  diagnostico: this.internacionFormGroup.value.diagnostico,
                  inicioSintomaLesion: this.internacionFormGroup.value.fechaInicioSintoma,
                  tipoQuemadura: (this.internacionFormGroup.value.tipoQuemadura && this.internacionFormGroup.value.tipoQuemadura.length > 0) ? this.internacionFormGroup.value.tipoQuemadura : null, //this.internacionFormGroup.value.tipoQuemadura 
                  causa: (this.internacionFormGroup.value.causa && this.internacionFormGroup.value.causa.length > 0) ? this.internacionFormGroup.value.causa : null, //this.internacionFormGroup.value.causa 
                  porcentaje: (this.internacionFormGroup.value.porcentaje && this.internacionFormGroup.value.porcentaje.toString().length > 0) ? this.internacionFormGroup.value.porcentaje : null,
                }
      
                console.log("INTERNACION SEND: " + JSON.stringify(internacion));
            
                this.services.addInternacion(internacion).subscribe(
                  data => {
                    console.log("ADD INTERNACION: " + JSON.stringify(data));
      
                    //Cerrar Dialog cuando es OK
                    this.dialogRef.close("OK")
                    this.toastr.success("Guardado correctamente...");
                  }, error => {
                    console.error(error);
                  }
                );
              }
            },
            error => {
              console.error(error);
            }
          );

          /*var internacion = {
            pacienteId: pacienteId,
            fechaIngreso: this.internacionFormGroup.value.fechaIngreso,
            peso: this.internacionFormGroup.value.peso,
            diagnostico: this.internacionFormGroup.value.diagnostico,
            inicioSintomaLesion: this.internacionFormGroup.value.fechaInicioSintoma,
            tipoQuemadura: this.internacionFormGroup.value.tipoQuemadura,
            causa: this.internacionFormGroup.value.causa,
            porcentaje: this.internacionFormGroup.value.porcentaje,
          }

          console.log("PACIENTE SEND: " + JSON.stringify(internacion));
      
          this.services.addInternacion(internacion).subscribe(
            data => {
              //console.log("ADD INTERNACION: " + JSON.stringify(data));

              //Cerrar Dialog cuando es OK
              this.dialogRef.close("OK")
              this.toastr.success("Guardado correctamente...");
            }, error => {
              console.log(error);
            }
          );*/
    } else {
      console.log("PACIENTE NUEVO SEND: " + JSON.stringify(paciente));
    // persistir paciente
    // esperar respuesta para obtener el ID
    this.services.addPaciente(paciente).subscribe(
      data => {
        console.log("ADD INTERNACION NUEVO: " + JSON.stringify(data));
        //persistir internacion
        if (data && data.inserted.id) {
          var pacienteId = data.inserted.id;
          console.log(pacienteId);
          var internacion = {
            pacienteId: pacienteId,
            fechaIngreso: this.internacionFormGroup.value.fechaIngreso,
            peso: this.internacionFormGroup.value.peso,
            diagnostico: this.internacionFormGroup.value.diagnostico,
            inicioSintomaLesion: this.internacionFormGroup.value.fechaInicioSintoma,
            tipoQuemadura: (this.internacionFormGroup.value.tipoQuemadura && this.internacionFormGroup.value.tipoQuemadura.length > 0) ? this.internacionFormGroup.value.tipoQuemadura : null, //this.internacionFormGroup.value.tipoQuemadura 
            causa: (this.internacionFormGroup.value.causa && this.internacionFormGroup.value.causa.length > 0) ? this.internacionFormGroup.value.causa : null, //this.internacionFormGroup.value.causa 
            porcentaje: (this.internacionFormGroup.value.porcentaje && this.internacionFormGroup.value.porcentaje.toString().length > 0) ? this.internacionFormGroup.value.porcentaje : null,
          }

          //console.log("PACIENTE SEND: " + JSON.stringify(internacion));
      
          this.services.addInternacion(internacion).subscribe(
            data => {
              console.log("ADD INTERNACION: " + JSON.stringify(data));

              //Cerrar Dialog cuando es OK
              this.dialogRef.close("OK")
              this.toastr.success("Guardado correctamente...");
            }, error => {
              console.error(error);
            }
          );
        }
    
      }, error => {
        console.error(error);
      }
    );
    }

    

    /**
     * fechaIngreso: DataTypes.DATE,
    peso: DataTypes.FLOAT,
    diagnostico: DataTypes.STRING,
    inicioSintomaLesion: DataTypes.DATE,
    tipoQuemadura: DataTypes.STRING,
    causa: DataTypes.STRING,
    porcentaje: DataTypes.FLOAT
     */
  }

  onCloseClick() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = "98vw";
    dialogConfig.minWidth = "50vw";
    dialogConfig.maxHeight = "98vh";
    const dialogRef_ = this.dialog.open(this.confirmarDialog, dialogConfig);

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

  compareData(matchingControlName: string, controlName?: string) {
    return (formGroup: FormGroup) => {
      //const control = formGroup.controls[controlName];
      const control = this.pacienteFormGroup.get("dni"); //this.pacienteFormGroup["dni"];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        this.dniOK = false;
      } else {
        matchingControl.setErrors(null);
        this.dniOK = true;
      }
    };
  }


  quemadoChange(event) {
    /**
     * quemado: [false, Validators.required],
      causa: ['', Validators.required], // LISTA
      tipoQuemadura: ['', Validators.required], // LISTA
      porcentaje: ['', Validators.required], // NumbersOnly
     */
      if (this.internacionFormGroup.get('quemado').value) {
        this.internacionFormGroup.get('causa').setValidators([Validators.required]);
          this.internacionFormGroup.get('tipoQuemadura').setValidators([Validators.required]);
          this.internacionFormGroup.get('porcentaje').setValidators([Validators.required]);
          this.internacionFormGroup.updateValueAndValidity();
        /*setTimeout(() => {
          this.internacionFormGroup.get('causa').setValidators([Validators.required]);
          this.internacionFormGroup.get('tipoQuemadura').setValidators([Validators.required]);
          this.internacionFormGroup.get('porcentaje').setValidators([Validators.required]);
          
          this.internacionFormGroup.get('causa').setValidators(null);
          this.internacionFormGroup.get('tipoQuemadura').setValidators(null);
          this.internacionFormGroup.get('porcentaje').setValidators(null);
        }, 100)*/
  } else {
    this.internacionFormGroup.get('causa').setValidators(null);
    this.internacionFormGroup.get('causa').reset();
    this.internacionFormGroup.get('tipoQuemadura').setValidators(null);
    this.internacionFormGroup.get('tipoQuemadura').reset();
    this.internacionFormGroup.get('porcentaje').setValidators(null);
    this.internacionFormGroup.get('porcentaje').reset();
    this.internacionFormGroup.updateValueAndValidity();
  }
}
  /*
  if (this.codigoSeguridad) {
        setTimeout(() => {
          //.setValidators([Validators.required, this.noWhitespaceValidator]);
          if (this.codigoSeguridadObligatorio) {
            codigoSeguridadInputControl.setValidators([Validators.required, Validators.minLength(this.codigoSeguridadLength), Validators.maxLength(this.codigoSeguridadLength)]);
          } else {
            codigoSeguridadInputControl.setValidators([Validators.minLength(this.codigoSeguridadLength), Validators.maxLength(this.codigoSeguridadLength)]);
          }
          codigoSeguridadInputControl.updateValueAndValidity();
        }, 100);
        */

  showData() {
    //console.log(this.pacienteFormGroup.value);
    //console.log(this.internacionFormGroup.value)
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 600) ? 1 : this.maxColumn;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  goBack() {
    this.stepper.previous();
  }

  goForward() {
    this.stepper.next();
  }

  reset() {
    this.stepper.reset();
  }

  public hasError = (controlName: string, errorName: string) => {
    if (this.pacienteFormGroup.controls[controlName]) {
      return this.pacienteFormGroup.controls[controlName].hasError(errorName);
    } else {
      return this.internacionFormGroup.controls[controlName].hasError(errorName);
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
    this._snackBar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}