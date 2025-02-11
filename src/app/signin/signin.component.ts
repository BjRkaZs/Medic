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
