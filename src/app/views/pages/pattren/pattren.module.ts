import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PattrenRoutingModule } from './pattren-routing.module';
import { PattrenComponent } from './pattren.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    PattrenComponent
  ],
  imports: [
    CommonModule,
    PattrenRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgMultiSelectDropDownModule
  ]
})
export class PattrenModule { }
