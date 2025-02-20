import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './profile/profile.component';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from './calendar/calendar.component';
import { FpassComponent } from './fpass/fpass.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SignfpassComponent } from './signfpass/signfpass.component';
import { CformComponent } from './cform/cform.component';
import { LogComponent } from './log/log.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    CalendarComponent,
    FpassComponent,
    NavbarComponent,
    SignfpassComponent,
    CformComponent,
    LogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule

  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
