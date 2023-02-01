import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FabricRoutingModule } from './fabric-routing.module';
import { FabricComponent } from './fabric.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    FabricComponent
  ],
  imports: [
    CommonModule,
    FabricRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgMultiSelectDropDownModule
  ]
})
export class FabricModule { }
