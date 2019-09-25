import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductSearchComponent } from './pages/product-search/product-search.component';
import { IndexComponent } from './pages/index/index.component';

export enum AppRoutesList {
  productSearch= 'product-search'
}

const routes: Routes = [
  { path: '', component: IndexComponent },
  {
    path: AppRoutesList.productSearch,
    loadChildren: () => import('./pages/product-search/product-search.module').then(m => m.ProductSearchModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
