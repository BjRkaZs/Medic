import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbaradmin',
  templateUrl: './navbaradmin.component.html',
  styleUrl: './navbaradmin.component.css'
})
export class NavbaradminComponent {
  user: any = {};
  admin: any = {};
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  isSuper: boolean = false;
  
    constructor(private auth: AuthService, private router: Router, private translate: TranslateService) {
      this.translate.setDefaultLang('hu');
    }
  
    ngOnInit(): void {
      this.auth.getIsLoggedUserObservable().subscribe(status => {
        this.isLoggedIn = status;
        const role = parseInt(sessionStorage.getItem('role') || '0');
        this.isAdmin = role >= 1;  
        this.isSuper = role === 2; 
      });
    }
  
    signOut(): void {
      this.auth.signOut();
      this.router.navigate(['/signin']);
    }

}
