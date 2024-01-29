import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { confirmPasswordValidator } from '../../validators/confirm-password.validator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export default class ResetPasswordComponent implements OnInit {
  fb = inject(FormBuilder);
  activatedRoute = inject(ActivatedRoute);
  authService = inject(AuthService);
  router = inject(Router);

  resetForm!: FormGroup;

  token!: string;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((val) => {
      this.token = val['token'];
      // console.log(this.token);
    });
    this.resetForm = this.fb.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: confirmPasswordValidator('password', 'confirmPassword'),
      }
    );
  }
  reset() {
    const resetObj = {
      token: this.token,
      password: this.resetForm.value.password
    }
    this.authService.resetPasswordService(resetObj).subscribe({
      next:(res)=>{
        alert(res.message);
        this.resetForm.reset();
        this.router.navigate(['login']);
      },
      error: (err) => {
        alert(err.error.message);
        console.log(err);
      }
    });
    
  }
}
