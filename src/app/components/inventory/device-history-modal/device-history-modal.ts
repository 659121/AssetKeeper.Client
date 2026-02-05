import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Device, DeviceMovement } from '../../../models/device.models';
import { DeviceService } from '../../../services/device.service';

@Component({
  selector: 'app-device-history-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-history-modal.html',
  styleUrls: ['./device-history-modal.css']
})
export class DeviceHistoryModalComponent implements OnInit {
  @Input() visible = false;
  @Input() device: Device | null = null;
  
  @Output() cancel = new EventEmitter<void>();

  history: DeviceMovement[] = [];
  loading = false;

  constructor(private deviceService: DeviceService) {}

  ngOnInit(): void {
    if (this.visible && this.device) {
      this.loadHistory();
    }
  }

  ngOnChanges(): void {
    if (this.visible && this.device) {
      this.loadHistory();
    }
  }

  private loadHistory(): void {
    if (!this.device) return;

    this.loading = true;
    this.history = [];

    this.deviceService.getHistory(this.device.id).subscribe({
      next: (data) => {
        this.history = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading history:', error);
        this.loading = false;
        alert('Ошибка при загрузке истории перемещений');
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onCancel(): void {
    this.cancel.emit();
    this.history = [];
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}