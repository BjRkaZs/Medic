import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FpassComponent } from './src/app/fpass/fpass.component';
import { SignfpassComponent } from './src/app/signfpass/signfpass.component';
import { ProfileComponent } from './src/app/profile/profile.component';
import { CalendarComponent } from './src/app/calendar/calendar.component';
//import { adminGuard } from './admin.guard';
import { CformComponent } from './src/app/cform/cform.component';
import { NavbarComponent } from './src/app/navbar/navbar.component';
import { loggedUserGuard } from './src/logged-user.guard';
import { LogComponent } from './src/app/log/log.component';
import { DatasComponent } from './src/app/datas/datas.component';

const routes: Routes = [
    { path: 'login', component: LogComponent },
    { path: 'fpass', component: FpassComponent },
    { path: 'signfpass', component: SignfpassComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [loggedUserGuard] },
    { path: 'calendar', component: CalendarComponent, canActivate: [loggedUserGuard] },
    { path: 'cform', component: CformComponent, canActivate: [loggedUserGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'datas', component: DatasComponent, canActivate: [loggedUserGuard] }

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
