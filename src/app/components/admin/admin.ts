import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../shared/data-table/data-table';
import { ModalFormComponent } from '../shared/modal-form/modal-form';
import { UserService } from '../../services/user.service';
import { User, UpdateUserRequest } from '../../models/admin.models';
import { TableConfig, ModalConfig } from '../../models/base.models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, ModalFormComponent],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin implements OnInit {
  title = 'Управление пользователями';
  emptyMessage = 'Пользователи не найдены';
  
  data: User[] = [];
  loading = false;
  modalLoading = false;
  isModalOpen = false;
  selectedUser: User | null = null;
  isEditMode = false;

  // Для хранения выбранных ролей в форме
  formRoles: { [key: string]: boolean } = {};

  // Конфигурация таблицы
  tableConfig: TableConfig = {
    columns: [
      { key: 'id', title: 'ID', width: '80px' },
      { key: 'username', title: 'Имя пользователя', sortable: true },
      { 
        key: 'roles', 
        title: 'Роли', 
        type: 'array',
        formatter: (roles: string[]) => this.formatRoles(roles)
      },
      { 
        key: 'isActive', 
        title: 'Статус', 
        type: 'boolean',
        formatter: (isActive: boolean) => isActive ? 'Активен' : 'Заблокирован'
      },
      { 
        key: 'lastLogin', 
        title: 'Последний вход', 
        type: 'date',
        formatter: (date: string) => date ? new Date(date).toLocaleDateString('ru-RU') : 'Никогда'
      }
    ],
    actions: [
      { name: 'edit', label: 'Редактировать', icon: '✏️', color: '#007bff' },
      { 
        name: 'delete', 
        label: 'Удалить', 
        icon: '🗑️', 
        color: '#dc3545',
        condition: (user: User) => user.id !== this.getCurrentUserId()
      }
    ]
  };

  // Конфигурация модального окна (упрощенная, так как роли будем обрабатывать отдельно)
  modalConfig: ModalConfig = {
    title: 'Редактирование пользователя',
    size: 'md',
    fields: [
      { 
        key: 'username', 
        label: 'Имя пользователя', 
        type: 'text', 
        required: true,
        disabled: true
      },
      { 
        key: 'isActive', 
        label: 'Активный', 
        type: 'checkbox'
      }
      // Поле roles удалено из конфигурации, так как будем обрабатывать отдельно
    ]
  };

  availableRoles: string[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadAvailableRoles();
  }

  // Загрузка пользователей
  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.data = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  // Загрузка доступных ролей с сервера
  loadAvailableRoles(): void {
    this.userService.getAvailableRoles().subscribe({
      next: (roles) => {
        this.availableRoles = roles;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        // Fallback на стандартные роли
        this.availableRoles = ['User', 'Admin'];
      }
    });
  }

  // Открытие модального окна для редактирования
  onEdit(user: User): void {
    this.isEditMode = true;
    this.selectedUser = { ...user };
    
    // Инициализируем чекбоксы ролей
    this.initializeRoleCheckboxes(user.roles);
    
    this.isModalOpen = true;
  }

  // Инициализация чекбоксов ролей
  private initializeRoleCheckboxes(userRoles: string[]): void {
    this.formRoles = {};
    this.availableRoles.forEach(role => {
      this.formRoles[role] = userRoles.includes(role);
    });
  }

  // Переключение чекбокса роли
  toggleRole(role: string): void {
    this.formRoles[role] = !this.formRoles[role];
  }

  // Проверка, выбрана ли роль
  isRoleSelected(role: string): boolean {
    return this.formRoles[role] || false;
  }

  // Получить выбранные роли
  getSelectedRoles(): string[] {
    return this.availableRoles.filter(role => this.formRoles[role]);
  }

  // Удаление пользователя
  onDelete(user: User): void {
    if (user.id === this.getCurrentUserId()) {
      alert('Вы не можете удалить свой собственный аккаунт!');
      return;
    }

    if (confirm(`Вы уверены, что хотите удалить пользователя ${user.username}?`)) {
      this.userService.delete(user.id).subscribe({
        next: () => this.loadUsers(),
        error: (error) => console.error('Error deleting user:', error)
      });
    }
  }

  // Обработка действий из таблицы
  onTableAction(event: { action: string; item: User }): void {
    switch (event.action) {
      case 'edit':
        this.onEdit(event.item);
        break;
      case 'delete':
        this.onDelete(event.item);
        break;
    }
  }

  // Клик по строке таблицы
  onRowClick(user: User): void {
    this.onEdit(user);
  }

  // Сохранение данных из модального окна
  onModalSave(formData: any): void {
    if (!this.selectedUser) return;

    const selectedRoles = this.getSelectedRoles();
    
    // Проверяем, что выбрана хотя бы одна роль
    if (selectedRoles.length === 0) {
      alert('Выберите хотя бы одну роль для пользователя');
      return;
    }

    const saveData: UpdateUserRequest = {
      isActive: formData.isActive,
      roles: selectedRoles
    };

    this.modalLoading = true;

    this.userService.update(this.selectedUser.id, saveData).subscribe({
      next: () => {
        this.loadUsers();
        this.onModalCancel();
        this.modalLoading = false;
      },
      error: (error) => {
        console.error('Error saving user:', error);
        this.modalLoading = false;
      }
    });
  }

  // Закрытие модального окна
  onModalCancel(): void {
    this.isModalOpen = false;
    this.selectedUser = null;
    this.isEditMode = false;
    this.formRoles = {};
  }

  // Форматирование ролей для отображения
  private formatRoles(roles: string[]): string {
    return roles.map(role => this.getRoleDisplayName(role)).join(', ');
  }

  // Получить отображаемое имя роли
  getRoleDisplayName(role: string): string {
    const roleNames: { [key: string]: string } = {
      'User': 'Пользователь',
      'Admin': 'Администратор'
    };
    return roleNames[role] || role;
  }

  // Получить ID текущего пользователя
  private getCurrentUserId(): number {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.id || 0;
  }
}