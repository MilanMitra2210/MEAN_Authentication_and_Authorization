import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../states/app.state';
import { selectCount } from '../../states/counter/counter.selector';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  count$: Observable<number>;

  constructor(private store: Store<AppState>){
    this.count$ = this.store.select(selectCount)
  }

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
