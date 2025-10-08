import { Component, OnInit } from '@angular/core';
import { 
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  NavigationEnd
} from '@angular/router';
import { CommonModule } from '@angular/common';
import {} from '@angular/router';
import { AuthService } from '../../features/authentication/services/auth.service';
import { MaterialModule } from '../../shared/modules/material.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MaterialModule,
    MatExpansionModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  isSidenavOpen: boolean;
  isLoggedIn$: Observable<boolean>;
  isAdminRoute$: Observable<boolean>;
  isAdmin = false;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.isSidenavOpen = false;
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isAdminRoute$ = this.router.events.pipe(
      startWith(null),
      filter(e => !e || e instanceof NavigationEnd),
      map(() => this.router.url.startsWith('/admin'))
    );
  }

  ngOnInit() {
    this.authService.isAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
  
  logout() {
    this.authService.logout();
    this.isSidenavOpen = false;
    this.router.navigate(['/login']);
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
}
  