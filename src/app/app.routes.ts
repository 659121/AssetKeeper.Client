import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { Dashboard } from './components/dashboard/dashboard';
import { Inventory } from './components/inventory/inventory';
import { Monitoring } from './components/monitoring/monitoring';
import { Settings } from './components/settings/settings';
import { Admin } from './components/admin/admin';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Страница логина - публичная
  { 
    path: 'login', 
    component: LoginComponent 
  },
  
  // Главная страница - защищена authGuard
  { 
    path: 'dashboard', 
    component: Dashboard,
    canActivate: [authGuard], // Защищаем роут
    children: [
      // Перенаправление с /dashboard на /dashboard/inventory
      { 
        path: '', 
        redirectTo: 'inventory', 
        pathMatch: 'full' 
      },
      
      // Инвентаризация - для user и admin
      { 
        path: 'inventory', 
        component: Inventory,
        data: { roles: ['user', 'admin'] } 
      },
      
      // Мониторинг - для user и admin
      { 
        path: 'monitoring', 
        component: Monitoring,
        data: { roles: ['user', 'admin'] } 
      },
      
      // Настройки - для user и admin
      { 
        path: 'settings', 
        component: Settings,
        data: { roles: ['user', 'admin'] } 
      },
      
      // Админка - только для admin
      { 
        path: 'admin', 
        component: Admin,
        data: { roles: ['admin'] } 
      }
    ]
  },
  
  // Перенаправление с корня на dashboard
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