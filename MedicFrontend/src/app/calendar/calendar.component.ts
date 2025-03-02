import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  user: any = {};
  admin: any = {};
  isLoggedIn : boolean = false;
  constructor(private auth: AuthService) {}
  ngOnInit(): void {
    this.isLoggedIn = this.auth.getIsLoggedUser();
  }

  signOut(): void {
    this.auth.signOut();
    this.isLoggedIn = false;
  }
}
