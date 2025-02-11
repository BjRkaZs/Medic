import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  regModel: any = {}

  constructor(private auth: AuthService) { }

  togglePasswordVisibility(inputId: string, iconId: string) {
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    const iconElement = document.getElementById(iconId) as HTMLElement;

    // Toggle password visibility
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
    this.auth.register(this.regModel).subscribe({
      next: (response) => {
        console.log("Registration successful", response);
        alert("Registration successful!");
      },
      error: (error) => {
        console.error("Registration failed", error);
        alert("Registration failed");
      }
    });
  }
}
