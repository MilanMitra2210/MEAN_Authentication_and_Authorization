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
  isLoggedIn !: boolean;

  ngOnInit(): void {
    if(this.authService.getToken()){
      this.authService.setloggedIn();
    }
    this.authService.isLoggedIn().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });
  }
  logout(){
    this.authService.logout();
  }
}
