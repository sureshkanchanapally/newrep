import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsopRoutingModule } from './productsop-routing.module';
import { ProductsopComponent } from './productsop.component';


@NgModule({
  declarations: [
    ProductsopComponent
  ],
  imports: [
    CommonModule,
    ProductsopRoutingModule
  ]
})
export class ProductsopModule { }
