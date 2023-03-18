import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Sesion } from '../../models/sesion';
import { AuthService } from '../../services';
import { StorageService } from '../../services/storage.service';
import { routes } from '../../../../consts';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  public form: FormGroup;
  public SSAMIEmail = ''; //'admin@ssami.com';
  public SSAMIPassword = ''; //'admin';
  public hide = true;
  public routers: typeof routes = routes;
  isLoading: boolean = false;

  constructor(
    private service: AuthService,
    private router: Router,
    private storageService: StorageService,
  ) { }

  public ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(this.SSAMIEmail, [Validators.required, Validators.email]),
      password: new FormControl(this.SSAMIPassword, [Validators.required])
    });

    // reset login status
    this.storageService.logout();
  }

  public login() {
    if (this.form.valid) {
      this.sendLoginForm(this.form.value);
    }
  }

  public sendLoginForm(data) {
    this.isLoading = true;
    this.service.login(data).subscribe(
      data => {
        if (data) {
          const sesion: Sesion = data;
          this.storageService.setCurrentSession(sesion);
          /*this.isLoading = false;
          this.router.navigate([this.routers.CAMAS]).then();*/
          setTimeout(() => {
            this.isLoading = false;
            this.router.navigate([this.routers.CAMAS]).then()
          }, 1500);
        }
      },
      error => {
        console.error(error);
        setTimeout(() => {
          this.isLoading = false;
        }, 1500);
        //////this.isLoading = false;
        this.form.controls['email'].setErrors({ 'incorrect': true });
        this.form.controls['password'].setErrors({ 'incorrect': true });
      });
  }

  check() {
    this.form.controls['email'].updateValueAndValidity();
    this.form.controls['password'].updateValueAndValidity();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }


}
