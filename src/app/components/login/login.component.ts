import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest, RegisterRequest } from '../../models/auth.models';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoginMode = true; // true = login, false = register
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  // Переключение между логином и регистрацией
  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  // Обработка отправки формы
  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Заполните все поля';
      return;
    }

    if (this.isLoginMode && this.password.length < 6) {
      this.errorMessage = 'Пароль должен быть не менее 6 символов';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isLoginMode) {
      this.login();
    } else {
      this.register();
    }
  }

  // Логин
  private login(): void {
    const loginData: LoginRequest = {
      username: this.username,
      password: this.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.authService.setUserData(response.token);
        this.router.navigate(['/dashboard']);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Ошибка входа. Проверьте логин и пароль.';
        this.isLoading = false;
      }
    });
  }

  // Регистрация
  private register(): void {
    const registerData: RegisterRequest = {
      username: this.username,
      password: this.password
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.errorMessage = 'Регистрация успешна. Теперь вы можете войти.';
        this.isLoginMode = true;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Ошибка регистрации. Возможно, пользователь уже существует.';
        this.isLoading = false;
      }
    });
  }
}