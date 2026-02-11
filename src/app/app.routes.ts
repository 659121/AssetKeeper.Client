import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { Dashboard } from './components/dashboard/dashboard';
import { Inventory } from './components/inventory/inventory';
import { Monitoring } from './components/monitoring/monitoring';
import { Settings } from './components/settings/settings';
import { Admin } from './components/admin/admin';
import { ReferenceDataComponent } from './components/reference-data/reference-data';
import { ReportsComponent } from './components/reports/reports';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Страница логина - публичная
  {
    path: 'login',
    component: LoginComponent
  },
  
  // Главная страница - публичная (без полной защиты)
  {
    path: 'dashboard',
    component: Dashboard,
    children: [
      // Перенаправление с /dashboard на /dashboard/inventory
      {
        path: '',
        redirectTo: 'inventory',
        pathMatch: 'full'
      },
      
      // Инвентаризация - публичная (только просмотр), редактирование - для авторизованных
      {
        path: 'inventory',
        component: Inventory
      },
      
      // Мониторинг - публичный
      {
        path: 'monitoring',
        component: Monitoring
      },
      
      // Справочники - публичные (только просмотр), редактирование - для админов
      {
        path: 'reference-data',
        component: ReferenceDataComponent
      },
      
      // Отчеты - публичные
      {
        path: 'reports',
        component: ReportsComponent
      },
      
      // Настройки - только для авторизованных
      {
        path: 'settings',
        component: Settings,
        canActivate: [authGuard],
        data: { roles: ['User', 'Admin'] }
      },
      
      // Админка - только для админов
      {
        path: 'admin',
        component: Admin,
        canActivate: [authGuard],
        data: { roles: ['Admin'] }
      }
    ]
  },
  
  // Перенаправление с корня на дашборд
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  
  // Обработка несуществующих маршрутов
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];