import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AlertService } from '../alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-log',
    templateUrl: './log.component.html',
    styleUrl: './log.component.css',
    standalone: false
})
export class LogComponent {
  isSignDivVisiable: boolean  = true;

  constructor(private router: Router, private auth: AuthService, private alertService: AlertService, private translate: TranslateService){}


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
          this.alertService.show(this.translate.instant('alerts.log.regsuccess'));
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
          this.alertService.show(response.message || this.translate.instant('alerts.log.regfail'));
        }
      }
    },
    error: (error) => {
      console.error("Registration failed", error);
      this.alertService.show(this.translate.instant('alerts.log.regfail'));
    }
  });
  }

  loginModel:any={
    email: '',
    password: ''
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  Login() {
    if (!this.loginModel.email) {
      this.alertService.show(this.translate.instant('alerts.log.emailRequired'));
      return;
    }

    if (!this.validateEmail(this.loginModel.email)) {
        this.alertService.show(this.translate.instant('alerts.log.emailInvalid'));
        return;
    }

    if (!this.loginModel.password) {
        this.alertService.show(this.translate.instant('alerts.log.passwordRequired'));
        return;
    }
    this.auth.Login(this.loginModel).subscribe({
      next: (response: any) => {
        console.log("Login successful", response);
        if (response.success) {  
          console.log("Login response:", response);
          const adminLevel = response.data.user.admin;
          localStorage.setItem('token', response.data.token);
          sessionStorage.setItem('email', this.loginModel.email);
          sessionStorage.setItem('role', adminLevel);
          this.alertService.show(this.translate.instant('alerts.log.logsuccess'));
        } else {
          if (response.data) {
            const errorMessages = Object.values(response.data).flat();
            this.alertService.show(errorMessages.join('\n'));
          } else {
            this.alertService.show(response.message || this.translate.instant('alerts.log.logfail'));
          }
        }
      },
      error: (error) => {
        console.error("Login failed", error);
        if (error.status === 401) {
            if (error.error?.message === "Ez a fiók ki lett tiltva") {
                this.alertService.show(this.translate.instant('alerts.log.banned'));
            } else if (error.error?.message.includes("Túl sok sikertelen próbálkozás")) {
                this.alertService.show(error.error.message);
            } else if (error.error?.message.includes("próbálkozás maradt")) {
                this.alertService.show(error.error.message);
            } else if (error.error?.message === "Nem megfelelő e-mail vagy jelszó") {
                this.alertService.show(this.translate.instant('alerts.log.invalid'));
            } else {
                this.alertService.show(this.translate.instant('alerts.log.logfail'));
            }
        } else {
            this.alertService.show(this.translate.instant('alerts.log.logfail'));
        }
        this.loginModel.password = '';
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

  toggleLanguage(language: string): void {
    if (this.auth.languageSignal.value !== language) {
      this.auth.updateLanguage(language);
      console.log('language changed to', language);
    }
  }

  getLanguageIconClass(language: string): string {
    switch(language) {
      case 'en':
        return 'fi fi-us';
      case 'hu':
        return 'fi fi-hu';
      default: 
        return 'fi fi-hu';
    }
  }

}
