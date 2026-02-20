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
        
        <!-- 1. Дата и время столбиком справа -->
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

        <!-- 2. Подписи с надписями сверху -->
        <div class="signatures">
          <div class="signature-block">
            <!-- Блок "Передал" -->
            <div class="sign-header">
              Передал: {{ data.movedBy || '________________' }}
            </div>
            <div class="line"></div>
            <p>(подпись)</p>
          </div>
          
          <div class="signature-block">
             <!-- Блок "Получил" -->
             <!-- Выводим отдел, так как ФИО получателя в системе обычно нет -->
            <div class="sign-header">
              Получил: _____________________
            </div>
            <div class="line"></div>
            <p>(подпись)</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* 1. Скрываем на экране */
    .print-container { 
      display: none; 
    }

    /* 2. Стили для печати */
    @media print {
      .print-container {
        display: block;
        position: absolute;
        top: 0; 
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 9999;
        padding: 15mm; 
        box-sizing: border-box; 
      }
    }

    /* 3. Стили документа */
    .document {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      color: black;
      line-height: 1.5;
    }

    h2 {
      text-align: center;
      text-transform: uppercase;
      margin-bottom: 20px;
      font-size: 14pt;
    }

    .clear { clear: both; }

    /* Дата и время столбиком справа */
    .doc-meta {
      float: right;
      text-align: left; /* Текст слева внутри блока */
      margin-bottom: 20px;
      margin-left: 20px;
    }
    .doc-meta p {
      margin: 0 0 5px 0;
    }

    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    .info-table td {
      padding: 8px 10px;
      border: 1px solid black;
    }

    .info-table .label {
      width: 30%;
      background-color: #f0f0f0;
      font-weight: bold;
    }

    .note-section {
      margin-bottom: 30px;
      padding: 10px;
      border: 1px dashed black;
    }

    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 50px; /* Отступ от таблицы */
    }

    .signature-block {
      width: 45%;
      text-align: center;
    }

    /* Надпись над линией */
    .sign-header {
      text-align: left;
      margin-bottom: 30px; /* Отступ до линии подписи */
      font-weight: normal;
    }

    .line {
      border-bottom: 1px solid black;
      margin-bottom: 5px;
    }
    
    .signature-block p {
        font-size: 10pt;
        color: #555;
        margin: 0;
    }
  `]
})
export class PrintTemplateComponent {
  @Input() data!: PrintTransferData;
}