import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: false
})
export class AppComponent implements OnInit {
  isAdmin: boolean = false;
  isSuper: boolean = false;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.getIsLoggedUserObservable().subscribe(isLoggedIn => {
      const currentUrl = this.router.url;
      const publicRoutes = ['/signin', '/passreset', '/fpass', '/'];
      const role = parseInt(sessionStorage.getItem('role') || '0');

      if (isLoggedIn) {
        // Determine if the user is an admin or superadmin
        this.isAdmin = role >= 1; // Admin or Superadmin
        this.isSuper = role === 2; // Superadmin

        // Redirect based on role if on the signin page
        if (currentUrl === '/signin') {
          switch (role) {
            case 2:
              this.router.navigate(['/users']); // Superadmin
              break;
            case 1:
              this.router.navigate(['/datas']); // Admin
              break;
            default:
              this.router.navigate(['/calendar']); // Regular User
          }
        }
      } else {
        // Redirect to signin if not logged in and accessing a protected route
        if (!publicRoutes.includes(currentUrl.split('?')[0])) {
          this.router.navigate(['/signin']);
        }
      }
    });
  }
}