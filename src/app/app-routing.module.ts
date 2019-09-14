import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductSearchComponent } from './pages/product-search/product-search.component';

export enum routesList {
  productSearch= 'product-search'
}

const routes: Routes = [
  {
    path: routesList.productSearch,
    loadChildren: () => import('./pages/product-search/product-search.module').then(m => m.ProductSearchModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: true }) // <-- debugging purposes only),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
