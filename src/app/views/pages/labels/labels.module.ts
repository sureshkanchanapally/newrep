import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LabelsRoutingModule } from './labels-routing.module';
import { LabelsComponent } from './labels.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    LabelsComponent
  ],
  imports: [
    CommonModule,
    LabelsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgMultiSelectDropDownModule
  ]
})
export class LabelsModule { }
