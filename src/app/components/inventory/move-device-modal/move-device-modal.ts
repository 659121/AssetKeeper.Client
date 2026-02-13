import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Department, MovementReason } from '../../../models/reference.models';
import { Device } from '../../../models/device.models';

@Component({
  selector: 'app-move-device-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './move-device-modal.html',
  styleUrls: ['./move-device-modal.css']
})
export class MoveDeviceModalComponent implements OnInit {
  @Input() visible = false;
  @Input() loading = false;
  @Input() device: Device | null = null;
  @Input() departments: Department[] = [];  // Получаем из родителя
  @Input() reasons: MovementReason[] = [];  // Получаем из родителя
  
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  formData = {
    toDepartmentId: '',
    reasonId: '',
    note: '',
    newSticker: ''
  };

  constructor() {}

  // Проверяем, выбрана ли причина с кодом "return"
  get isReturnReason(): boolean {
    const selectedReason = this.reasons.find(r => r.id === this.formData.reasonId);
    return selectedReason?.code === 'return';
  }

  ngOnInit(): void {
    if (this.visible) {
      this.resetForm();
      // Предзаполняем отдел по умолчанию текущим отделом устройства
      if (this.device?.currentDepartmentId) {
        this.formData.toDepartmentId = this.device.currentDepartmentId;
      }
    }
  }

  ngOnChanges(): void {
    if (this.visible) {
      this.resetForm();
      // Предзаполняем отдел по умолчанию текущим отделом устройства
      if (this.device?.currentDepartmentId) {
        this.formData.toDepartmentId = this.device.currentDepartmentId;
      }
    }
  }

  private resetForm(): void {
    this.formData = {
      toDepartmentId: this.device?.currentDepartmentId || '',
      reasonId: '',
      note: '',
      newSticker: ''
    };
  }

  isFormValid(): boolean {
    return !!this.formData.toDepartmentId && !!this.formData.reasonId;
  }

  onSave(): void {
    if (!this.isFormValid() || !this.device) return;

    this.save.emit({
      deviceId: this.device.id,
      ...this.formData
    });
  }

  onCancel(): void {
    this.cancel.emit();
    this.resetForm();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}