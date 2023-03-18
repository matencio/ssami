import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services';

@Component({
  selector: 'app-sign-form',
  templateUrl: './sign-form.component.html',
  styleUrls: ['./sign-form.component.scss']
})
export class SignFormComponent implements OnInit {
  public form: FormGroup;
  isSubmitted: boolean = false;
  isLoading: boolean = false;

  constructor(
    private service: AuthService,
  ) { }

  public ngOnInit(): void {
    this.form = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      matricula: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      tipoUsuarioId: new FormControl(''), //, [Validators.required]
    });
  }

  public sign(): void {
    if (this.form.valid) {
      //seteo default como Profesional
      this.form.controls["tipoUsuarioId"].setValue(2);
      this.sendSignForm(this.form.value)
    }
  }

  public sendSignForm(usuario): void {
    console.log(JSON.stringify(usuario));
    this.service.sign(usuario).subscribe(
    data => {
      //ok
      this.isSubmitted = true;
      //this.isLoading = false;
      setTimeout(() => {
        this.isLoading = false;
      }, 1500);
    }, error => {
      //error   
      console.error(error);
      //this.isLoading = false;
      setTimeout(() => {
        this.isLoading = false;
      }, 1500);
      this.isSubmitted = false;
      if ('El email ya está registrado en SSAMI' == error.error.message) {
        this.form.controls["email"].setErrors({ emailRegistrado: true });
      } else { 
        this.form.controls["email"].setErrors(null); 
      }
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }
}
