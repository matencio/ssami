import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { routes } from '../../../consts';
import { StorageService } from '../services/storage.service';

@Injectable()
export class AuthGuard implements CanActivate{
  public routers: typeof routes = routes;

  constructor(
    private storageService: StorageService, 
    private router: Router
    ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.storageService.getCurrentToken();
    if (token) {
      return true;
    } else {
      this.router.navigate([this.routers.LOGIN]);
    }
  }
}
