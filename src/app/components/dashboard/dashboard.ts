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
    { path: '/dashboard/inventory', label: 'Инвентаризация', icon: 'inventory', roles: ['user', 'admin'] },
    { path: '/dashboard/monitoring', label: 'Мониторинг', icon: 'monitoring', roles: ['user', 'admin'] },
    { path: '/dashboard/settings', label: 'Настройки', icon: 'settings', roles: ['user', 'admin'] },
    { path: '/dashboard/admin', label: 'Админ панель', icon: 'admin_panel_settings', roles: ['admin'] }
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
  getRoleDisplayName(): string {
    if (!this.currentUser) return '';
    
    const roleNames: { [key: string]: string } = {
      'User': 'Пользователь',
      'Admin': 'Администратор'
    };
    
    return roleNames[this.currentUser.role.toLowerCase()] || this.currentUser.role;
  }

  // Выход из системы
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}