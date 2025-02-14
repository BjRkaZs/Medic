import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  isLoggedIn: boolean = false;
  authService: any;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.auth.getIsLoggedUser();
    this.auth.getLoggedUser().subscribe(user => {
      this.user = user;
    });
  }
  saveProfile(): void {
    this.auth.update(this.user).subscribe({
      next: () => alert('Profile updated successfully!'),
      error: () => alert('Failed to update profile!')
    });
  }

  deleteProfile(): void {
    if (confirm('Are you sure you want to delete your profile?')) {
      this.auth.logout();
      this.router.navigate(['/signin']);
    }
  }

  signOut(): void {
    this.authService.signOut();
    this.isLoggedIn = false;
  }
}
