import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableConfig, TableColumn, TableAction } from '../../../models/base.models';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.html',
  styleUrls: ['./data-table.css']
})
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() config!: TableConfig;
  @Input() loading = false;
  @Input() emptyMessage = 'Данные не найдены';
  
  @Output() action = new EventEmitter<{ action: string; item: any }>();
  @Output() rowClick = new EventEmitter<any>();

  onAction(actionName: string, item: any, event: Event): void {
    event.stopPropagation();
    this.action.emit({ action: actionName, item });
  }

  onRowClick(item: any): void {
    this.rowClick.emit(item);
  }

  // Форматирование значения для отображения
  formatValue(value: any, column: TableColumn): string {
    if (column.formatter) {
      return column.formatter(value);
    }

    switch (column.type) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'boolean':
        return value ? 'Да' : 'Нет';
      case 'array':
        return Array.isArray(value) ? value.join(', ') : String(value);
      default:
        return String(value ?? '');
    }
  }

  // Проверка условия для действия
  canShowAction(action: TableAction, item: any): boolean {
    return !action.condition || action.condition(item);
  }
}