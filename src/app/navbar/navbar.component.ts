import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
   loggedUser:any
    constructor(private auth:AuthService){
      this.auth.getLoggedUser().subscribe(
        (user)=>this.loggedUser=user
      )
    }
}
