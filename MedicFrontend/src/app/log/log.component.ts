import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrl: './log.component.css'
})
export class LogComponent {
  isSignDivVisiable: boolean  = true;

  constructor(private router: Router, private auth: AuthService){}


  regModel: any = {
    uname: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  Register() {
    if (this.regModel.password !== this.regModel.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    this.auth.Register(this.regModel).subscribe({
      next: (response) => {
        console.log("Registration successful", response);
        alert("Registration successful!");
        this.router.navigate(['/signin']);
      },
      error: (error) => {
        console.error("Registration failed", error);
        alert("Registration failed");
      }
    });
  }

  loginModel:any={
    email: '',
    password: ''
  }

  Login() {
    this.auth.Login(this.loginModel).subscribe({
      next: (response: any) => {
        console.log("Login successful", response);
        if (response && response.length > 0) {
          const user = response[0];
          sessionStorage.setItem('email', user.email);
          alert("Login successful!");
    
          if (user.role === 'user') {
            this.router.navigate(['/calendar']);
          } else if (user.role === 'admin') {
            this.router.navigate(['/datas']);
          } else if (user.role === 'superAdmin') {
            this.router.navigate(['/users']);
          } else {
            alert("Login failed: Invalid role");
          }
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
