import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRegistrationRoutingModule } from './order-registration-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OrderRegistrationComponent } from './order-registration.component';


@NgModule({
  declarations: [OrderRegistrationComponent],
  imports: [
    CommonModule,
    OrderRegistrationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgMultiSelectDropDownModule
  ]
})
export class OrderRegistrationModule { }
