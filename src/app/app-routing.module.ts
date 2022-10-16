import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanzasComponent } from './pages/finanzas/finanzas.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { VentasDiariasComponent } from './pages/ventas-diarias/ventas-diarias.component';

const routes: Routes = [
  {
    path:'',
    component:ProductosComponent
  },
  {
    path:'inventario',
    component:ProductosComponent
  },
  {
    path:'finanzas',
    component:FinanzasComponent
  },
  {
    path:'ventas',
    component:VentasComponent
  },
  {
    path:'ventas-diarias',
    component:VentasDiariasComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
