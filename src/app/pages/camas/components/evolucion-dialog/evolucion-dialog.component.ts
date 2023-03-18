import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { CamasService } from '../../services/camas.service';
import { MY_FORMATS } from '../camas-dialog/camas-dialog.component';
import * as moment from 'moment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DOC_ORIENTATION, NgxImageCompressService } from 'ngx-image-compress';
import { SpeechDialogComponent } from '../speech-dialog/speech-dialog.component';

@Component({
  selector: 'app-evolucion-dialog',
  templateUrl: './evolucion-dialog.component.html',
  styleUrls: ['./evolucion-dialog.component.scss'],
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
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
  }
  ], changeDetection: ChangeDetectionStrategy.Default
})
export class EvolucionDialogComponent implements OnInit {
  evolucionFormGroup: FormGroup;
  maxDate: Date = new Date();

  selectedTab = 0;
  @ViewChild('changeTipoDialog') changeTipoDialog: TemplateRef<any>;
  
  //Estudios Complementarios
  estudioComplementarioFormGroup: FormGroup;
  estudioComplementarioList = ['PCR', 'Serología', 'Química', 'Hemograma', 'Coagulograma'];
  serologiaList = ['HIV', 'Toxo', 'VDRL', 'EB', 'CMV', 'HEP B', 'HEP C' ,'Parvovirus', 'Micoplasma', 'Bartonella', 'Otras'];
  quimicaList = ['Func. Renal', 'Func. Hepática', 'Glucemia', 'Esd', 'Otras'];
  origenList = ['Interno', 'Externo'];
  selectedEstudio: number;
  showOtras: boolean = false;
  //END Estudios Complementarios

  isInterpretacion: boolean = false;
  isEstudioComplementario: boolean = false;
  isImagen: boolean = false;

  //Files
  imagenesFormGroup: FormGroup;
  files: FileUpload[] = [];
  DOC_ORIENTATION: typeof DOC_ORIENTATION;
  loadingFiles: boolean = false;
  
  constructor(
    public dialogRef: MatDialogRef<EvolucionDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, //cambiar "any" por tipo especifico
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private imageCompress: NgxImageCompressService,
    private services: CamasService
  ) { }

  ngOnInit(): void {
    this.evolucionFormGroup = this.fb.group({
      fechaEvolucion: [new Date(), Validators.required],
      descripcion: ['', Validators.required],
    });

    this.estudioComplementarioFormGroup = this.fb.group({
      fecha: [new Date(), Validators.required],
      origen: ['', Validators.required],
      estudioComplementario: ['', Validators.required],
      //PCR
      resultadoPCR: ['', Validators.required],
      //Todos
      tomarValor: [null, Validators.required], //''
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

    this.imagenesFormGroup = this.fb.group({
      fecha: [new Date(), Validators.required],
      //Adjuntos
      adjuntos: ['', Validators.required]
    });

    //console.log("DATA: " + this.data)

    this.services.getEstudioComplementarios().subscribe(
      data => {
        this.estudioComplementarioList = data.tiposExamenComplementario;
        //console.log("DATA ESTUDOS COMPL: " + JSON.stringify(data));
      }, error => {
        console.error(error);
      }
    );

    this.services.getSerologias().subscribe(
      data => {
        this.serologiaList = data.tiposSerologia;
        //console.log("DATA ESTUDOS COMPL: " + JSON.stringify(data));
      }, error => {
        console.error(error);
      }
    );

    this.eventChange(0);
    
  }

  speechDescription() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.maxWidth = "98vw";
    dialogConfig.minWidth = "55vw";
    dialogConfig.maxHeight = "98vh";
    const dialogRef = this.dialog.open(SpeechDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //cierro la carga de descripción por voz y seteo el contenido
        this.evolucionFormGroup.get('descripcion').setValue(result)
        dialogRef.close();
      } else {
        //no cierro
      }
    })
  }

  isDisabled() {
    if (this.isEstudioComplementario) {
      return this.estudioComplementarioFormGroup.invalid;
    } else if (this.isInterpretacion) {
      return this.evolucionFormGroup.invalid;
    } else if (this.isImagen) {
      return this.imagenesFormGroup.invalid && !(this.files && this.files.length > 0);
    }
  }

  getInfo(event) {
    //console.log("GETINFO " + event);
    if (this.selectedTab == event) return;
    if (this.selectedTab == 0) {
      if (this.evolucionFormGroup.get('descripcion').value && this.evolucionFormGroup.get('descripcion').value.trim().length > 0) {
        this.openChangeDialog(event);
      } else {
        this.eventChange(event);
      }
    } else {
      this.openChangeDialog(event);
    }

  }

  eventChange(event) {
    if (0 == event) {
      //this.openChangeDialog();
      this.selectedTab = event;
      //es descripcion
      this.showInterpretacion();
    } else if (1 == event) {
      //this.openChangeDialog();
      this.selectedTab = event
      //es estudio
      this.showEstudioComplementario();
    } else if (2 == event) {
      //es imagen 
      this.selectedTab = event
      this.showImagenes();
    }
  }

  openChangeDialog(event) {
    var previous = this.selectedTab;
    const dialogRef = this.dialog.open(this.changeTipoDialog, {
      disableClose: true,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && 'confirm_' === result) {
        this.eventChange(event);
        dialogRef.close();
      } else {
        //no cierro
        this.selectedTab = previous;
      }
    })
  }

  showInterpretacion() {
    this.isEstudioComplementario = false;
    this.isImagen = false;
    this.isInterpretacion = true;

    this.evolucionFormGroup.reset();
    this.estudioComplementarioFormGroup.get('estudioComplementario').reset();
    this.selectedEstudio = 0;
    this.estudioComplementarioFormGroup.reset();
    this.evolucionFormGroup.get('fechaEvolucion').setValue(new Date());
    
    this.files = [];
    this.imagenesFormGroup.reset();
    this.imagenesFormGroup.updateValueAndValidity();

    this.evolucionFormGroup.updateValueAndValidity();
    this.estudioComplementarioFormGroup.updateValueAndValidity();
    //this.estudioComplementarioFormGroup.get('fechaEvolucion').setValue(new Date());
  }

  showEstudioComplementario() {
    this.isInterpretacion = false;
    this.isImagen = false;
    this.isEstudioComplementario = true;

    this.selectionTipoEstudioComplementario(null);

    this.files = [];
    this.imagenesFormGroup.reset();
    this.imagenesFormGroup.updateValueAndValidity();
    
    this.evolucionFormGroup.reset();
    this.estudioComplementarioFormGroup.get('estudioComplementario').reset();
    this.selectedEstudio = 0;
    this.estudioComplementarioFormGroup.reset();
    this.evolucionFormGroup.updateValueAndValidity();
    this.estudioComplementarioFormGroup.get('fecha').setValue(new Date());
    this.estudioComplementarioFormGroup.updateValueAndValidity();
  }

  showImagenes() {
    this.isInterpretacion = false;
    this.isEstudioComplementario = false;
    this.isImagen = true;

    this.evolucionFormGroup.reset();
    this.estudioComplementarioFormGroup.get('estudioComplementario').reset();
    this.selectedEstudio = 0;
    this.estudioComplementarioFormGroup.reset();
    this.evolucionFormGroup.updateValueAndValidity();
    this.estudioComplementarioFormGroup.updateValueAndValidity();

    this.files = [];
    this.imagenesFormGroup.get('fecha').setValue(new Date());
    this.imagenesFormGroup.updateValueAndValidity();
  }

  evolucionar() {
    if (this.selectedTab == 0) {
      //Es INTERPRETACION
      this.agregarInterpretacion();
    } else if (this.selectedTab == 1) {
      //Es ESTUDIO COMPLEMENTARIO
      this.agregarEstudio();
    } else {
      //Es IMAGEN
      this.agregarImagen();
    }
  }

  agregarImagen() {
    var evolucionImagen = {
      fecha: moment(this.imagenesFormGroup.value.fecha),
      //imagen: this.files[0].urlCompress, //mando solamente una por el momento 
      imagenes: this.files.map(f => f.urlCompress),
      internacionId: this.data.Paciente.Internacions[0].id
    }
    //console.log("IMG: " + JSON.stringify(evolucionImagen));
    this.services.evolucionarImagen(evolucionImagen).subscribe(data => {
      if (data) {
        //console.log("EVOLUCION IMAGEN OK: " + JSON.stringify(data));
        this.dialogRef.close("OK_EVOL");
      }
    }, error => {
      console.error(error);
    });
  }

  agregarInterpretacion() {
    var evolucion = {
      descripcion: this.evolucionFormGroup.value.descripcion,
      fecha: this.evolucionFormGroup.value.fechaEvolucion,
      internacionId: this.data.Paciente.Internacions[0].id
    }
    //console.log("EVOL: " + JSON.stringify(evolucion));
    this.services.evolucionarInterpretacion(evolucion).subscribe(
      data => {
        ////////////////////////////////// TODO :::: HACER ESTO PARA EL RESTO DE LAS OPCIONES !!!!!!!!!!!!!!!!!!
        //console.log(data);
        this.dialogRef.close("OK_EVOL");
        // CALL GET CAMAS
      }, error => {
        console.error(error);
      }
    );
  }

  /** ESTUDIO COMPLEMENTARIO METHODS */
  agregarEstudio() {
    var estudioComplementario = { 
      tipoExamenId: this.selectedEstudio, //this.estudioComplementarioFormGroup.value.estudioComplementario.id,
      data: null,
    }
    if (1 == this.selectedEstudio) { // 1
      //alert("soy pcr")
      var pcr = {
        fecha: moment(this.estudioComplementarioFormGroup.value.fecha),
        origen: this.estudioComplementarioFormGroup.value.origen,
        resultadoPCR: this.estudioComplementarioFormGroup.value.resultadoPCR,
        tomarValor: this.estudioComplementarioFormGroup.value.tomarValor,
        //descripcion no debe estar aca
        descripcion: 'ES UN PCR',
        internacionId: this.data.Paciente.Internacions[0].id
      }
      estudioComplementario.data = pcr;
    } else if (2 == this.selectedEstudio) {
      //alert("soy serologia")
      var serologia = {
        fecha: this.estudioComplementarioFormGroup.value.fecha,
        origen: this.estudioComplementarioFormGroup.value.origen,
        tipo: this.estudioComplementarioFormGroup.value.tipo.id, //this.estudioComplementarioFormGroup.value.tipo,
        otro: this.estudioComplementarioFormGroup.value.otro,
        tomarValor: this.estudioComplementarioFormGroup.value.tomarValor,
        internacionId: this.data.Paciente.Internacions[0].id
      }
      estudioComplementario.data = serologia;

    } else if (3 == this.selectedEstudio) {
      var quimica = {
        fecha: this.estudioComplementarioFormGroup.value.fecha,
        origen: this.estudioComplementarioFormGroup.value.origen,
        tipo: this.estudioComplementarioFormGroup.value.tipo,
        otro: this.estudioComplementarioFormGroup.value.otro,
        internacionId: this.data.Paciente.Internacions[0].id
      }
      estudioComplementario.data = quimica;

    } else if (4 == this.selectedEstudio) {
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

    } else if (5 == this.selectedEstudio) {
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
    //alert("DATA: " + JSON.stringify(estudioComplementario));
    
    this.services.evolucionarEstudioComplementario(estudioComplementario).subscribe(
      data => {
        ////////////////////////////////// TODO :::: HACER ESTO PARA EL RESTO DE LAS OPCIONES !!!!!!!!!!!!!!!!!!
        //console.log(data);
        this.dialogRef.close("OK_EVOL");
        // CALL GET CAMAS
      }, error => {
        console.log(error);
      }
    );
    
  }

  selectionTipoEstudioComplementario(tipo) {
    if (!(tipo && tipo.id)) {
      return;
    }
    //alert(JSON.stringify(tipo))
    this.selectedEstudio = tipo.id;
    
    //setTimeout(() => { this.estudioComplementarioFormGroup.get('tomarValor').setValue("true"); }, 800);
    //this.estudioComplementarioFormGroup.get('tomarValor').setValue("true");
    if (1 == tipo.id || 'PCR' == tipo.descripcion) {
      //reset
      //alert("SOY PCR!");
      this.resetAndUntouchedFields(["resultadoPCR", "tipo", "otro", "p", "kptt", "plaquetas", "globulosRojos", "globulosBlancos", "hto", "hb"]);
      //this.estudioComplementarioFormGroup.updateValueAndValidity();

      this.estudioComplementarioFormGroup.get('resultadoPCR').setValidators([Validators.required]);
      this.estudioComplementarioFormGroup.get('tomarValor').reset();
      //this.estudioComplementarioFormGroup.get('tomarValor').setValue("true");
      this.estudioComplementarioFormGroup.updateValueAndValidity();
    } else if (2 == tipo.id || 'Serología' == tipo.descripcion) {
      //reset
      this.resetAndUntouchedFields(["resultadoPCR", "tipo", "otro", "p", "kptt", "plaquetas", "globulosRojos", "globulosBlancos", "hto", "hb"]);
      this.estudioComplementarioFormGroup.updateValueAndValidity();

      this.estudioComplementarioFormGroup.get('tipo').setValidators([Validators.required]);
      this.estudioComplementarioFormGroup.get('otro').setValidators([Validators.required]);
      this.estudioComplementarioFormGroup.get('tomarValor').reset();
      //this.estudioComplementarioFormGroup.get('tomarValor').setValue("true");
      this.estudioComplementarioFormGroup.updateValueAndValidity();
    } else if (4 == tipo.id || 'Química' == tipo.descripcion) {
      //reset
      this.resetAndUntouchedFields(["resultadoPCR", "tipo", "otro", "p", "kptt", "plaquetas", "globulosRojos", "globulosBlancos", "hto", "hb"]);
      this.estudioComplementarioFormGroup.updateValueAndValidity();

      this.estudioComplementarioFormGroup.get('tipo').setValidators([Validators.required]);
      this.estudioComplementarioFormGroup.get('otro').setValidators([Validators.required]);
      this.estudioComplementarioFormGroup.get('tomarValor').reset();
      //this.estudioComplementarioFormGroup.get('tomarValor').setValue("true");
      this.estudioComplementarioFormGroup.updateValueAndValidity();
    } else if (3 == tipo.id || 'Hemograma' == tipo.descripcion) {
      //reset
      this.resetAndUntouchedFields(["resultadoPCR", "tipo", "otro", "p", "kptt", "plaquetas"]);
      this.estudioComplementarioFormGroup.updateValueAndValidity();

      this.estudioComplementarioFormGroup.get('globulosRojos').setValidators([Validators.required]);
      this.estudioComplementarioFormGroup.get('globulosBlancos').setValidators([Validators.required]);
      this.estudioComplementarioFormGroup.get('hto').setValidators([Validators.required]);
      this.estudioComplementarioFormGroup.get('hb').setValidators([Validators.required]);
      this.estudioComplementarioFormGroup.get('tomarValor').reset();
      //this.estudioComplementarioFormGroup.get('tomarValor').setValue("true");
      this.estudioComplementarioFormGroup.updateValueAndValidity();
    } else if (5 == tipo.id || 'Coagulograma' == tipo.descripcion) {
      //reset
      this.resetAndUntouchedFields(["resultadoPCR", "tipo", "otro", "globulosRojos", "globulosBlancos", "hto", "hb"]);
      this.estudioComplementarioFormGroup.updateValueAndValidity();

      this.estudioComplementarioFormGroup.get('p').setValidators([Validators.required]);
      this.estudioComplementarioFormGroup.get('kptt').setValidators([Validators.required]);
      this.estudioComplementarioFormGroup.get('plaquetas').setValidators([Validators.required]);
      this.estudioComplementarioFormGroup.get('tomarValor').reset();
      //this.estudioComplementarioFormGroup.get('tomarValor').setValue("true");
      this.estudioComplementarioFormGroup.updateValueAndValidity();
    } else {
      //reset
      //this.resetAndUntouchedFields(["resultadoPCR", "tipo", "otro", "p", "kptt", "plaquetas", "globulosRojos", "globulosBlancos", "hto", "hb"]);
      this.estudioComplementarioFormGroup.reset();
      this.estudioComplementarioFormGroup.get('fecha').setValue(new Date());
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
    //alert("tipo: " + JSON.stringify(tipo))
    //tipo: {"id":10,"nombre":"Otras"}
      this.showOtras = ("Otras" == tipo || "Otras" == tipo.nombre || 10 == tipo.id);
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
    } else if (this.estudioComplementarioFormGroup.controls[controlName]) {
      return this.estudioComplementarioFormGroup.controls[controlName].hasError(errorName);
    } else if (this.evolucionFormGroup.controls[controlName]) {
      return this.evolucionFormGroup.controls[controlName].hasError(errorName);
    } else {
      return this.imagenesFormGroup.controls[controlName].hasError(errorName);
    }
  }

  // FILE UPLOAD SECTION START --------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------

  loadFiles(event) {
    this.files = event;
    if (this.files && this.files.length > 0) {
      this.imagenesFormGroup.controls['adjuntos'].setErrors(null);
    } else {
      this.imagenesFormGroup.controls['adjuntos'].setErrors({"required":true});
    }
    this.loadingFiles = false;
  }

  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }

  readThis(file: File): void {
    let myReader: FileReader = new FileReader();
    let adjunto: any;

    myReader.readAsArrayBuffer(file);

    myReader.onload = (e) => {
      let base64 = this.arrayBufferToBase64(myReader.result);
      let url_ = "data:" + file.type + ";base64," +  base64;
      let url = this.sanitizer.bypassSecurityTrustResourceUrl(url_);
      let urlCompress = url_;

      if (file.size > 1000000) {
        this.imageCompress.compressFile(urlCompress, DOC_ORIENTATION, 75, 50).then(
          result => {
            urlCompress = result;
            //console.log("FILE URL: " + urlCompress)
            this.files.push(new FileUpload(file, base64, url, urlCompress));
          }, error => {
            console.error(error);
          }
        );
      } else {
        //console.log("FILE URL: " + urlCompress)
        this.files.push(new FileUpload(file, base64, url, urlCompress));
      }
    }
  }

  checkExists(name: string) : boolean {
    if (this.files && this.files.length > 0) {
      if (this.files.some(f => f.file.name == name)) {
        return true;
      }
    }

    return false;
  }

  onFileSelected(event) {
    this.loadingFiles = true;
    if (event.target.files && event.target.files[0]) {
      const cant = event.target.files.length;

      for (let i = 0; i < cant; i++) {
        if ((event.target.files[i].type === 'application/pdf') || (event.target.files[i].type === 'image/jpeg')
            || (event.target.files[i].type === 'image/png') ) {

          if (!this.checkExists(event.target.files[i].name)) {
            this.readThis(event.target.files[i]);
          }
        }
      }  
    }

    setTimeout(() => {
      this.loadingFiles = false;
      if (this.files && this.files.length > 0) {
        this.imagenesFormGroup.controls['adjuntos'].setErrors(null);
      } else {
        this.imagenesFormGroup.controls['adjuntos'].setErrors({"required":true});
      }
    }, 600);
  }

  clickOn(id) {
    document.getElementById(id).click();
  }

  delete(i) {
    this.files.splice(i,1);
    /*if (this.showCargaSection) {
      if (this.files.length == 0) {
        this.prestacionForm.controls['adjuntos'].setErrors({"required":true});
      }
    }*/
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals?) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Comprime los archivos de tamaño mayor a 1 MB
   */
  compressFiles() {
    this.files.forEach(f => {
      if (f.file.size > 1000000) {
        //console.info("el archivos: " + f.file.name + ", es de tamaño mayor a 1 MB");
      }
      //console.warn('Size in bytes was:', f.file.size);
      this.imageCompress.compressFile( f.urlCompress, DOC_ORIENTATION, 75, 50).then(
        result => {
          //console.log(result);
          f.urlCompress = result;
          //console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
        }, error => {
          console.error(error);
        }
      );
    });
  }
  
  // ----------------------------------------------------------------------------------------------------
  // FILE UPLOAD SECTION END ----------------------------------------------------------------------------
}

export class FileUpload {
  file: File;
  base64?: string;
  url: SafeUrl
  urlCompress?: string;

  constructor(file, base64, url, urlCompress) {
    this.file = file;
    this.base64 = base64;
    this.url = url;
    this.urlCompress = urlCompress;
  }
}