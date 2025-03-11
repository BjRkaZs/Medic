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
  isLoggedIn: boolean = false;
  profilePicUrl: string = '';

  constructor(private auth: AuthService,private http: HttpClient, private router: Router) {}

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
  
      this.uploadProfilePicture(file);
    }
  }
  
  uploadProfilePicture(file: File): void {
  //   const token = localStorage.getItem('token');
  //   const formData = new FormData();
  //   formData.append('profile_picture', file);
  
  //   const headers = { 'Authorization': `Bearer ${token}` };
  
  //   this.http.post('http://localhost:8000/api/upload-profile-picture', formData, { headers })
  //     .subscribe({
  //       next: (response: any) => {
  //         if (response.success) {
  //           console.log('Profile picture uploaded:', response.data);
  //           this.profilePicUrl = response.data.profilePicUrl;
  //           alert('Profile picture updated successfully');
  //         }
  //       },
  //       error: (error) => {
  //         console.error('Error uploading profile picture:', error);
  //         alert('Failed to upload profile picture');
  //       }
  //     });
   }

  

  ngOnInit(): void {
    this.isLoggedIn = this.auth.getIsLoggedUser();
    this.loadProfile();
  }

  loadProfile(): void {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    this.http.get('http://localhost:8000/api/getprofile', { headers })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.user = response.data;
            console.log('Profile loaded:', this.user);
          }
        },
        error: (error) => {
          console.error('Error loading profile:', error);
          if (error.status === 401) {
            this.router.navigate(['/signin']);
          }
        }
      });
  }

  saveProfile(): void {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const body = {
      name: this.user.name,
      email: this.user.email,
      profilePicUrl: this.user.profilePic || ''
    };

    this.http.put('http://localhost:8000/api/modifyprofile', body, { headers })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            console.log('Profile updated:', response.data);
            alert('Profile updated successfully');
            this.loadProfile();
          }
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          alert(error.error?.message || 'Failed to update profile');
        }
      });
  }

  deleteProfile(): void {
    if (confirm('Are you sure you want to delete your profile? This cannot be undone.')) {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
  
      this.http.delete('http://localhost:8000/api/deleteprofile', { headers })
        .subscribe({
          next: (response: any) => {
            if (response.success) {
              console.log('Profile deleted:', response.data);
              localStorage.removeItem('token');
              sessionStorage.clear();
              this.auth.signOut();
              this.router.navigate(['/signin']);
              alert('Profile deleted successfully');
            }
          },
          error: (error) => {
            console.error('Error deleting profile:', error);
            alert(error.error?.message || 'Failed to delete profile');
          }
        });
      }
  }
}
