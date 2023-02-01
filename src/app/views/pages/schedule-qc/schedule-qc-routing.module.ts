import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleQcComponent } from './schedule-qc.component';

const routes: Routes = [{ path: '', component: ScheduleQcComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleQcRoutingModule { }
