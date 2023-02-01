import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleQcRoutingModule } from './schedule-qc-routing.module';
import { ScheduleQcComponent } from './schedule-qc.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    ScheduleQcComponent
  ],
  imports: [
    CommonModule,
    ScheduleQcRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule
  ]
})
export class ScheduleQcModule { }
