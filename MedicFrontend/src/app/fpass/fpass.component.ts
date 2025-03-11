import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { resetPassword } from '../../../models/fsign.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fpass',
  templateUrl: './fpass.component.html',
  styleUrl: './fpass.component.css'
})
export class FpassComponent {

  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new resetPassword();

  constructor(private fb: FormBuilder,private router: Router) { }
  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    });
  }

  Send() {

    this.resetPasswordObj.newpassword = this.resetPasswordForm.value.password;
    this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirmPassword;

    if (this.resetPasswordObj.newpassword !== this.resetPasswordObj.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Password reset successful", this.resetPasswordObj);
    alert("Password reset successful!");
    this.router.navigate(['/signin']);
  }

}
