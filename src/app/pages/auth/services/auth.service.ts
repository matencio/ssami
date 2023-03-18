import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { User } from '../models';
import { StorageService } from './storage.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {}

  login(data): Observable<any> {
    return this.http.post(`${environment.baseUrl}${environment.auth}/login`, data, httpOptions);
  }

  login222333(data): Observable<any> {
    const url = `${environment.baseUrl}${environment.auth}/login/`;
    return this.http.post<any>(url, data, httpOptions)
    .pipe(
      tap((response: any) => {
        if (response) {
        } else {
          console.log('error');
          catchError(this.handleError('Login Usuario', HttpErrorResponse));
        }
      }),
      catchError(this.handleError<any>('add'))
    );
  }

  sign(usuario) {
    const url = `${environment.baseUrl}${environment.auth}/register/`;
    return this.http.post<any>(url, usuario, httpOptions);
  }

  public sign222222(usuario) {
    const url = `${environment.baseUrl}${environment.auth}/register/`;
    return this.http.post<any>(url, usuario, httpOptions)
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

  public signOut(): void {
    localStorage.removeItem('token');
  }

  public getUser(): Observable<User> {
    return of(this.storageService.getCurrentUser());
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
