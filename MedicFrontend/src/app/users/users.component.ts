import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})

export class UsersComponent implements OnInit {  
  
  constructor(private auth: AuthService, private router: Router) { }

  user: any = {};
  admin: any = {};
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.isLoggedIn = this.auth.getIsLoggedUser();
    this.auth.getLoggedUser().subscribe(admin => {
      this.admin = admin;
    });
  }

  signOut(): void {
    this.auth.signOut();
    this.router.navigate(['/signin']);
  }

  setRole(user: any, role: string): void {
    user.role = role;
  }


}
