import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from '../models';
import { Sesion } from '../models/sesion';

@Injectable()
export class StorageService {
  private localStorageService;
  private currentSesion: Sesion = null;

  constructor(
    private router: Router,
    private matDialog: MatDialog) {
    this.localStorageService = localStorage;
    this.currentSesion = this.loadSessionData();
  }

  setCurrentSession(sesion: Sesion): void {
    this.currentSesion = sesion;
    this.localStorageService.setItem('current-user', JSON.stringify(sesion));
  }

  loadSessionData(): Sesion {
    const sesionStr = this.localStorageService.getItem('current-user');
    return sesionStr ? <Sesion>JSON.parse(sesionStr) : null;
  }

  getCurrentSession(): Sesion {
    return this.currentSesion;
  }

  removeCurrentSession(): void {
    this.localStorageService.removeItem('current-user');
    this.currentSesion = null;
  }

  getCurrentUser(): User {
    const sesionStr = this.localStorageService.getItem('current-user');
    return sesionStr && JSON.parse(sesionStr).usuario ? JSON.parse(sesionStr).usuario : null
    /*const sesion: Sesion = this.getCurrentSession();
    return sesion && sesion.usuario ? sesion.usuario : null;*/
  }

  isAuthenticated(): boolean {
    return this.getCurrentToken() != null ? true : false;
  }

  getCurrentToken(): string {
    const sesionStr = this.localStorageService.getItem('current-user');
    return sesionStr && JSON.parse(sesionStr).token ? JSON.parse(sesionStr).token : null
   /* const sesion = this.getCurrentSession();
    return sesion && sesion.token ? sesion.token : null;*/
  }

  logout(): void {
    this.matDialog.closeAll();
    this.removeCurrentSession();
    this.router.navigate(['/login']);
  }
}
