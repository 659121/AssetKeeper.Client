import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Настройка маршрутизации
    provideRouter(routes),
    
    // Настройка HttpClient с интерцептором
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    
    // Можно добавить другие провайдеры здесь
    // Например, provideAnimations() если используете анимации
  ]
};