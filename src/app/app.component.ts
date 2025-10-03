import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Инициализируем аутентификацию при запуске приложения
    this.authService.initializeAuth();
  }
}