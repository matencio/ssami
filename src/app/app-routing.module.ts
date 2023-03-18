import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import {AuthGuard} from './pages/auth/guards';

const routes: Routes = [
  {
    path: 'notification',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/notification/notification.module').then(m => m.NotificationModule)
  },
  {
    path: 'paciente',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/paciente/paciente.module').then(m => m.PacienteModule)
  },
  {
    path: 'camas',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/camas/camas.module').then(m => m.CamasModule)
  },
  {
    path: 'estadistica',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/estadistica/estadistica.module').then(m => m.EstadisticaModule)
  },
  {
    path: 'medicamentos',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/medicamentos/medicamentos.module').then(m => m.MedicamentosModule)
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
    useHash: true,
    preloadingStrategy: PreloadAllModules,
    relativeLinkResolution: 'legacy'
})
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
