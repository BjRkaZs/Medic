import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  loginModel:any={
    email: '',
    password: ''
  }

  constructor (private auth:AuthService, private router: Router){}

  login() {
    this.auth.login(this.loginModel).subscribe({
      next: (response: any) => {
        console.log("Login successful", response);
        sessionStorage.setItem('email', this.loginModel.email);

        // 🔥 Navigáció a profil oldalra sikeres bejelentkezés után
        if (response && response.length > 0) {
          alert("Login successful!");
          this.router.navigate(['/profile']);
        } else {
          alert("Login failed: Invalid credentials");
        }
      },
      error: (error) => {
        console.error("Login failed", error);
        alert("Login failed: " + (error.error?.message || "Unknown error"));
      }
    });
  }
  togglePasswordVisibility(inputId: string, iconId: string) {
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    const iconElement = document.getElementById(iconId) as HTMLElement;

    if (inputElement.type === "password") {
      inputElement.type = "text";
      iconElement.classList.remove("bi-eye-slash");
      iconElement.classList.add("bi-eye");
    } else {
      inputElement.type = "password";
      iconElement.classList.remove("bi-eye");
      iconElement.classList.add("bi-eye-slash");
    }
  }
}
