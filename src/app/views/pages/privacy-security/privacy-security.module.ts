import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacySecurityRoutingModule } from './privacy-security-routing.module';
import { PrivacySecurityComponent } from './privacy-security.component';


@NgModule({
  declarations: [
    PrivacySecurityComponent
  ],
  imports: [
    CommonModule,
    PrivacySecurityRoutingModule
  ]
})
export class PrivacySecurityModule { }
