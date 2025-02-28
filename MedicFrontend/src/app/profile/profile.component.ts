import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  admin: any = {};
  isLoggedIn: boolean = false;
  authService: any;

  constructor(private auth: AuthService,private http: HttpClient, private router: Router) {}
  profilePicUrl: string = '';


  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files ? target.files[0] : null;

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          this.profilePicUrl = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

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
    // if (confirm('Are you sure you want to delete your profile?')) {
    //   this.auth.logout();
    //   this.router.navigate(['/signin']);
    // }
  }
}
