import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseCrudService } from '../../../services/base-crud.service';
import { TableConfig, ModalConfig } from '../../../models/base.models';
import { DataTableComponent } from '../data-table/data-table';
import { ModalFormComponent } from '../modal-form/modal-form';

@Component({
  selector: 'app-base-crud',
  standalone: true,
  imports: [CommonModule, DataTableComponent, ModalFormComponent],
  template: `
    <div class="crud-container">
      <!-- Заголовок и кнопки -->
      <div class="crud-header">
        <h2>{{ title }}</h2>
        <button (click)="onCreate()" class="btn-primary">
          + Добавить
        </button>
      </div>

      <!-- Таблица -->
      <app-data-table
        [data]="data"
        [config]="tableConfig"
        [loading]="loading"
        [emptyMessage]="emptyMessage"
        (action)="onTableAction($event)"
        (rowClick)="onRowClick($event)">
      </app-data-table>

      <!-- Модальное окно -->
      <app-modal-form
        [config]="modalConfig"
        [data]="selectedItem"
        [loading]="modalLoading"
        [visible]="isModalOpen"
        (save)="onModalSave($event)"
        (cancel)="onModalCancel()">
      </app-modal-form>
    </div>
  `
})
export abstract class BaseCrudComponent<T extends { id: number }> implements OnInit {
  @Input() title = '';
  @Input() emptyMessage = 'Данные не найдены';

  data: T[] = [];
  loading = false;
  modalLoading = false;
  isModalOpen = false;
  selectedItem: T | null = null;
  isEditMode = false;

  abstract tableConfig: TableConfig;
  abstract modalConfig: ModalConfig;
  abstract crudService: BaseCrudService<T>;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.crudService.getAll().subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.loading = false;
      }
    });
  }

  onCreate(): void {
    this.isEditMode = false;
    this.selectedItem = {} as T;
    this.isModalOpen = true;
  }

  onEdit(item: T): void {
    this.isEditMode = true;
    this.selectedItem = { ...item };
    this.isModalOpen = true;
  }

  onDelete(item: T): void {
    if (confirm('Вы уверены, что хотите удалить эту запись?')) {
      this.crudService.delete(item.id).subscribe({
        next: () => this.loadData(),
        error: (error) => console.error('Error deleting:', error)
      });
    }
  }

  onTableAction(event: { action: string; item: T }): void {
    switch (event.action) {
      case 'edit':
        this.onEdit(event.item);
        break;
      case 'delete':
        this.onDelete(event.item);
        break;
    }
  }

  onRowClick(item: T): void {
    this.onEdit(item);
  }

  onModalSave(formData: any): void {
    this.modalLoading = true;

    const operation = this.isEditMode && this.selectedItem
      ? this.crudService.update(this.selectedItem.id, formData)
      : this.crudService.create(formData);

    operation.subscribe({
      next: () => {
        this.loadData();
        this.onModalCancel();
        this.modalLoading = false;
      },
      error: (error) => {
        console.error('Error saving:', error);
        this.modalLoading = false;
      }
    });
  }

  onModalCancel(): void {
    this.isModalOpen = false;
    this.selectedItem = null;
  }
}