import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.models';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterModule, 
    RouterOutlet
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  currentUser: User | null = null;
  menuItems = [
    { path: '/dashboard/inventory', label: 'Инвентаризация', icon: 'inventory', roles: ['User', 'Admin'] },
    { path: '/dashboard/monitoring', label: 'Мониторинг', icon: 'monitoring', roles: ['User', 'Admin'] },
    { path: '/dashboard/reports', label: 'Отчеты', icon: 'assessment', roles: ['User', 'Admin'] },
    { path: '/dashboard/settings', label: 'Настройки', icon: 'settings', roles: ['User', 'Admin'] },
    { path: '/dashboard/reference-data', label: 'Справочники', icon: 'list_alt', roles: ['Admin'] },
    { path: '/dashboard/admin', label: 'Админ панель', icon: 'admin_panel_settings', roles: ['Admin'] }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
  }

  // Проверяет, есть ли у пользователя доступ к пункту меню
  hasAccess(requiredRoles: string[]): boolean {
    return this.authService.hasAnyRole(requiredRoles);
  }

  // Получаем отображаемое имя роли
  getRolesDisplayName(): string {
    if (!this.currentUser) return '';
    
    const roleNames: { [key: string]: string } = {
      'User': 'Пользователь',
      'Admin': 'Администратор'
    };
    
    return this.currentUser.roles
      .map(role => roleNames[role] || role)
      .join(', ');
  }

  // Выход из системы
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}