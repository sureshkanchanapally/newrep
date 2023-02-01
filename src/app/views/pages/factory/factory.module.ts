import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactoryRoutingModule } from './factory-routing.module';
import { FactoryComponent } from './factory.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    FactoryComponent
  ],
  imports: [
    CommonModule,
    FactoryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class FactoryModule { }
