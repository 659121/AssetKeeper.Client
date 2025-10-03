import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
export class LoginComponent implements OnInit {
  isLoginMode = true;
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  returnUrl = '/dashboard';
  sessionExpired = false;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const url = new URL(window.location.href);
    let returnUrl = url.searchParams.get('returnUrl');
    const reason = url.searchParams.get('reason');
    
    // Если returnUrl указывает на login, используем dashboard по умолчанию
    if (returnUrl && returnUrl.includes('/login')) {
      returnUrl = '/dashboard';
    }
    
    this.returnUrl = returnUrl || '/dashboard';
    this.sessionExpired = reason === 'session_expired';
    
    //console.log('🔑 Login component initialized:', { 
    //  returnUrl: this.returnUrl, 
    //  sessionExpired: this.sessionExpired 
    //});
    
    if (this.sessionExpired) {
      this.errorMessage = 'Сессия истекла. Пожалуйста, войдите снова.';
    }
  }

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
        if (this.authService.currentUserValue) {
          // Используем navigate вместо navigateByUrl для лучшего контроля
          this.router.navigate([this.returnUrl]).then(success => {
            if (!success) {
              this.router.navigate(['/dashboard']);
            }
          });
        } else {
          this.errorMessage = 'Ошибка авторизации. Попробуйте снова.';
          console.error('No user data after login');
        }
        this.isLoading = false
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