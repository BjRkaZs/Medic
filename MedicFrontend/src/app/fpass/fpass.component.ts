import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../alert.service';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-fpass',
    templateUrl: './fpass.component.html',
    styleUrl: './fpass.component.css',
    standalone: false
})
export class FpassComponent {
  resetPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router, 
    private alertService: AlertService, 
    private auth: AuthService
  ) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  requestReset(): void {
    if (this.resetPasswordForm.valid) {
      const email = this.resetPasswordForm.get('email')?.value || '';
      
      if (email) {
        this.auth.forgotPassword(email).subscribe({
          next: (response) => {
            this.alertService.show('Jelszó visszaállítási link elküldve az e-mail címedre.');
            this.router.navigate(['/signin']);
          },
          error: (error) => {
            this.alertService.show(error.error?.message || 'Hiba történt');
          }
        });
      }
    } else {
      this.alertService.show('Kérjük, adj meg egy érvényes e-mail címet');
    }
  }
}