import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  regModel: any = {
    uname: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private auth: AuthService, private router: Router) { }

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

  register() {
    if (this.regModel.password !== this.regModel.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    this.auth.register(this.regModel).subscribe({
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
}
