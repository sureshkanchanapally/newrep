import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsgridRoutingModule } from './productsgrid-routing.module';
import { ProductsgridComponent } from './productsgrid.component';


@NgModule({
  declarations: [
    ProductsgridComponent
  ],
  imports: [
    CommonModule,
    ProductsgridRoutingModule
  ]
})
export class ProductsgridModule { }
