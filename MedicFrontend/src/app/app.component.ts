import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: `./app.component.html`,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.auth.getIsLoggedUserObservable().subscribe(isLoggedIn => {
      const currentUrl = this.router.url;
      const publicRoutes = ['/signin', '/passreset', '/fpass', '/' ];
      const role = parseInt(sessionStorage.getItem('role') || '0');
      if (isLoggedIn) {
        console.log(role);
        if (currentUrl === '/signin') {
          switch(role) {
            case 2:
              this.router.navigate(['/users']);
              break;
            case 1:
              this.router.navigate(['/datas']);
              break;
            default:
              this.router.navigate(['/calendar']);
          }
        }
      } else {
        if (!publicRoutes.includes(currentUrl.split('?')[0])) {
          this.router.navigate(['/signin']);
        }
      }
    });
  }
}