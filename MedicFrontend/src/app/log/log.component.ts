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
    password_confirmation: ''
  };

  Register() {
    console.log('Registration data:', this.regModel);

    if (this.regModel.password !== this.regModel.password_confirmation) {
      alert("Passwords do not match!");
      return;
    }

    this.auth.Register(this.regModel).subscribe({
      next: (response) => {
        console.log('Registration response:', response); 
        if (response.success) {  
          console.log("Registration successful", response);
          alert(response.message); 
          window.location.reload();
        } else {
          alert(response.message || "Registration failed");
        }
      },
      error: (error) => {
        console.error("Registration failed", error);
        if (error.error?.errors) {
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
        console.log("Login successful", response);
        if (response.success) {  
          console.log("Login response:", response);
          const adminLevel = response.data.user.admin;
          localStorage.setItem('token', response.data.token);
          sessionStorage.setItem('email', this.loginModel.email);
          sessionStorage.setItem('role', adminLevel);
          if (adminLevel === 2) {
            this.router.navigate(['/users']);
          } else if (adminLevel === 1) {
            this.router.navigate(['/datas']);
          } else {
            this.router.navigate(['/calendar']);
          }
          alert("Login successful!");
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
