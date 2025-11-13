import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit {
  title = 'Mobie Hub';
  currentYear = new Date().getFullYear();
  mobileMenuOpen = signal(false);
  currentRoute = signal('');
  
  constructor(private router: Router) {}

  ngOnInit(): void {
  
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute.set(event.url);
      
      this.mobileMenuOpen.set(false);
    });
  }
  
   isAdminArea(): boolean {
    return this.currentRoute().startsWith('/admin');
  }
  
 
  toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }
}