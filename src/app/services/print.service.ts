// src/app/services/print.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PrintTransferData } from '../models/base.models';

// Типы документов
export type PrintType = 'transfer' | 'pass';

export interface PrintState {
  type: PrintType;
  data: PrintTransferData;
}

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  // Храним состояние с типом документа
  private printStateSubject = new BehaviorSubject<PrintState | null>(null);
  public printState$: Observable<PrintState | null> = this.printStateSubject.asObservable();

  constructor() {}

  printTransferDocument(data: PrintTransferData): void {
    this.print({ type: 'transfer', data });
  }

  printMaterialPass(data: PrintTransferData): void {
    this.print({ type: 'pass', data });
  }

  private print(state: PrintState): void {
    this.printStateSubject.next(state);
    setTimeout(() => {
      window.print();
      // Опционально: очищаем состояние после печати, чтобы шаблон не висел в DOM
      setTimeout(() => this.printStateSubject.next(null), 100);
    }, 100);
  }
}