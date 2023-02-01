import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SizeComponent } from './size.component';

const routes: Routes = [{path:'', component:SizeComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SizeRoutingModule { }
