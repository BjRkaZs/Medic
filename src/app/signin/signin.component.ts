import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  loginModel:any={}

  constructor (private auth:AuthService){}
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

  login() {
    this.auth.login(this.loginModel).subscribe({
      next: (response) => {
        console.log("Login successful", response);
        alert("Login successful!");
      },
      error: (error) => {
        console.error("Login failed", error);
        alert("Login failed: " + (error.error?.message || "Unknown error"));
      }
    });
  } 
}

