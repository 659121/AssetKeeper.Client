import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Unauthorized - токен истек или невалиден
        console.log('401 error - redirecting to login');
        
        // Очищаем данные пользователя
        authService.logout();
        
        // Получаем текущий URL
        const currentUrl = router.url;
        
        // Проверяем, не находимся ли мы уже на странице логина
        if (currentUrl.includes('/login')) {
          return throwError(() => error);
        }
        
        // Перенаправляем на страницу логина
        router.navigate(['/login'], {
          queryParams: { 
            returnUrl: currentUrl,
            reason: 'session_expired'
          },
          replaceUrl: true // Заменяем текущий URL в истории
        });
      }
      
      // Пробрасываем ошибку дальше для обработки в компонентах
      return throwError(() => error);
    })
  );
};