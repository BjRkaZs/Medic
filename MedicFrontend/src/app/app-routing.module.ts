import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FpassComponent } from './fpass/fpass.component';
import { ProfileComponent } from './profile/profile.component';
import { CalendarComponent } from './calendar/calendar.component';
import { loggedUserGuard } from '../logged-user.guard';
import { LogComponent } from './log/log.component';
import { DatasComponent } from './datas/datas.component';
import { adminGuard } from './admin.guard';
import { UsersComponent } from './users/users.component';
import { PassresetComponent } from './passreset/passreset.component';
import { MymedsComponent } from './mymeds/mymeds.component';


const routes: Routes = [
    { path: 'signin', component: LogComponent },
    { path: 'fpass', component: FpassComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [loggedUserGuard] },
    { path: 'calendar', component: CalendarComponent, canActivate: [loggedUserGuard] },
    { path: 'mymeds', component: MymedsComponent, canActivate: [loggedUserGuard] },
    { path: 'datas', component: DatasComponent, canActivate: [loggedUserGuard, adminGuard] },
    { path: 'users', component: UsersComponent, canActivate: [loggedUserGuard, adminGuard] },
    { path: 'passreset', component: PassresetComponent },
    { path: '', redirectTo: 'signin', pathMatch: 'full' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
