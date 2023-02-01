import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './views/layout/layout.module';
import { AppComponent } from './app.component';
import { AuthenticationModule } from './views/authentication/authentication.module';
import { appRoutes } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    AuthenticationModule,
    RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'top' }),
    HttpClientModule,
    ToastrModule.forRoot(),
  ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
