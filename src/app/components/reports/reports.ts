import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../shared/data-table/data-table';
import { ReferenceDataService } from '../../services/reference-data.service';
import { DepartmentStats } from '../../models/reference.models';
import { TableConfig } from '../../models/base.models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class ReportsComponent implements OnInit {
  title = 'Отчеты';
  
  // Статистика
  departmentStats: DepartmentStats[] = [];
  loadingStats = false;
  
  // Вычисляемые значения
  totalDevices = 0;
  activeDevices = 0;
  repairDevices = 0;
  departmentsCount = 0;

  // Конфигурация таблицы
  statsTableConfig: TableConfig = {
    columns: [
      { 
        key: 'departmentName', 
        title: 'Отдел',
        type: 'text'
      },
      { 
        key: 'deviceCount', 
        title: 'Всего устройств',
        type: 'number'
      },
      { 
        key: 'activeCount', 
        title: 'Активных',
        type: 'number'
      },
      { 
        key: 'repairCount', 
        title: 'В ремонте',
        type: 'number'
      }
    ]
  };

  constructor(private referenceService: ReferenceDataService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.loadingStats = true;
    this.referenceService.getStatistics().subscribe({
      next: (data) => {
        this.departmentStats = data;
        this.calculateTotals();
        this.loadingStats = false;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        this.loadingStats = false;
        alert('Ошибка при загрузке статистики');
      }
    });
  }

  calculateTotals(): void {
    this.totalDevices = this.departmentStats.reduce((sum, stat) => sum + stat.deviceCount, 0);
    this.activeDevices = this.departmentStats.reduce((sum, stat) => sum + stat.activeCount, 0);
    this.repairDevices = this.departmentStats.reduce((sum, stat) => sum + stat.repairCount, 0);
    this.departmentsCount = this.departmentStats.length;
  }
}