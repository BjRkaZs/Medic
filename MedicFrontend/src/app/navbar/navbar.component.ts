import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.getIsLoggedUserObservable().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  signOut(): void {
    this.auth.signOut();
    this.router.navigate(['/log']);
  }
}
