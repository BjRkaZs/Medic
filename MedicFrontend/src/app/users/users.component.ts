import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  admin: any = {};
  isLoggedIn: boolean = false;
  ngOnInit(): void {
    this.isLoggedIn = this.authService.getIsLoggedUser();
    this.authService.getLoggedUser().subscribe(admin => {
      this.admin = admin;
    });
  }
  constructor(private authService: AuthService) { }

}
