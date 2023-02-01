import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsgridComponent } from './productsgrid.component';

const routes: Routes = [{ path: '', component: ProductsgridComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsgridRoutingModule { }
