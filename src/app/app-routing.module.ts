import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { FpassComponent } from './fpass/fpass.component';
import { SignfpassComponent } from './signfpass/signfpass.component';
import { ProfileComponent } from './profile/profile.component';
import { CalendarComponent } from './calendar/calendar.component';
//import { adminGuard } from './admin.guard';
import { CformComponent } from './cform/cform.component';
import { NavbarComponent } from './navbar/navbar.component';
import { loggedUserGuard } from '../logged-user.guard';

const routes: Routes = [
  { path: '', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'fpass', component: FpassComponent },
  { path: 'signfpass', component: SignfpassComponent},
  { path: 'profile', component: ProfileComponent, canActivate:[loggedUserGuard]},
  { path: 'calendar', component: CalendarComponent, canActivate:[loggedUserGuard]},
  { path: 'cform', component: CformComponent, canActivate:[loggedUserGuard]},
  { path: 'navbar', component: NavbarComponent, canActivate:[loggedUserGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
