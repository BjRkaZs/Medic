import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: false
})
export class NavbarComponent implements OnInit {
  user: any = {};
  admin: any = {};
  isLoggedIn: boolean = false;

  constructor(private auth: AuthService, private router: Router, private translate: TranslateService) {
    this.translate.setDefaultLang('hu');
  }

  ngOnInit(): void {
    this.auth.getIsLoggedUserObservable().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  signOut(): void {
    this.auth.signOut();
    this.router.navigate(['/signin']);
  }
}
