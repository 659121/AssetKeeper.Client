import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from '../shared/data-table/data-table';
import { ModalFormComponent } from '../shared/modal-form/modal-form';
import { TabsComponent } from '../shared/tabs/tabs';
import { ReferenceDataService } from '../../services/reference-data.service';
import { 
  Department, 
  DeviceStatus, 
  MovementReason,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
  CreateReasonRequest,
  UpdateReasonRequest
} from '../../models/reference.models';
import { TableConfig, ModalConfig } from '../../models/base.models';

@Component({
  selector: 'app-reference-data',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTableComponent,
    ModalFormComponent,
    TabsComponent
  ],
  templateUrl: './reference-data.html',
  styleUrls: ['./reference-data.css']
})
export class ReferenceDataComponent implements OnInit {
  title = 'Справочники';
  
  // Вкладки
  tabs = [
    { id: 'departments', label: 'Отделы' },
    { id: 'statuses', label: 'Статусы' },
    { id: 'reasons', label: 'Причины' }
  ];
  activeTab = 'departments';

  // Данные
  departments: Department[] = [];
  statuses: DeviceStatus[] = [];
  reasons: MovementReason[] = [];
  
  // Загрузка
  loadingDepartments = false;
  loadingStatuses = false;
  loadingReasons = false;
  modalLoading = false;
  
  // Модальные окна
  isDepartmentModalOpen = false;
  isReasonModalOpen = false;
  selectedDepartment: Department | null = null;
  selectedReason: MovementReason | null = null;
  isDepartmentEditMode = false;
  isReasonEditMode = false;

  // Конфигурации таблиц
  departmentsTableConfig: TableConfig = {
    columns: [
      { key: 'code', title: 'Код', type: 'number' },
      { key: 'name', title: 'Название', type: 'text' },
      { 
        key: 'isActive', 
        title: 'Активен', 
        type: 'boolean',
        formatter: (value: boolean) => value ? '✅' : '❌'
      }
    ],
    actions: [
      { 
        name: 'edit', 
        label: 'Редактировать',
        icon: '✏️',
        color: '#007bff'
      },
      { 
        name: 'delete', 
        label: 'Удалить',
        icon: '🗑️',
        color: '#dc3545',
        condition: (dept: Department) => dept.isActive
      }
    ]
  };

  statusesTableConfig: TableConfig = {
    columns: [
      { key: 'code', title: 'Код', type: 'text' },
      { key: 'name', title: 'Название', type: 'text' },
      { key: 'sortOrder', title: 'Порядок', type: 'number' },
      { 
        key: 'isActive', 
        title: 'Активен', 
        type: 'boolean',
        formatter: (value: boolean) => value ? '✅' : '❌'
      }
    ]
  };

  reasonsTableConfig: TableConfig = {
    columns: [
      { key: 'code', title: 'Код', type: 'text' },
      { key: 'name', title: 'Название', type: 'text' },
      { key: 'description', title: 'Описание', type: 'text' },
      { key: 'sortOrder', title: 'Порядок', type: 'number' },
      { 
        key: 'isActive', 
        title: 'Активен', 
        type: 'boolean',
        formatter: (value: boolean) => value ? '✅' : '❌'
      }
    ],
    actions: [
      { 
        name: 'edit', 
        label: 'Редактировать',
        icon: '✏️',
        color: '#007bff'
      },
      { 
        name: 'delete', 
        label: 'Удалить',
        icon: '🗑️',
        color: '#dc3545',
        condition: (reason: MovementReason) => reason.isActive
      }
    ]
  };

  // Конфигурации модальных окон
  departmentModalConfig: ModalConfig = {
    title: 'Добавить отдел',
    size: 'md',
    fields: [
      {
        key: 'code',
        label: 'Код отдела',
        type: 'number',
        required: true
      },
      {
        key: 'name',
        label: 'Название',
        type: 'text',
        required: true
      },
      {
        key: 'isActive',
        label: 'Активен',
        type: 'checkbox'
      }
    ]
  };

  reasonModalConfig: ModalConfig = {
    title: 'Добавить причину',
    size: 'md',
    fields: [
      {
        key: 'code',
        label: 'Код',
        type: 'text',
        required: true
      },
      {
        key: 'name',
        label: 'Название',
        type: 'text',
        required: true
      },
      {
        key: 'description',
        label: 'Описание',
        type: 'textarea'
      },
      {
        key: 'sortOrder',
        label: 'Порядок сортировки',
        type: 'number',
        required: true
      },
      {
        key: 'isActive',
        label: 'Активна',
        type: 'checkbox'
      }
    ]
  };

  constructor(private referenceService: ReferenceDataService) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadStatuses();
    this.loadReasons();
  }

  // Загрузка данных
  loadDepartments(): void {
    this.loadingDepartments = true;
    this.referenceService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.loadingDepartments = false;
      },
      error: (error: any) => {
        console.error('Error loading departments:', error);
        this.loadingDepartments = false;
        alert('Ошибка при загрузке списка отделов');
      }
    });
  }

  loadStatuses(): void {
    this.loadingStatuses = true;
    this.referenceService.getStatuses().subscribe({
      next: (data) => {
        this.statuses = data;
        this.loadingStatuses = false;
      },
      error: (error: any) => {
        console.error('Error loading statuses:', error);
        this.loadingStatuses = false;
        alert('Ошибка при загрузке списка статусов');
      }
    });
  }

  loadReasons(): void {
    this.loadingReasons = true;
    this.referenceService.getReasons().subscribe({
      next: (data) => {
        this.reasons = data;
        this.loadingReasons = false;
      },
      error: (error: any) => {
        console.error('Error loading reasons:', error);
        this.loadingReasons = false;
        alert('Ошибка при загрузке списка причин');
      }
    });
  }

  // Обработка вкладок
  onTabChange(tabId: string): void {
    this.activeTab = tabId;
  }

  // Отделы
  openCreateDepartmentModal(): void {
    this.isDepartmentEditMode = false;
    this.selectedDepartment = null;
    this.departmentModalConfig.title = 'Добавить отдел';
    this.isDepartmentModalOpen = true;
  }

  onDepartmentRowClick(department: Department): void {
    this.onDepartmentEdit(department);
  }

  onDepartmentAction(event: { action: string; item: Department }): void {
    switch (event.action) {
      case 'edit':
        this.onDepartmentEdit(event.item);
        break;
      case 'delete':
        this.onDepartmentDelete(event.item);
        break;
    }
  }

  onDepartmentEdit(department: Department): void {
    this.isDepartmentEditMode = true;
    this.selectedDepartment = { ...department };
    this.departmentModalConfig.title = 'Редактировать отдел';
    this.isDepartmentModalOpen = true;
  }

  onDepartmentDelete(department: Department): void {
    if (confirm(`Вы уверены, что хотите удалить отдел "${department.name}"?`)) {
      this.referenceService.deleteDepartment(department.id).subscribe({
        next: () => {
          this.loadDepartments();
        },
        error: (error: any) => {
          console.error('Error deleting department:', error);
          alert('Ошибка при удалении отдела');
        }
      });
    }
  }

  onDepartmentSave(formData: any): void {
    this.modalLoading = true;

    if (this.isDepartmentEditMode && this.selectedDepartment) {
      // Обновление
      const updateData: UpdateDepartmentRequest = {
        id: this.selectedDepartment.id,
        code: Number(formData.code),
        name: formData.name,
        isActive: formData.isActive ?? true
      };

      this.referenceService.updateDepartment(updateData.id, updateData).subscribe({
        next: () => {
          this.loadDepartments();
          this.onDepartmentModalCancel();
          this.modalLoading = false;
        },
        error: (error: any) => {
          console.error('Error updating department:', error);
          alert('Ошибка при обновлении отдела');
          this.modalLoading = false;
        }
      });
    } else {
      // Создание
      const createData: CreateDepartmentRequest = {
        code: Number(formData.code),
        name: formData.name
      };

      this.referenceService.createDepartment(createData).subscribe({
        next: () => {
          this.loadDepartments();
          this.onDepartmentModalCancel();
          this.modalLoading = false;
        },
        error: (error: any) => {
          console.error('Error creating department:', error);
          alert('Ошибка при создании отдела');
          this.modalLoading = false;
        }
      });
    }
  }

  onDepartmentModalCancel(): void {
    this.isDepartmentModalOpen = false;
    this.selectedDepartment = null;
    this.isDepartmentEditMode = false;
  }

  // Причины
  openCreateReasonModal(): void {
    this.isReasonEditMode = false;
    this.selectedReason = null;
    this.reasonModalConfig.title = 'Добавить причину';
    this.isReasonModalOpen = true;
  }

  onReasonRowClick(reason: MovementReason): void {
    this.onReasonEdit(reason);
  }

  onReasonAction(event: { action: string; item: MovementReason }): void {
    switch (event.action) {
      case 'edit':
        this.onReasonEdit(event.item);
        break;
      case 'delete':
        this.onReasonDelete(event.item);
        break;
    }
  }

  onReasonEdit(reason: MovementReason): void {
    this.isReasonEditMode = true;
    this.selectedReason = { ...reason };
    this.reasonModalConfig.title = 'Редактировать причину';
    this.isReasonModalOpen = true;
  }

  onReasonDelete(reason: MovementReason): void {
    if (confirm(`Вы уверены, что хотите удалить причину "${reason.name}"?`)) {
      this.referenceService.deleteReason(reason.id).subscribe({
        next: () => {
          this.loadReasons();
        },
        error: (error: any) => {
          console.error('Error deleting reason:', error);
          alert('Ошибка при удалении причины');
        }
      });
    }
  }

  onReasonSave(formData: any): void {
    this.modalLoading = true;

    if (this.isReasonEditMode && this.selectedReason) {
      // Обновление
      const updateData: UpdateReasonRequest = {
        id: this.selectedReason.id,
        code: formData.code,
        name: formData.name,
        description: formData.description,
        sortOrder: Number(formData.sortOrder),
        isActive: formData.isActive ?? true
      };

      this.referenceService.updateReason(updateData.id, updateData).subscribe({
        next: () => {
          this.loadReasons();
          this.onReasonModalCancel();
          this.modalLoading = false;
        },
        error: (error: any) => {
          console.error('Error updating reason:', error);
          alert('Ошибка при обновлении причины');
          this.modalLoading = false;
        }
      });
    } else {
      // Создание
      const createData: CreateReasonRequest = {
        code: formData.code,
        name: formData.name,
        description: formData.description,
        sortOrder: Number(formData.sortOrder)
      };

      this.referenceService.createReason(createData).subscribe({
        next: () => {
          this.loadReasons();
          this.onReasonModalCancel();
          this.modalLoading = false;
        },
        error: (error: any) => {
          console.error('Error creating reason:', error);
          alert('Ошибка при создании причины');
          this.modalLoading = false;
        }
      });
    }
  }

  onReasonModalCancel(): void {
    this.isReasonModalOpen = false;
    this.selectedReason = null;
    this.isReasonEditMode = false;
  }
}