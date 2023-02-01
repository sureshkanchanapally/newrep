import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndustryRoutingModule } from './industry-routing.module';
import { IndustryComponent } from './industry.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    IndustryComponent
  ],
  imports: [
    CommonModule,
    IndustryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class IndustryModule { }
