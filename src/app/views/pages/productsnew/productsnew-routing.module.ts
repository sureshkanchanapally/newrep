import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsnewComponent } from './productsnew.component';

const routes: Routes = [{ path: '', component: ProductsnewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsnewRoutingModule { }
