import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
    isLoggedIn : boolean = false;
    constructor(private authService: AuthService) {}
    ngOnInit(): void {
      this.isLoggedIn = this.authService.getIsLoggedUser();
    }
  
    signOut(): void {
      this.authService.signOut();
      this.isLoggedIn = false;
    }
}
