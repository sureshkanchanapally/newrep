import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsnewRoutingModule } from './productsnew-routing.module';
import { ProductsnewComponent } from './productsnew.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    ProductsnewComponent
  ],
  imports: [
    CommonModule,
    ProductsnewRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgMultiSelectDropDownModule
  ]
})
export class ProductsnewModule { }
