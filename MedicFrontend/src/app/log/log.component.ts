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
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    admin:0
  };

  Register() {
    console.log('Registration data:', this.regModel);

    if (this.regModel.password !== this.regModel.password_confirmation) {
      alert("Passwords do not match!");
      return;
    }

    this.auth.Register(this.regModel).subscribe({
      next: (response) => {
        console.log('Registration response:', response); // Debug log
        if (response.success) {  // Check success from ResponseController
          console.log("Registration successful", response);
          alert(response.message); // Will show "Sikeres regisztráció"
          this.router.navigate(['/login']);
        } else {
          alert(response.message || "Registration failed");
        }
      },
      error: (error) => {
        console.error("Registration failed", error);
        // Show validation errors from Laravel
        if (error.error?.errors) {
          // Handle Laravel validation errors
          const errorMessages = Object.values(error.error.errors).flat();
          alert(errorMessages.join('\n'));
        } else if (error.error?.message) {
          alert(error.error.message);
        } else {
          alert('Regisztrációs hiba történt');
        }
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
        if (response.success) {  // Check success from ResponseController
          console.log("Login successful", response);
          sessionStorage.setItem('email', this.loginModel.email);
          alert(response.message); // Will show "Sikeres bejelentkezés"
          this.router.navigate(['/profile']);
        } else {
          alert(response.message || "Login failed");
        }
      },
      error: (error) => {
        console.error("Login failed", error);
        alert(error.error.message || "Login failed");
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
