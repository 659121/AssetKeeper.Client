import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintTransferData } from '../../../models/base.models';

@Component({
  selector: 'app-material-pass-template',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="print-container">
      <div class="document">
        
        <!-- Шапка организации -->
        <div class="header-org">
          ГЛАВНОЕ УПРАВЛЕНИЕ ФЕДЕРАЛЬНОЙ СЛУЖБЫ СУДЕБНЫХ ПРИСТАВОВ ПО СПб
        </div>

        <!-- Заголовок документа -->
        <div class="header-doc">
          <h1>МАТЕРИАЛЬНЫЙ ПРОПУСК</h1>
          <div class="subtitle">(на вывоз материальных средств)</div>
        </div>

        <!-- Верхняя правая часть (Дата/Номер) -->
        <div class="doc-meta">
          <div class="row">
            <span>№</span>
            <span class="underline">{{ data.inventoryNumber }}</span>
          </div>
          <div class="row">
            <span>Дата:</span>
            <span class="underline">{{ data.movedAt | date:'dd.MM.yyyy' }}</span>
          </div>
        </div>

        <div class="clear"></div>

        <!-- Основное содержание -->
        <div class="content">
          
          <!-- Блок разрешения на вывоз -->
          <div class="permission-block">
            <p>Разрешается вывезти с территории</p>
            <p class="org-target">ГУ ФССП России по СПб</p>
            
            <div class="permission-row">
              <span class="underline"></span>
              <span class="sub-label">(кому, ФИО ответственного)</span>
            </div>
            
            <div class="permission-row">
              <!-- Данные выровнены по центру линии -->
              <span class="underline">{{ data.toDepartment }}</span>
              <span class="sub-label">(куда, адресат)</span>
            </div>
          </div>

          <p class="intro">Следующие материальные средства:</p>

          <!-- Таблица с оборудованием -->
          <table class="items-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Инвентарный номер</th>
                <th>Серийный номер</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ data.deviceName }}</td>
                <td style="text-align: center;">{{ data.inventoryNumber }}</td>
                <td style="text-align: center;">{{ data.serialNumber || '—' }}</td>
              </tr>
              <!-- Пустые строки для заполнения вручную -->
              <tr><td>&nbsp;</td><td></td><td></td></tr>
              <tr><td>&nbsp;</td><td></td><td></td></tr>
            </tbody>
          </table>

          <!-- Поля подвала -->
          <div class="fields-section">
            <div class="field-row">
              <span class="label">Основание:</span>
              <span class="value underline">{{ data.reason }}</span>
            </div>
            
            <div class="field-row">
              <span class="label">Пропуск получил:</span>
              <span class="value underline"></span>
              <span class="sub-label">(подпись, Ф.И.О.)</span>
            </div>

            <div class="field-row signature-row">
              <div class="label-block">
                <span class="label">Ответственный за выдачу материальных средств</span>
                <div class="line-block">
                  <span class="underline"></span>
                  <span class="sub-label">(подпись)</span>
                </div>
                <div class="line-block">
                  <span class="underline">{{ data.movedBy || '' }}</span>
                  <span class="sub-label">(Ф.И.О.)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* 1. Скрываем на экране */
    .print-container { display: none; }

    /* 2. Стили печати */
    @media print {
      .print-container {
        display: block;
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: white;
        z-index: 9999;
        padding: 10mm;
        box-sizing: border-box;
      }
    }

    /* 3. Стили самого документа */
    .document {
      font-family: 'Times New Roman', Times, serif;
      font-size: 14pt;
      color: black;
      line-height: 1.5;
    }

    /* Шапка */
    .header-org {
      text-align: center;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 30px;
      font-size: 12pt;
    }

    /* Заголовок */
    .header-doc {
      text-align: center;
      margin-bottom: 25px;
    }
    .header-doc h1 {
      font-size: 18pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0;
    }
    .subtitle {
      font-size: 12pt;
      margin-top: 5px;
    }

    /* Мета-данные (Номер и Дата) */
    .doc-meta {
      float: right;
      text-align: left;
      margin-bottom: 20px;
    }
    .doc-meta .row {
      display: flex;
      margin-bottom: 5px;
    }
    .clear { clear: both; }

    /* Подчеркивание */
    .underline {
      border-bottom: 1px solid black;
      display: inline-block;
      min-width: 150px;
      text-align: center;
      padding: 0 10px;
    }

    /* --- СТИЛИ ДЛЯ БЛОКА РАЗРЕШЕНИЯ (ИСПРАВЛЕНО) --- */
    .permission-block {
      margin-bottom: 20px;
      text-align: center; 
    }
    .permission-block p {
      margin: 0;
    }
    .org-target {
      font-weight: bold;
      margin-bottom: 25px !important; /* УВЕЛИЧЕН ОТСТУП */
    }
    .permission-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 5px;
    }
    .permission-row .underline {
      min-width: 300px; 
      text-align: center; /* ВЫРАВНИВАНИЕ ПО ЦЕНТРУ */
      /* Убран padding-left, чтобы центрирование работало корректно */
    }
    .permission-row .sub-label {
      font-size: 10pt;
      color: #555;
      margin-top: 2px;
    }
    /* ----------------------------------------- */

    /* Таблица */
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
    }
    .items-table th, .items-table td {
      border: 1px solid black;
      padding: 5px 10px;
      text-align: left;
    }
    .items-table th {
      font-weight: bold;
      text-align: center;
    }

    /* Поля */
    .fields-section {
      margin-top: 20px;
    }
    .field-row {
      margin-bottom: 15px;
      display: flex;
      align-items: flex-end;
      flex-wrap: wrap;
    }
    .field-row .label {
      margin-right: 5px;
    }
    .field-row .value {
      flex: 1;
    }
    .sub-label {
      font-size: 10pt;
      color: #555;
      display: block;
      text-align: center;
      margin-top: 2px;
    }

    /* Блок подписи ответственного */
    .signature-row {
      margin-top: 30px;
      display: block;
    }
    .label-block {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .line-block {
      display: flex;
      align-items: flex-end;
      margin-left: 20px;
    }
    .line-block .underline {
      width: 200px;
      margin-right: 10px;
    }
  `]
})
export class MaterialPassTemplateComponent {
  @Input() data!: PrintTransferData;
}