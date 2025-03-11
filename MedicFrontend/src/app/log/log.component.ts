import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrl: './log.component.css'
})
export class LogComponent {
  isSignDivVisiable: boolean  = true;

  constructor(private router: Router, private auth: AuthService, private alertService: AlertService){}


  regModel: any = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  };

  Register() {
    this.auth.Register(this.regModel).subscribe({
      next: (response) => {
        console.log('Registration response:', response); 
        if (response.success) {  
          console.log("Registration successful", response);
          this.alertService.show(response.message); 
          this.regModel = {
            name: '',
            email: '',
            password: '',
            password_confirmation: ''
          };
          this.isSignDivVisiable = false;
        }else {
        console.log('Validation errors:', response.data);
        if (response.data) {
          const errorMessages = Object.values(response.data).flat();
          this.alertService.show(errorMessages.join('\n'));
        } else {
          this.alertService.show(response.message || 'Regisztrációs hiba történt');
        }
      }
    },
    error: (error) => {
      console.error("Registration failed", error);
      this.alertService.show('Szerver hiba történt');
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
          this.alertService.show("Login successful!");
        } else {
          if (response.data) {
            const errorMessages = Object.values(response.data).flat();
            this.alertService.show(errorMessages.join('\n'));
          } else {
            this.alertService.show(response.message || 'Bejelentkezési hiba történt');
          }
        }
      },
      error: (error) => {
        console.error("Login failed", error);
        this.alertService.show(error.error.message || "Login failed");
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
