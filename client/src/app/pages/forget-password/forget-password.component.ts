import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export default class ForgetPasswordComponent {

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  forgetForm !: FormGroup;

  ngOnInit(): void {
    this.forgetForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });
  }
  sendEmail() {
    console.log(this.forgetForm.value);
    
    this.authService.sendEmailService(this.forgetForm.value.email).subscribe({
      next:(res)=>{
        alert(res.message);
        this.forgetForm.reset();
        this.router.navigate(['']);
      },
      error: (err) => {
        alert(err.error.message);
        console.log(err);
      }
    });
    
  }
}

