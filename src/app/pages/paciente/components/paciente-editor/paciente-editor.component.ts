import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { CamasService } from 'src/app/pages/camas/services/camas.service';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { Moment } from 'moment';

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
  selector: 'app-paciente-editor',
  templateUrl: './paciente-editor.component.html',
  styleUrls: ['./paciente-editor.component.css'],
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
export class PacienteEditorComponent implements OnInit {
  breakpoint: number;
  maxColumn: number = 4;
  loading: boolean = false;
  showPacienteForm: boolean = false;
  existePaciente: boolean = false;
  pacienteYaInternado: boolean = false;

  pacienteFormGroup: FormGroup;

  sexoList = [
    'Femenino',
    'Masculino',
    'No Binario',
    'Otro'
  ];
  paisList = ['ARGENTINA'];
  provinciaList = ['BUENOS AIRES'];
  partidoList = ['LA PLATA', 'BERISSO'];

  isEdition: boolean = false;
  hasChange: boolean = false;

  @ViewChild('nombre') nombreElement: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<PacienteEditorComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, //cambiar "any" por tipo especifico
    private fb: FormBuilder,
    //breakpointObserver: BreakpointObserver,
    private toastr: ToastrService,
    private _snackBar: MatSnackBar,
    private services: CamasService
  ) { }

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= 600) ? 1 : this.maxColumn;

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

    this.enablePacienteInputs();

    if (this.data) {
      this.isEdition = true;
      this.patchValues(this.data);
      this.pacienteFormGroup.get("dni").patchValue(this.data.dni);   
    }

    this.onCreateGroupFormValueChange();
  }

  onCreateGroupFormValueChange(){
    const initialValue = this.pacienteFormGroup.value
    this.pacienteFormGroup.valueChanges.subscribe(value => {
      this.hasChange = Object.keys(initialValue).some(key => this.pacienteFormGroup.value[key] != 
                        initialValue[key])
    });
    console.log(this.hasChange);
  }

  patchValues(data) {
    this.pacienteFormGroup.get("nombre").patchValue(data.nombre);         
    this.pacienteFormGroup.get("apellido").patchValue(data.apellido);
    this.pacienteFormGroup.get("fechaNacimiento").patchValue(moment(data.fechaNacimiento));
    this.pacienteFormGroup.get("sexo").patchValue(data.sexo);
    this.pacienteFormGroup.get("responsable").patchValue(data.responsable);
    this.pacienteFormGroup.get("telefono").patchValue(data.telefono);
    
    if (data.direccion) {
      var dir_ = data.direccion.split('-');
      //ARGENTINA-BUENOS AIRES-LA PLATA-1-681
      this.pacienteFormGroup.get("pais").patchValue(dir_[0]);
      this.pacienteFormGroup.get("provincia").patchValue(dir_[1]);
      this.pacienteFormGroup.get("partido").patchValue(dir_[2]);
      this.pacienteFormGroup.get("calle").patchValue(dir_[3]);
      this.pacienteFormGroup.get("altura").patchValue(dir_[4]);  
    } 
}

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  enablePacienteInputs() {
    this.pacienteFormGroup.get("dni").enable();
    this.existePaciente = false;

    this.pacienteFormGroup.get("nombre").setErrors(null); 
    this.pacienteFormGroup.get("apellido").setErrors(null); 
    this.pacienteFormGroup.get("fechaNacimiento").setErrors(null); 
    this.pacienteFormGroup.get("sexo").setErrors(null); 
    /*this.pacienteFormGroup.get("nombre").enable();
    this.pacienteFormGroup.get("nombre").reset(this.pacienteFormGroup.get("nombre").value);
    this.pacienteFormGroup.get("apellido").enable();
    this.pacienteFormGroup.get("apellido").reset(this.pacienteFormGroup.get("apellido").value);
    this.pacienteFormGroup.get("fechaNacimiento").enable();
    this.pacienteFormGroup.get("fechaNacimiento").reset(this.pacienteFormGroup.get("fechaNacimiento").value);
    this.pacienteFormGroup.get("sexo").enable();
    this.pacienteFormGroup.get("sexo").reset(this.pacienteFormGroup.get("sexo").value);
    this.pacienteFormGroup.get("responsable").enable();
    this.pacienteFormGroup.get("responsable").reset(this.pacienteFormGroup.get("responsable").value);
    this.pacienteFormGroup.get("telefono").enable();
    this.pacienteFormGroup.get("telefono").reset(this.pacienteFormGroup.get("pais").value);
    this.pacienteFormGroup.get("pais").enable();
    this.pacienteFormGroup.get("pais").reset(this.pacienteFormGroup.get("pais").value);
    this.pacienteFormGroup.get("provincia").enable();
    this.pacienteFormGroup.get("provincia").reset(this.pacienteFormGroup.get("provincia").value);
    this.pacienteFormGroup.get("partido").enable();
    this.pacienteFormGroup.get("partido").reset(this.pacienteFormGroup.get("partido").value);
    this.pacienteFormGroup.get("calle").enable();
    this.pacienteFormGroup.get("calle").reset(this.pacienteFormGroup.get("calle").value);
    this.pacienteFormGroup.get("altura").enable();
    this.pacienteFormGroup.get("altura").reset(this.pacienteFormGroup.get("altura").value);
    this.pacienteFormGroup.get("altura").markAsUntouched();*/

    //this.pacienteFormGroup.setErrors(null);

    this.resetAndUntouchedFields(["nombre", "apellido", "fechaNacimiento", "sexo"
      , "responsable", "telefono", "pais", "provincia", "partido", "calle", "altura"]);

   /* setTimeout(()=>{
      this.nombreElement.nativeElement.focus();
    },0); */
  }

  resetAndUntouchedFields(fields) {
    //if (!this.showPacienteForm) { return; }

    fields.forEach(f => {
      var formInput = this.pacienteFormGroup.get(f);
      formInput.enable();
      formInput.reset();

      formInput.setErrors(null); 

      formInput.markAsPristine();
      formInput.markAsUntouched();
    });
    //this.pacienteFormGroup.reset();

    //this.pacienteFormGroup.setErrors(null);

    //this.pacienteFormGroup.markAsPristine();
    //this.pacienteFormGroup.markAsUntouched();
    
    setTimeout(()=>{
      //this.nombreElement.nativeElement.focus();
    },0); 

  }

  busquedaPordni(dni) {
    this.pacienteYaInternado = false;
    this.showPacienteForm = false;
    this.loading = true;
    console.log("DNI: " + dni);
    this.services.busquedaPordni(dni).subscribe(
      data => {
        if (data && data.paciente && data.paciente.id) {
          // CONSULTAR SI YA ESTA INTERNADO
          // /internaciones/id
          this.services.getInternacionPaciente(data.paciente.id).subscribe(
            data => {
              if (data && data.internaciones && data.internaciones.length > 0) {
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

          if (!this.isEdition) {
            this.pacienteFormGroup.get("dni").disable();
            this.pacienteFormGroup.get("nombre").disable();
            this.pacienteFormGroup.get("apellido").disable();
            this.pacienteFormGroup.get("fechaNacimiento").disable();
            this.pacienteFormGroup.get("sexo").disable();
            this.pacienteFormGroup.get("responsable").disable();
            this.pacienteFormGroup.get("telefono").disable();
            if (data.paciente.direccion) {
              this.pacienteFormGroup.get("pais").disable();
              this.pacienteFormGroup.get("provincia").disable();
              this.pacienteFormGroup.get("partido").disable();
              this.pacienteFormGroup.get("calle").disable();
              this.pacienteFormGroup.get("altura").disable();
            }
          }
          //this.toastr.warning('Existe un paciente para el D.N.I ingresado');
          
          /// DESHABILITAR DNI ???
          this.patchValues(data.paciente);
          /*this.pacienteFormGroup.get("nombre").patchValue(data.paciente.nombre);         
          this.pacienteFormGroup.get("apellido").patchValue(data.paciente.apellido);
          this.pacienteFormGroup.get("fechaNacimiento").patchValue(moment(data.paciente.fechaNacimiento));
          this.pacienteFormGroup.get("sexo").patchValue(data.paciente.sexo);
          this.pacienteFormGroup.get("responsable").patchValue(data.paciente.responsable);
          this.pacienteFormGroup.get("telefono").patchValue(data.paciente.telefono);
          
          if (data.paciente.direccion) {
            var dir_ = data.paciente.direccion.split('-');
            //ARGENTINA-BUENOS AIRES-LA PLATA-1-681
            this.pacienteFormGroup.get("pais").patchValue(dir_[0]);
            this.pacienteFormGroup.get("provincia").patchValue(dir_[1]);
            this.pacienteFormGroup.get("partido").patchValue(dir_[2]);
            this.pacienteFormGroup.get("calle").patchValue(dir_[3]);
            this.pacienteFormGroup.get("altura").patchValue(dir_[4]);  
          }  */    
        } else {
          //no se encontraron datos
          //this.toastr.info('No se encontraron datos para el D.N.I ingresado. Complete los campos');
          //this.loading = false;
          setTimeout(() => { 
            this.showPacienteForm = true;
            this.loading = false;
            this.toastr.info('No se encontraron datos para el D.N.I ingresado. Complete los campos');

            setTimeout(()=>{
              this.nombreElement.nativeElement.focus();
            },0); 
          }, 800);
          this.enablePacienteInputs();
        }
      }, error => {
        this.showPacienteForm = true;
        this.loading = false;
        //this.loading = false;
        setTimeout(() => { this.loading = false; }, 800);
        console.log(error);
      }
    );
  }

  savePaciente() {
    this.pacienteFormGroup
    var paciente = {
      //idCama: this.data.nroCama,
      nombre: this.pacienteFormGroup.value.nombre,
      apellido: this.pacienteFormGroup.value.apellido,
      dni: this.pacienteFormGroup.value.dni,
      sexo: this.pacienteFormGroup.value.sexo,
      direccion: this.pacienteFormGroup.value.pais + "-" + this.pacienteFormGroup.value.provincia + "-" + this.pacienteFormGroup.value.partido 
        + "-" + this.pacienteFormGroup.value.calle + "-" + this.pacienteFormGroup.value.altura,
      fechaNacimiento: this.pacienteFormGroup.value.fechaNacimiento.toDate(),
      telefono: this.pacienteFormGroup.value.telefono,
      responsable: this.pacienteFormGroup.value.responsable
    }

    console.log("PACIENTE SEND: " + JSON.stringify(paciente));
   
    // persistir paciente
    // esperar respuesta para obtener el ID
    if (this.isEdition) {
      console.log("PACIENTE ID: " + this.data.id);
      //EDIT
      this.services.editarPaciente(this.data.id, paciente).subscribe(
        data => {
          console.log("EDIT  PACIENTE: " + JSON.stringify(data));
          this.dialogRef.close("REFRESCAR!");
          this.toastr.success("Guardado correctamente...");
        }, error => {
          console.log(error);
        }
      );
    } else {
      //NUEVO
      this.services.addPaciente(paciente).subscribe(
        data => {
          //console.log("ADD INTERNACION: " + JSON.stringify(data));
          //persistir internacion
          if (data && data.inserted.id) {
            var pacienteId = data.inserted.id;
            console.log(pacienteId);
            this.dialogRef.close("REFRESCAR!");
          }
          this.toastr.success("Guardado correctamente...");
      
        }, error => {
          console.log(error);
        }
      );
    }
    
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.pacienteFormGroup.controls[controlName].hasError(errorName);
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 600) ? 1 : this.maxColumn;
  }

}
