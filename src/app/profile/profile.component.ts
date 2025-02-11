import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  loggedUser:any
  constructor(private auth:AuthService){
    this.auth.getLoggedUser().subscribe(
      (user)=>this.loggedUser=user
    )
  }
}
