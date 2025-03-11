import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})

export class UsersComponent implements OnInit {  
  
  constructor(private auth: AuthService, private router: Router, private http: HttpClient) { }

  isLoggedIn: boolean = false;
  isSuper: boolean = false;
  users: any[] = [];

  ngOnInit(): void {
    this.isLoggedIn = this.auth.getIsLoggedUser();
    const role = parseInt(sessionStorage.getItem('role') || '0');
    this.isSuper = role === 2;
    
    if (!this.isSuper) {
      this.router.navigate(['/datas']);
    } else {
      this.loadUsers();
    }
  }

  signOut(): void {
    this.auth.signOut();
    this.router.navigate(['/signin']);
  }

  loadUsers(): void {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    this.http.get('http://localhost:8000/api/users', { headers })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.users = response.data;
            console.log('Users loaded:', this.users);
          }
        },
        error: (error) => {
          console.error('Error loading users:', error);
        }
      });
  }

  setRole(user: any, role: string): void {
    const adminLevel = role === 'super' ? 2 : role === 'admin' ? 1 : 0;
    user.admin = adminLevel;

    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const body = {
      id: user.id,
      admin: adminLevel
    };

    this.http.put('http://localhost:8000/api/admin', body, { headers })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            console.log('Role updated:', response);
            this.loadUsers();
          }
        },
        error: (error) => {
          console.error('Error updating role:', error);
          alert(error.error?.message || 'Failed to update user role');
        }
      });
  }
}
