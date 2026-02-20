import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Добавлен импорт Router
import { DataTableComponent } from '../shared/data-table/data-table';
import { ModalFormComponent } from '../shared/modal-form/modal-form';
import { MoveDeviceModalComponent } from './move-device-modal/move-device-modal';
import { DeviceHistoryModalComponent } from './device-history-modal/device-history-modal';
import { DeviceService } from '../../services/device.service';
import { ReferenceDataService } from '../../services/reference-data.service';
import { AuthService } from '../../services/auth.service';
import { PrintService } from '../../services/print.service';
import { PrintTransferData } from '../../models/base.models';
import { 
  Device, 
  CreateDeviceRequest, 
  UpdateDeviceRequest,
  DeviceListResponse,
  DeviceQueryParams
} from '../../models/device.models';
import { Department, DeviceStatus, MovementReason } from '../../models/reference.models';
import { TableConfig, ModalConfig } from '../../models/base.models';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTableComponent,
    ModalFormComponent,
    MoveDeviceModalComponent,
    DeviceHistoryModalComponent
  ],
  templateUrl: './inventory.html',
  styleUrls: ['./inventory.css']
})
export class Inventory implements OnInit {
  title = 'Инвентаризация';
  emptyMessage = 'Устройства не найдены';

  // Данные
  devices: Device[] = [];
  departments: Department[] = [];
  statuses: DeviceStatus[] = [];
  reasons: MovementReason[] = [];  // Добавили причины
  
  // Фильтры и пагинация
  searchText = '';
  selectedDepartment = '';
  selectedStatus: number | '' = '';
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  
  // Загрузка
  loading = false;
  modalLoading = false;
  moveModalLoading = false;
  
  // Модальные окна
  isModalOpen = false;
  isMoveModalOpen = false;
  isHistoryModalOpen = false;
  selectedDevice: Device | null = null;
  isEditMode = false;

  // Конфигурация таблицы - динамическая в зависимости от авторизации
  tableConfig: TableConfig = {
    columns: [
      { 
        key: 'inventoryNumber', 
        title: 'Инв. номер',
        width: '120px'
      },
      { 
        key: 'serialNumber', // Новая колонка
        title: 'Серийный номер',
        width: '120px',
        formatter: (value: string | null) => value || '—'
      },
      {
        key: 'sticker',
        title: 'Стикер',
        width: '100px',
        formatter: (value: string | null) => value || '—'
      },
      { 
        key: 'name', 
        title: 'Название',
        sortable: true
      },
      { 
        key: 'description', 
        title: 'Описание',
        type: 'text' as const // Исправлено: добавлено as const
      },
      { 
        key: 'currentDepartmentName', 
        title: 'Отдел',
        type: 'text' as const // Исправлено: добавлено as const
      },
      { 
        key: 'currentStatusName', 
        title: 'Статус',
        type: 'text' as const // Исправлено: добавлено as const
      },
      { 
        key: 'createdAt', 
        title: 'Добавлено',
        type: 'date' as const, // Исправлено: добавлено as const
        formatter: (date: string) => new Date(date).toLocaleDateString('ru-RU')
      }
    ],
    actions: []
  };

  // Конфигурация модального окна для СОЗДАНИЯ
  createModalConfig: ModalConfig = {
    title: 'Добавить устройство',
    size: 'md',
    fields: [
      {
        key: 'name',
        label: 'Название',
        type: 'text',
        required: true
      },
      {
        key: 'inventoryNumber',
        label: 'Инвентарный номер',
        type: 'text',
        required: true
      },
      {
        key: 'serialNumber', // Новое обязательное поле
        label: 'Серийный номер',
        type: 'text',
        required: true
      },
      {
        key: 'sticker',  // Новое поле
        label: 'Номер стикера',
        type: 'text',
        required: true
      },
      {
        key: 'description',
        label: 'Описание',
        type: 'textarea'
      },
      {
        key: 'currentDepartmentId',
        label: 'Отдел',
        type: 'select',
        options: []
      },
      {
        key: 'currentStatusId',
        label: 'Статус',
        type: 'select',
        required: true,
        options: []
      }
    ]
  };

  // Конфигурация модального окна для РЕДАКТИРОВАНИЯ
  editModalConfig: ModalConfig = {
    title: 'Редактировать устройство',
    size: 'md',
    fields: [
      {
        key: 'name',
        label: 'Название',
        type: 'text' as const,
        required: true
      },
      {
        key: 'inventoryNumber',
        label: 'Инвентарный номер',
        type: 'text' as const,
        required: true
      },
      {
        key: 'description',
        label: 'Описание',
        type: 'textarea' as const
      }
    ]
  };

  // Текущая конфигурация (будет меняться динамически)
  currentModalConfig: ModalConfig = this.createModalConfig;

  constructor(
    private deviceService: DeviceService,
    private referenceService: ReferenceDataService,
    private authService: AuthService,
    private router: Router,
    private printService: PrintService
  ) {}

  ngOnInit(): void {
    this.loadReferenceData();
    this.loadDevices();
  }
  
  // Проверяем, авторизован ли пользователь
  get isUserLoggedIn(): boolean {
    return this.authService.currentUserValue !== null;
  }

  // Конфигурация таблицы - динамическая в зависимости от авторизации
  get dynamicTableConfig(): TableConfig {
    const baseColumns = this.tableConfig.columns;

    // Если пользователь не авторизован - показываем только просмотр
    if (!this.isUserLoggedIn) {
      return {
        columns: baseColumns,
        actions: [
          { 
            name: 'viewHistory', 
            label: 'История',
            icon: '📋',
            color: '#17a2b8'
          }
        ]
      };
    }

    // Если авторизован - показываем кнопки
    return {
      columns: baseColumns,
      actions: [
        { 
          name: 'viewHistory', 
          label: 'История',
          icon: '📋',
          color: '#17a2b8'
        },
        { 
          name: 'move', 
          label: 'Переместить',
          icon: '➡️',
          color: '#ffc107'
        },
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
          color: '#dc3545'
        }
      ]
    };
  }

  // Загрузка справочных данных - ВСЕХ сразу
  private loadReferenceData(): void {
    // Загружаем отделы
    this.referenceService.getDepartments().subscribe({
      next: (depts) => {
        this.departments = depts.filter(d => d.isActive);
        this.updateModalOptions();
      },
      error: (error) => {
        console.error('Error loading departments:', error);
      }
    });

    // Загружаем статусы
    this.referenceService.getStatuses().subscribe({
      next: (statuses) => {
        this.statuses = statuses.filter(s => s.isActive);
        this.updateModalOptions();
      },
      error: (error) => {
        console.error('Error loading statuses:', error);
      }
    });

    // Загружаем причины перемещений
    this.referenceService.getReasons().subscribe({
      next: (reasons) => {
        this.reasons = reasons.filter(r => r.isActive);
      },
      error: (error) => {
        console.error('Error loading reasons:', error);
      }
    });
  }

  // Обновление опций в модальном окне создания
  private updateModalOptions(): void {
    const deptField = this.createModalConfig.fields.find(f => f.key === 'currentDepartmentId');
    if (deptField) {
      deptField.options = this.departments.map(d => ({ 
        value: d.id, 
        label: `${d.name} (${d.code})` 
      }));
    }

    const statusField = this.createModalConfig.fields.find(f => f.key === 'currentStatusId');
    if (statusField) {
      statusField.options = this.statuses.map(s => ({ 
        value: s.id.toString(), 
        label: s.name || '' 
      }));
    }
  }

  // Загрузка устройств
  private loadDevices(): void {
    this.loading = true;

    const params: DeviceQueryParams = {
      searchText: this.searchText || undefined,
      departmentId: this.selectedDepartment || undefined,
      statusId: this.selectedStatus ? Number(this.selectedStatus) : undefined,
      page: this.currentPage,
      pageSize: this.pageSize
    };

    this.deviceService.getAll(params).subscribe({
      next: (response: DeviceListResponse) => {
        this.devices = response.items;
        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading devices:', error);
        this.loading = false;
        alert('Ошибка при загрузке списка устройств');
      }
    });
  }

  // Обработка действий из таблицы
  onTableAction(event: { action: string; item: Device }): void {
    this.selectedDevice = event.item;
    
    switch (event.action) {
      case 'viewHistory':
        this.openHistoryModal();
        break;
      case 'move':
        // Проверяем авторизацию только для действий изменения
        if (!this.isUserLoggedIn) {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url }
          });
          return;
        }
        this.openMoveModal();
        break;
      case 'edit':
        if (!this.isUserLoggedIn) {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url }
          });
          return;
        }
        this.openEditModal();
        break;
      case 'delete':
        if (!this.isUserLoggedIn) {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url }
          });
          return;
        }
        this.onDelete(event.item);
        break;
    }
  }

  // Клик по строке таблицы
  onRowClick(device: Device): void {
    this.selectedDevice = device;
    this.openHistoryModal();
  }

  // Открыть модальное окно создания - только для авторизованных
  openCreateModal(): void {
    if (!this.isUserLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }
    
    this.isEditMode = false;
    this.selectedDevice = null;
    this.currentModalConfig = this.createModalConfig;
    this.isModalOpen = true;
  }

  // Открыть модальное окно редактирования
  openEditModal(): void {
    if (!this.selectedDevice) return;
    
    this.isEditMode = true;
    this.currentModalConfig = this.editModalConfig;
    this.isModalOpen = true;
  }

  // Открыть модальное окно перемещения
  openMoveModal(): void {
    if (!this.selectedDevice) return;
    this.isMoveModalOpen = true;
  }

  // Открыть модальное окно истории
  openHistoryModal(): void {
    if (!this.selectedDevice) return;
    this.isHistoryModalOpen = true;
  }

  // Сохранение из модального окна
  onModalSave(formData: any): void {
    this.modalLoading = true;

    if (this.isEditMode && this.selectedDevice) {
      // Обновление - без отдела и статуса
      const updateData: UpdateDeviceRequest = {
        id: this.selectedDevice.id,
        name: formData.name,
        inventoryNumber: formData.inventoryNumber,
        description: formData.description
      };

      this.deviceService.update(updateData).subscribe({
        next: () => {
          this.loadDevices();
          this.onModalCancel();
          this.modalLoading = false;
        },
        error: (error) => {
          console.error('Error updating device:', error);
          alert('Ошибка при обновлении устройства');
          this.modalLoading = false;
        }
      });
    } else {
      // Создание - с отделом и статусом и ОБЯЗАТЕЛЬНЫМ стикером
      const createData: CreateDeviceRequest = {
        name: formData.name,
        inventoryNumber: formData.inventoryNumber,
        serialNumber: formData.serialNumber.trim(),
        sticker: formData.sticker.trim(),
        description: formData.description || null,
        currentDepartmentId: formData.currentDepartmentId || null,
        currentStatusId: Number(formData.currentStatusId)
      };

      this.deviceService.create(createData).subscribe({
        next: () => {
          this.loadDevices();
          this.onModalCancel();
          this.modalLoading = false;
        },
        error: (error) => {
          console.error('Error creating device:', error);
          alert('Ошибка при создании устройства');
          this.modalLoading = false;
        }
      });
    }
  }

  // Перемещение устройства
  onMoveDevice(formData: any): void {
    if (!this.selectedDevice) return;
    this.moveModalLoading = true;

    const moveData = {
      deviceId: this.selectedDevice.id,
      toDepartmentId: formData.toDepartmentId,
      reasonId: formData.reasonId,
      note: formData.note || null,
      newSticker: formData.newSticker ? formData.newSticker.trim() : null
    };

    this.deviceService.moveDevice(moveData).subscribe({
      next: () => {
        this.loadDevices();
        this.onMoveModalCancel();
        this.moveModalLoading = false;

        alert('Устройство успешно перемещено');
      },
      error: (error) => {
        console.error('Error moving device:', error);
        alert('Ошибка при перемещении устройства');
        this.moveModalLoading = false;
      }
    });
  }

  // Удаление устройства
  onDelete(device: Device): void {
    if (confirm(`Вы уверены, что хотите удалить устройство "${device.name}"?`)) {
      this.deviceService.delete(device.id).subscribe({
        next: () => {
          this.loadDevices();
        },
        error: (error) => {
          console.error('Error deleting device:', error);
          alert('Ошибка при удалении устройства');
        }
      });
    }
  }

  // Закрытие модальных окон
  onModalCancel(): void {
    this.isModalOpen = false;
    this.selectedDevice = null;
    this.isEditMode = false;
    this.currentModalConfig = this.createModalConfig;
  }

  onMoveModalCancel(): void {
    this.isMoveModalOpen = false;
    this.selectedDevice = null;
  }

  onHistoryModalCancel(): void {
    this.isHistoryModalOpen = false;
    this.selectedDevice = null;
  }

  // Обработка изменений фильтров
  onSearchChange(): void {
    this.currentPage = 1;
    this.loadDevices();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadDevices();
  }

  resetFilters(): void {
    this.searchText = '';
    this.selectedDepartment = '';
    this.selectedStatus = '';
    this.currentPage = 1;
    this.loadDevices();
  }

  // Пагинация
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadDevices();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.loadDevices();
  }
}