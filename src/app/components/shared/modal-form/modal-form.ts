import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalConfig, ModalField } from '../../../models/base.models';

@Component({
  selector: 'app-modal-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-form.html',
  styleUrls: ['./modal-form.css']
})
export class ModalFormComponent {
  @Input() config!: ModalConfig;
  @Input() data: any = {};
  @Input() loading = false;
  @Input() visible = false;
  
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  formData: any = {};

  ngOnChanges(): void {
    if (this.visible) {
      this.formData = { ...this.data };
    }
  }

  onSave(): void {
    this.save.emit(this.formData);
  }

  onCancel(): void {
    this.cancel.emit();
    this.formData = {};
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  trackByField(index: number, field: ModalField): string {
    return field.key;
  }

  // Хелпер для преобразования undefined в false
  isDisabled(field: ModalField): boolean {
    return field.disabled ?? false;
  }

  // Хелпер для проверки required
  isRequired(field: ModalField): boolean {
    return field.required ?? false;
  }
}