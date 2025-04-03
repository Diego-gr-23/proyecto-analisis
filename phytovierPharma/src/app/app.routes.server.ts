import { RenderMode, ServerRoute } from '@angular/ssr';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BodegaComponent } from './modules/bodega/bodega.component';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];

const routes: Routes = [
  { path: 'bodega', component: BodegaComponent },
  // otras rutas...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { BodegaComponent } from './modules/bodega/bodega.component';
// import { OrdenesCompraComponent } from './modules/ordenes-compra/ordenes-compra.component';
// import { VendedoresComponent } from './modules/vendedores/vendedores.component';
// import { ProductosComponent } from './modules/productos/productos.component';
// import { ReportesGastosComponent } from './modules/reportes-gastos/reportes-gastos.component';
// import { ConfiguracionComponent } from './modules/configuracion/configuracion.component';

// const routes: Routes = [
//   { path: 'bodega', component: BodegaComponent },
//   { path: 'ordenes-compra', component: OrdenesCompraComponent },
//   { path: 'vendedores', component: VendedoresComponent },
//   { path: 'productos', component: ProductosComponent },
//   { path: 'reportes-gastos', component: ReportesGastosComponent },
//   { path: 'configuracion', component: ConfiguracionComponent },
//   { path: '', redirectTo: '/bodega', pathMatch: 'full' }, // Ruta por defecto
//   { path: '**', redirectTo: '/bodega' } // Ruta para manejar errores
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }
// export const serverRoutes = routes;

