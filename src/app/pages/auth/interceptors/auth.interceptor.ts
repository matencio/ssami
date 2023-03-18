import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private storageService: StorageService, 
    private router: Router,
    private toastr: ToastrService,
    ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.storageService.getCurrentToken();
    let request = req;
    if (token) {
      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request).pipe(
      tap(
        () => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            let errorMessage: string;
            if (err.status !== 401) {
              return;
            /*} else {
              console.log("ERROR :" + JSON.stringify(err))
              if (err.error) {
                if (!('El email ya está registrado en SSAMI' == err.error.message)) {
                  errorMessage = `Ocurrió un error: ${err.error.message}`;
                }
              } else {
                errorMessage = `Ocurrió un error inesperado. Por favor, intente nuevamente.`
              }
              this.toastr.error(errorMessage);*/
            }
            this.router.navigate(['']);
          }
        }
      )
    );
  }
}
