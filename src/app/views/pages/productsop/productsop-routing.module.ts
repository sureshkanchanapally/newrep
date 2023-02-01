import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsopComponent } from './productsop.component';

const routes: Routes = [{path:'', component:ProductsopComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsopRoutingModule { }
