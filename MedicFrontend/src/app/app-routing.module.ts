import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FpassComponent } from './fpass/fpass.component';
import { SignfpassComponent } from './signfpass/signfpass.component';
import { ProfileComponent } from './profile/profile.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CformComponent } from './cform/cform.component';
import { loggedUserGuard } from '../logged-user.guard';
import { LogComponent } from './log/log.component';
import { DatasComponent } from './datas/datas.component';
import { adminGuard } from './admin.guard';

const routes: Routes = [
    { path: 'login', component: LogComponent },
    { path: 'fpass', component: FpassComponent },
    { path: 'signfpass', component: SignfpassComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [loggedUserGuard] },
    { path: 'calendar', component: CalendarComponent, canActivate: [loggedUserGuard] },
    { path: 'cform', component: CformComponent, canActivate: [loggedUserGuard] },
    { path: 'datas', component: DatasComponent, canActivate: [loggedUserGuard, adminGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
