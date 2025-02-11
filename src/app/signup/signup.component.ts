import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  regModel:any={}
  constructor(private auth:AuthService){}
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
