import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  
  
  authService = inject(AuthService);
  router = inject(Router);
  isLoggedIn !: boolean ;

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(res =>{
      this.isLoggedIn = this.authService.isLoggedIn();
    })
  }
  logout() {
    // Clear token and perform any additional logout logic
    localStorage.removeItem('token');
    this.authService.isLoggedIn$.next(false);
    // Optionally, navigate to the login page or another appropriate route
    // this.router.navigate(['/login']);
  }
}
