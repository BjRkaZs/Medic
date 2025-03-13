import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './profile/profile.component';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from './calendar/calendar.component';
import { FpassComponent } from './fpass/fpass.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LogComponent } from './log/log.component';
import { DatasComponent } from './datas/datas.component';
import { UsersComponent } from './users/users.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { PassresetComponent } from './passreset/passreset.component';
import { MymedsComponent } from './mymeds/mymeds.component';


@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    CalendarComponent,
    FpassComponent,
    NavbarComponent,
    LogComponent,
    DatasComponent,
    UsersComponent,
    PassresetComponent,
    MymedsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [provideHttpClient(), provideAnimationsAsync(), { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
