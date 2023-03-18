import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  constructor(
    private http: HttpClient
  ) { }

  getCamas() {
    const url = `${environment.baseUrl}${environment.api}/camas`;

    return this.http.get<any>(url, httpOptions)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError<any>('get'))
      );
  }

  getPacientes() {
    const url = `${environment.baseUrl}${environment.api}/pacientes`;
    //alert(url);
    return this.http.get<any>(url, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response) {
          } else {
            console.log('error');
          }
        }),
        catchError(this.handleError<any>('get all pacientes'))
      );
  }

  addPaciente(paciente) {
    const url = `${environment.baseUrl}${environment.api}/pacientes`;
    return this.http.post<any>(url, paciente, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response) {
          } else {
            console.log('error');
          }
        }),
        catchError(this.handleError<any>('add'))
      );
  }

  busquedaPordni(dni) {
    const url = `${environment.baseUrl}${environment.api}/pacientes/busquedaPordni/`;
    return this.http.get<any>(url + dni, httpOptions)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError<any>('get'))
      );
  }

  addInternacion(internacion) {
    const url = `${environment.baseUrl}${environment.api}/internaciones`;
    return this.http.post<any>(url, internacion, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response) {

          } else {
            catchError(this.handleError('Error al modificar el consultorio ' + internacion, HttpErrorResponse));
          }
        }),
        catchError(this.handleError('Error al borrar el lugar de atención ' + internacion, HttpErrorResponse))
      );
  }

  getInternacionPaciente(idPaciente) {
    const url = `${environment.baseUrl}${environment.api}/internaciones/paciente/`;
    return this.http.get<any>(url + idPaciente, httpOptions)
      .pipe(
        tap((response: any) => {
        }),
        catchError(this.handleError<any>('get'))
      );
  }

  evolucionar(evolucion) {
    const url = `${environment.baseUrl}${environment.api}/evoluciones`;
    return this.http.post<any>(url, evolucion, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response) {

          } else {
            catchError(this.handleError('Error al modificar el consultorio ' + evolucion, HttpErrorResponse));
          }
        }),
        catchError(this.handleError('Error al borrar el lugar de atención ' + evolucion, HttpErrorResponse))
      );
  }

  getEvoluciones(internacion) {
    ///ultimas/internacion
    //const url = `${environment.baseUrl}${environment.api}/evoluciones/internacion/`;
    const url = `${environment.baseUrl}${environment.api}/evoluciones/ultimas/internacion/`;
    return this.http.get<any>(url + internacion, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response) {

          } else {
            catchError(this.handleError('Error al modificar el consultorio ' + internacion, HttpErrorResponse));
          }
        }),
        catchError(this.handleError('Error al borrar el lugar de atención ' + internacion, HttpErrorResponse))
      );
  }

  darDeAlta(idInternacion) {
    const url = `${environment.baseUrl}${environment.api}/internaciones/alta/`;
    return this.http.put<any>(url + idInternacion, httpOptions)
      .pipe(
        tap((response: any) => {
          if (response) {

          } else {
            catchError(this.handleError('Error al modificar el consultorio ' + idInternacion, HttpErrorResponse));
          }
        }),
        catchError(this.handleError('Error al borrar el lugar de atención ' + idInternacion, HttpErrorResponse))
      );
  }

  private log(message: string) {

  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log('${operation} failed: ${error.message}');

      return of(result as T);
    };
  }
}
