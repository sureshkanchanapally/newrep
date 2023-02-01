import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivacySecurityComponent } from './privacy-security.component';

const routes: Routes = [{ path: '', component: PrivacySecurityComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivacySecurityRoutingModule { }
