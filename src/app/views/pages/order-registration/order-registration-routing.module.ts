import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderRegistrationComponent } from './order-registration.component';

const routes: Routes = [{path:"",component:OrderRegistrationComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRegistrationRoutingModule { }
