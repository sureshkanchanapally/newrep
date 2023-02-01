import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceRoutingModule } from './device-routing.module';
import { DeviceComponent } from './device.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    DeviceComponent
  ],
  imports: [
    CommonModule,
    DeviceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule
  ]
})
export class DeviceModule { }
