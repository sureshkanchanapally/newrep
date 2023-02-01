import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FabricComponent } from './fabric.component';

const routes: Routes = [{ path: '', component: FabricComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FabricRoutingModule { }
