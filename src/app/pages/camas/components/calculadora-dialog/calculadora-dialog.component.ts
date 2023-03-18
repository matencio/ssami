import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CamasService } from '../../services/camas.service';

@Component({
  selector: 'app-calculadora-dialog',
  templateUrl: './calculadora-dialog.component.html',
  styleUrls: ['./calculadora-dialog.component.css']
})
export class CalculadoraDialogComponent implements OnInit {
  calculadoraFormGroup: FormGroup;
  tipoList = [
    'Analgésicos y Antitérmico',
    'Protección Gástrica',
    'Antimicrobianos',
    'Antipruriginoso',
    'Tópicos'
  ];

  noDataToDisplay: boolean = false;
  practicasList: any[];
  practica: any;
  selectedPractica: any;
  practicaListStr: string[];
  filteredOptions: Observable<string[]>;
  loading: boolean = false;
  
  constructor(
    public dialogRef: MatDialogRef<CalculadoraDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, //cambiar "any" por tipo especifico
    private fb: FormBuilder,
    private services: CamasService
  ) { }

  ngOnInit(): void {
    this.calculadoraFormGroup = this.fb.group({
      peso: ['', Validators.required],
      fechaInicio: [new Date(), Validators.required],
      tipo: ['', Validators.required],
      medicamento: ['', Validators.required],
      indicacion: ['', Validators.required],
      diagnostico: [''],
      notaMedica: [''],
    });

    if (this.data) {
      //setear peso
      this.calculadoraFormGroup.get("peso").patchValue(this.data.Paciente.Internacions[0].peso);
    }
  }

  usarDosisCalculada() {
    // Se usa el valor calculado aquí
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.calculadoraFormGroup.controls[controlName].hasError(errorName);
  }

}
