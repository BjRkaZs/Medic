import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
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
