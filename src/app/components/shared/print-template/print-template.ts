import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintTransferData } from '../../../models/base.models';

@Component({
  selector: 'app-print-template',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="print-container">
      <div class="document">
        <h2>АКТ ПЕРЕДАЧИ ОБОРУДОВАНИЯ</h2>
        
        <!-- Дата и время столбиком справа -->
        <div class="doc-meta">
          <p>Дата: <strong>{{ data.movedAt | date:'dd.MM.yyyy' }}</strong></p>
          <p>Время: <strong>{{ data.movedAt | date:'HH:mm' }}</strong></p>
        </div>

        <div class="clear"></div>

        <table class="info-table">
          <tr>
            <td class="label">Наименование:</td>
            <td class="value">{{ data.deviceName }}</td>
          </tr>
          <tr>
            <td class="label">Инвентарный номер:</td>
            <td class="value">{{ data.inventoryNumber }}</td>
          </tr>
          <tr>
            <td class="label">Серийный номер:</td>
            <td class="value">{{ data.serialNumber || '—' }}</td>
          </tr>
          <tr>
            <td class="label">Стикер:</td>
            <td class="value">{{ data.sticker || '—' }}</td>
          </tr>
          <tr>
            <td class="label">Откуда:</td>
            <td class="value">{{ data.fromDepartment || 'Не указан' }}</td>
          </tr>
          <tr>
            <td class="label">Куда:</td>
            <td class="value">{{ data.toDepartment }}</td>
          </tr>
          <tr>
            <td class="label">Причина:</td>
            <td class="value">{{ data.reason }}</td>
          </tr>
        </table>

        @if (data.note) {
          <div class="note-section">
            <strong>Примечание:</strong> {{ data.note }}
          </div>
        }

        <!-- Подписи -->
        <div class="signatures">
          <div class="signature-block">
            <div class="sign-header">
              Сдал: {{ getIssuerName() }}
            </div>
            <div class="line"></div>
            <p>(подпись)</p>
          </div>
          
          <div class="signature-block">
            <div class="sign-header">
              Принял: {{ getReceiverName() }}
            </div>
            <div class="line"></div>
            <p>(подпись)</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .print-container { display: none; }
    @media print {
      .print-container {
        display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: white; z-index: 9999; padding: 15mm; box-sizing: border-box;
      }
    }
    .document { font-family: 'Times New Roman', serif; font-size: 12pt; color: black; line-height: 1.5; }
    h2 { text-align: center; text-transform: uppercase; margin-bottom: 20px; font-size: 14pt; }
    .clear { clear: both; }
    .doc-meta { float: right; text-align: left; margin-bottom: 20px; margin-left: 20px; }
    .doc-meta p { margin: 0 0 5px 0; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .info-table td { padding: 8px 10px; border: 1px solid black; }
    .info-table .label { width: 30%; background-color: #f0f0f0; font-weight: bold; }
    .note-section { margin-bottom: 30px; padding: 10px; border: 1px dashed black; }
    .signatures { display: flex; justify-content: space-between; margin-top: 50px; }
    .signature-block { width: 45%; text-align: center; }
    .sign-header { text-align: left; margin-bottom: 30px; font-weight: normal; }
    .line { border-bottom: 1px solid black; margin-bottom: 5px; }
    .signature-block p { font-size: 10pt; color: #555; margin: 0; }
  `]
})
export class PrintTemplateComponent {
  @Input() data!: PrintTransferData;

  getIssuerName(): string {
    // СДАЧА В РЕМОНТ: сдает представитель отдела
    if (this.data.reasonCode === 'repair') {
      return this.data.representative || '________________';
    }
    // ВОЗВРАТ ИЗ РЕМОНТА: сдает оператор
    if (this.data.reasonCode === 'return') {
      return this.data.movedBy || '________________';
    }
    return this.data.movedBy || '________________';
  }

  getReceiverName(): string {
    // СДАЧА В РЕМОНТ: принимает оператор
    if (this.data.reasonCode === 'repair') {
      return this.data.movedBy || '________________';
    }
    // ВОЗВРАТ ИЗ РЕМОНТА: принимает представитель отдела
    if (this.data.reasonCode === 'return') {
      return this.data.representative || '________________';
    }
    return '________________';
  }
}