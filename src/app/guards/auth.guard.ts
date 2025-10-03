import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const currentUser = authService.currentUserValue;
  
  if (currentUser) {
    // Проверяем роли из данных маршрута
    const requiredRoles = route.data?.['roles'] as Array<string>;
    
    if (requiredRoles && !authService.hasAnyRole(requiredRoles)) {
      // Если нет нужной роли, перенаправляем на dashboard
      router.navigate(['/dashboard']);
      return false;
    }
    
    return true;
  }

  // Если пользователь не авторизован, перенаправляем на страницу входа
  router.navigate(['/login'], {
    queryParams: { 
      returnUrl: state.url,
      reason: 'not_authenticated'
    }
  });
  return false;
};