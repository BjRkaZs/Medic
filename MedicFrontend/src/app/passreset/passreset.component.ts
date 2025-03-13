import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AlertService } from '../alert.service';

@Component({
    selector: 'app-passreset',
    templateUrl: './passreset.component.html',
    styleUrl: './passreset.component.css',
    standalone: false
})
export class PassresetComponent implements OnInit {
  resetForm: FormGroup;
  token: string = '';
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private alertService: AlertService
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
      if (!this.token || !this.email) {
        this.alertService.show('Érvénytelen vagy lejárt link');
        this.router.navigate(['/signin']);
      }
    });
  }

  resetPassword() {
    if (this.resetForm.valid) {
      const data = {
        token: this.token,
        email: this.email,
        ...this.resetForm.value
      };

      this.auth.resetPassword(data).subscribe({
        next: () => {
          this.alertService.show('Jelszó sikeresen megváltoztatva');
          this.router.navigate(['/signin']);
        },
        error: (error) => {
          this.alertService.show(error.error?.message || 'Hiba történt');
        }
      });
    }
  }
}