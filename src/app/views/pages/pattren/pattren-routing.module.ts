import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PattrenComponent } from './pattren.component';

const routes: Routes = [{ path: '', component: PattrenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PattrenRoutingModule { }
