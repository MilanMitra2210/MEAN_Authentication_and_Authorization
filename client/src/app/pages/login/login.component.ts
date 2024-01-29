import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent  implements OnInit{

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm !: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
  }
  login() {
    this.authService.loginService(this.loginForm.value).subscribe({
      next:(res)=>{
        alert(res.message);
        console.log(res.token);
        
        localStorage.setItem("token", res.token);
        this.authService.isLoggedIn$.next(true);
        this.loginForm.reset();
        this.router.navigate(['']);
      },
      error: (err) => {
        alert(err.error.message);
        console.log(err);
      }
    })
  }
}
